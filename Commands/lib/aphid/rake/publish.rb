# encoding: UTF-8

begin
  require "net/ssh"
  require "net/scp"
rescue LoadError
  puts "\nYou'll need Net::SCP to publish this project. Simply run:\n\n"
  puts "  $ gem install net-scp"
  puts "\nand you should be all set!\n\n"
  exit
end

module Aphid
  module Rake
    class Publish

      # Custom Errors --------------------------------------------------------

      class PublishError              < StandardError; end
      class HostStateError            < StandardError; end
      class InvalidReleaseError       < StandardError; end
      class AtomicHostStateError      < StandardError; end

      # Environments ---------------------------------------------------------

      @@current_environment = nil

      #
      # Set the current environment.
      #
      def self.current_environment=(environment)
        @@current_environment = environment.to_sym unless environment.nil?
      end

      #
      # Retrieve the current environment, either as set by the user or the
      # default.
      #
      def self.current_environment
        if @@current_environment.nil?
          @config = eval(File.read("Publish.rb"))
          if @config.has_key? :environments and @config.has_key? :default_environment
            @@current_environment = @config[:default_environment]
          end
        end
        @@current_environment
      rescue Errno::ENOENT
        puts "Error: Missing configuration file (Publish.rb)!"
      end

      # Configuration --------------------------------------------------------

      #
      # Returns the configuration Hash to be used for publishing the
      # application.
      #
      def self.config
        @@config ||= begin
          @config = eval(File.read("Publish.rb"))
          if @config.has_key? :environments
            @config.merge! @config[:environments][self.current_environment]
          end
        end
      rescue Errno::ENOENT
        puts "Error: Missing configuration file (Publish.rb)!"
      end

      # Connections ----------------------------------------------------------

      @@connections = {}

      #
      # Establishes (and caches) an SSH connection to the specified
      # host. Subsequent calls to this method will return the already
      # initialized connection. If the connection has closed since the last
      # attempt to access it, this method will attempt to reconnect before
      # raising an exception.
      #
      def self.connection(host)
        @@connections[host] ||= Net::SSH.start(host, config[:user], :compression => "none")
        if block_given?
          retried = false
          begin
            yield @@connections[host]
          rescue IOError
            puts "  * [#{host}] Lost connection to host. Retrying..."
            @@connections[host] = Net::SSH.start(host, config[:user], :compression => "none")
            unless retried
              retried = true
              retry
            else
              raise $!
            end
          end
        else
          @@connections[host]
        end
      end

      #
      # Disconnects all active connections. This should be called after all
      # remote operations have been performed to prevent warnings about
      # prematurely closed connections.
      #
      def self.disconnect
        @@connections.each { |host, connection| connection.close }
      end

      # Host Setup -----------------------------------------------------------

      #
      # Prepares the remote host(s) for publishing by creating the necessary
      # folder structure in the path specified with the :path key in the
      # configuration. If no +hosts+ are provided, all configured hosts will
      # be processed.
      #
      def self.setup(hosts = nil)
        hosts = parse_hosts(hosts)
        hosts.each do |host|
          connection(host) do |ssh|
            ssh.exec! "mkdir -p \"#{config[:path]}\""
            ssh.exec! "mkdir -p \"#{config[:path]}/releases\""
            ssh.exec! "mkdir -p \"#{config[:path]}/cache\""
            puts "  * [#{host}] Preparing \"#{config[:path]}\" for publishing ..."
          end
        end
      end

      # Publishing -----------------------------------------------------------

      #
      # Publishes the contents of +local_path+ to the specified +hosts+ (or
      # all configured hosts, if none are specified). Returns the release that
      # was published.
      #
      def self.publish(local_path, hosts = nil)
        hosts             = parse_hosts(hosts)
        release           = generate_release_time
        revision          = current_git_revision
        remote_path       = "#{config[:path]}/releases/#{release}"
        remote_cache_path = "#{config[:path]}/cache/"

        # Sanity Check Publish Paths
        hosts.each do |host|
          connection(host) do |ssh|
            puts "  * [#{host}] Sanity checking publish path \"#{remote_path}\" ..."
            unless ssh.exec!("test -d \"#{config[:path]}/releases\" && echo 'exists'") =~ /exists/
              raise HostStateError, "Host #{host} is missing the configured publish path: #{config[:path]}."
            end
          end
        end

        # Publish
        hosts.each do |host|
          connection = connection(host) do |ssh|
            puts "  * [#{host}] Publishing release #{release} to \"#{remote_path}\" ..."
            system "rsync -az --compress-level=9 --delete --rsh=ssh \"#{local_path}/\" #{config[:user]}@#{host}:#{remote_cache_path}"
            ssh.exec! "cp -R #{remote_cache_path} #{remote_path}"
            # ssh.scp.upload! local_path, remote_path, :recursive => true
            ssh.exec! "echo \"#{revision}\" > \"#{remote_path}/.revision\""
          end
        end

        reset_cached_attributes!
        release
      end

      #
      # Removes old published releases on the specified +hosts+ (or all
      # configured hosts, if none are specified). By default, 5 of the most
      # recent releases (in addition to the active release) will be retained.
      # The number of releases to be retained may be specified with the
      # +retain+ argument.
      #
      def self.cleanup(retain = 3, hosts = nil)
        retain        = (retain.nil? or !(retain =~ /^[0-9]+$/)) ? 3 : retain.to_i
        hosts         = parse_hosts(hosts)
        release_times = releases.keys.sort
        active_index  = release_times.index(atomic_release)
        old_releases  = release_times[0, active_index - retain]

        # Return if there are no old releases to clean up
        return false if old_releases.nil? or old_releases.length == 0

        puts "Cleaning up #{old_releases.length} releases ...\n\n"

        old_releases.each do |release|
          release_path = "#{config[:path]}/releases/#{release}"
          releases[release][:hosts].each do |host|
            next unless hosts.include? host
            connection(host) do |ssh|
              ssh.exec! "rm -rf \"#{release_path}\""
              puts "  * [#{host}] Removing release #{release} from \"#{release_path}\" ..."
            end
          end
        end
        reset_cached_attributes!
        true
      end

      # Releases -------------------------------------------------------------

      #
      # Returns the active release.
      #
      def self.active_releases
        @@active_releases ||= begin
          active_releases = {}
          config[:hosts].collect do |host|
            connection(host) do |ssh|
              current_link  = ssh.exec!("ls -l \"#{config[:path]}/current\"").split(" ").last
              release_match = current_link.match(/([0-9]{12}\.[0-9]{2})/)
              puts release_match
              active_releases[host] = release_match ? release_match[1] : false
            end
          end
          active_releases
        end
      rescue
        false
      end

      #
      # Returns the active release.
      #
      def self.active_release(host)
        @@active_release ||= {}
        @@active_release[host] ||= begin
          connection(host) do |ssh|
            current_link  = ssh.exec!("ls -l \"#{config[:path]}/current\"").split(" ").last
            release_match = current_link.match(/([0-9]{12}\.[0-9]{2})/)
            release_match ? release_match[1] : false
          end
        end
      rescue
        false
      end

      #
      # Returns the release that directly preceeds the active release.
      #
      def self.previous_release(host)
        @@previous_release ||= {}
        @@previous_release[host] ||= begin
          release_times = releases(host).keys.sort
          index = release_times.index(active_release(host)) - 1
          index >= 0 ? release_times[index] : false
        end
      rescue
        false
      end

      def self.has_release?(release, host)
        connection(host) do |ssh|
          if folders = ssh.exec!("ls \"#{config[:path]}/releases\"")
            folders = folders.split(/\s+/)
            folders.include? release
          else
            false
          end
        end
      end

      #
      # Returns the release that directly preceeds the active release and is
      # present on all hosts.
      #
      def self.previous_atomic_release
        @@previous_atomic_release ||= begin
          unless self.atomic?
            raise AtomicHostStateError, "Configured hosts are not in an atomic state"
          end

          release_times = releases.keys.sort
          index = release_times.index(atomic_release) - 1
          index >= 0 ? release_times[index] : false
        end
      rescue
        false
      end

      #
      # Enumerates across all configured hosts to validate that they all have
      # the same active release.
      #
      def self.atomic?
        all_active_releases = config[:hosts].collect do |host|
          self.active_release host
        end
        all_active_releases.uniq.length == 1
      end

      def self.atomic_release
        return false unless self.atomic?
        all_active_releases = config[:hosts].collect do |host|
          self.active_release host
        end
        all_active_releases.uniq.reduce
      end

      #
      # Returns the active release.
      #
      def self.atomic_releases
        @@atomic_releases ||= begin
          atomic_releases = releases.collect do |release|
            release[:hosts] == config[:hosts]
          end
        end
      rescue
        false
      end

      #
      # Returns all published releases.
      #
      def self.releases(hosts = nil)
        hosts = parse_hosts(hosts)
        @@releases ||= {}
        @@releases[hosts.to_s] ||= begin
          releases = {}
          hosts.each do |host|
            connection(host) do |ssh|
              if folders = ssh.exec!("ls \"#{config[:path]}/releases\"")
                folders = folders.split(/\s+/)
              else
                return releases
              end

              folders.each do |folder|
                revision = ssh.exec!("cat \"#{config[:path]}/releases/#{folder}/.revision\"").chop
                revision = false unless revision =~ /^([A-Za-z0-9]{40})(-dirty)?$/

                if releases[folder]
                  releases[folder][:hosts] << host
                  releases[folder][:active] = true if (folder == active_release(host))
                else
                  releases[folder] = {
                    :revision  => revision,
                    :dirty     => (revision =~ /dirty/),
                    :timestamp => parse_release_time(folder),
                    :hosts     => [ host ],
                    :active    => (folder == active_release(host)),
                    :atomic    => (atomic? and active_release(host) == atomic_release)
                  }
                end
              end
            end
          end
          releases
        end
      end

      #
      # Sets the active release on the configured hosts by updating the
      # _current_ symlink to point to the requested +release+.
      #
      def self.activate_release(release, hosts = nil)
        hosts = parse_hosts(hosts)
        available_releases = releases(hosts).keys

        # Ensure that the requested release is not the active release...
        # if release == active_release
        #   raise PublishError, "Specified release is the currently active release."
        # end

        # Ensure that the release is available for rollback...
        raise InvalidReleaseError unless available_releases.include? release

        # Ensure that the specified +hosts+ have the requested release
        hosts.each do |host|
          unless has_release? release, host
            raise PublishError, "Release #{release} is not published on all requested hosts."
          end
        end

        # Update the "current" symlink to point to the requested release...
        hosts.each do |host|
          connection(host) do |ssh|
            ssh.exec! "rm \"#{config[:path]}/current\""
            ssh.exec! "ln -sf \"#{config[:path]}/releases/#{release}\" \"#{config[:path]}/current\""
            puts "  * [#{host}] Activating release #{release} ..."
          end
        end
      end

      # ----------------------------------------------------------------------

      private

        #
        # Processes a hosts argument, defaulting to the configured hosts if
        # no hosts were specified. Always returns an array in the case of a
        # single host.
        #
        def self.parse_hosts(hosts)
          if hosts.nil?
            hosts = config[:hosts]
          else
            if hosts.respond_to? :each
              hosts = hosts.collect do |host|
                found = config[:hosts].detect do |configured_host|
                  configured_host =~ /^#{host}/
                end
                unless found
                  raise PublishError, "Host #{host} was not found in the publish configuration."
                end
                found
              end
            else
              found = config[:hosts].detect do |configured_host|
                configured_host =~ /^#{hosts}/
              end
              if found
                hosts = [ found ]
              else
                raise PublishError, "Host #{hosts} was not found in the publish configuration."
              end
            end
          end
          hosts
        end

        #
        # Returns a new release timestamp.
        #
        def self.generate_release_time
          Time.now.utc.strftime("%Y%m%d%H%M.%S")
        end

        #
        # Parses a release timestamp and returns a new Time object.
        #
        def self.parse_release_time(release_time)
          DateTime.strptime(release_time, "%Y%m%d%H%M.%S").to_time
        end

        #
        # Returns the current Git revision of the project.
        #
        def self.current_git_revision
          if dirty?
            "#{current_head}-dirty"
          else
            current_head
          end
        end

        #
        # Resets all cached class attributes to nil. This should be run after
        # any operation that changes the state of the published releases.
        #
        def self.reset_cached_attributes!
          @@active_release = nil
          @@previous_release = nil
          @@previous_atomic_release = nil
          @@releases = nil
          @@atomic_releases = nil
        end

    end
  end
end
