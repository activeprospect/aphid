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

      # Configuration --------------------------------------------------------

      #
      # Returns the configuration Hash to be used for publishing the
      # application.
      #
      def self.config
        @@config ||= eval(File.read("Publish.rb"))
      rescue Errno::ENOENT
        puts "Error: Missing configuration file (Publish.rb)!"
      end

      # Connections ----------------------------------------------------------

      @@connections = {}

      #
      # Establishes (and caches) an SSH connection to the specified
      # host. Subsequent calls to this method will return the already
      # initialized connection.
      #
      def self.connection(host)
        @@connections[host] ||= Net::SSH.start(host, config[:user])
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
          connection = connection(host)
          connection.exec! "mkdir -p \"#{config[:path]}\""
          connection.exec! "mkdir -p \"#{config[:path]}/releases\""
          puts "  * [#{host}] Preparing \"#{config[:path]}\" for publishing ..."
        end
      end

      # Publishing -----------------------------------------------------------

      #
      # Publishes the contents of +local_path+ to the specified +hosts+ (or
      # all configured hosts, if none are specified). Returns the release that
      # was published.
      #
      def self.publish(local_path, hosts = nil)
        hosts       = parse_hosts(hosts)
        release     = generate_release_time
        revision    = current_git_revision
        remote_path = "#{config[:path]}/releases/#{release}"

        # Sanity Check Publish Paths
        hosts.each do |host|
          connection = connection(host)
          puts "  * [#{host}] Sanity checking publish path \"#{remote_path}\" ..."
          unless connection.exec!("test -d \"#{config[:path]}/releases\" && echo 'exists'") =~ /exists/
            raise HostStateError, "Host #{host} is missing the configured publish path: #{config[:path]}."
          end
        end

        # Publish
        hosts.each do |host|
          connection = connection(host)
          puts "  * [#{host}] Publishing release #{release} to \"#{remote_path}\" ..."
          connection.scp.upload! local_path, remote_path, :recursive => true
          connection.exec! "echo \"#{revision}\" > \"#{remote_path}/.revision\""
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
        active_index  = release_times.index(active_release)
        old_releases  = release_times[0, active_index - retain]

        # Return if there are no old releases to clean up
        return false if old_releases.nil? or old_releases.length == 0

        puts "Cleaning up #{old_releases.length} releases ...\n\n"

        old_releases.each do |release|
          release_path   = "#{config[:path]}/releases/#{release}"
          releases[release][:hosts].each do |host|
            next unless hosts.include? host
            connection = connection(host)
            connection.exec! "rm -rf \"#{release_path}\""
            puts "  * [#{host}] Removing release #{release} from \"#{release_path}\" ..."
          end
        end
        reset_cached_attributes!
        true
      end

      # Releases -------------------------------------------------------------

      #
      # Returns the active release.
      #
      def self.active_release
        @@active_release ||= begin
          connection    = connection(config[:hosts].first)
          current_link  = connection.exec!("ls -l \"#{config[:path]}/current\" | awk '{print $11}'")
          release_match = current_link.match(/([0-9]{12}\.[0-9]{2})/)
          release_match ? release_match[1] : false
        end
      rescue
        false
      end

      #
      # Returns the release that directly preceeds the active release.
      #
      def self.previous_release
        @@previous_release ||= begin
          release_times = releases.keys.sort
          index = release_times.index(active_release) - 1
          index >= 0 ? release_times[index] : false
        end
      rescue
        false
      end

      #
      # Returns all published releases.
      #
      def self.releases
        @@releases ||= begin
          releases = {}
          config[:hosts].each do |host|
            connection = connection(host)

            if folders = connection.exec!("ls \"#{config[:path]}/releases\"")
              folders = folders.split(/\s+/)
            else
              return releases
            end

            folders.each do |folder|
              revision = connection.exec!("cat \"#{config[:path]}/releases/#{folder}/.revision\"").chop
              revision = false unless revision =~ /^([A-Za-z0-9]{40})(-dirty)?$/

              if releases[folder]
                releases[folder][:hosts] << host
              else
                releases[folder] = {
                  :revision  => revision,
                  :dirty     => (revision =~ /dirty/),
                  :timestamp => parse_release_time(folder),
                  :hosts     => [ host ],
                  :current   => (folder == active_release)
                }
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
        available_releases = releases.keys

        # Ensure that the requested release is not the active release...
        if release == active_release
          raise PublishError, "Specified release is the currently active release."
        end

        # Ensure that the release is available for rollback...
        raise InvalidReleaseError unless available_releases.include? release

        # Update the "current" symlink to point to the requested release...
        hosts.each do |host|
          connection = connection(host)
          connection.exec! "rm \"#{config[:path]}/current\""
          connection.exec! "ln -sf \"#{config[:path]}/releases/#{release}\" \"#{config[:path]}/current\""
          puts "  * [#{host}] Activating release #{release} ..."
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
            hosts = [ hosts ] unless hosts.respond_to? :each
          end
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
          @@releases = nil
        end

    end
  end
end
