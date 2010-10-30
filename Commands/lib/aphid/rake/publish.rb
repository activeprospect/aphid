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

      @@connections = {}

      #
      # Returns the configuration Hash to be used for publishing the
      # application.
      #
      def self.config
        @@config ||= eval(File.read("Publish.rb"))
      rescue Errno::ENOENT
        puts "Error: Missing configuration file (Publish.rb)!"
      end

      #
      # Establishes (and caches) an SSH connection to the specified
      # host. Subsequent calls to this method will return the already
      # initialized connection.
      #
      def self.connection(host)
        @@connections[host] ||= Net::SSH.start(host, config[:user])
      end

      def self.disconnect
        @@connections.each { |host, connection| connection.close }
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
      # Returns the currently published release.
      #
      def self.current_release
        @@current_release ||= begin
          connection    = connection(config[:hosts].first)
          current_link  = connection.exec!("ls -l \"#{config[:path]}/current\" | awk '{print $11}'")
          release_match = current_link.match(/([0-9]{12}\.[0-9]{2})/)
          release_match ? release_match[1] : false
        end
      end

      #
      # Returns the release that directly preceeds the currently published
      # release.
      #
      def self.previous_release
        @@previous_release ||= begin
          release_times = releases.keys.sort
          index         = release_times.index(current_release) - 1
          index >= 0 ? release_times[index] : false
        end
      end

      #
      # Returns all published releases.
      #
      def self.releases
        @@releases ||= begin
          releases   = {}
          config[:hosts].each do |host|
            connection = connection(host)
            folders    = connection.exec!("ls \"#{config[:path]}/releases\"").split(/\s+/)

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
                  :current   => (folder == current_release)
                }
              end
            end
          end
          releases
        end
      end

    end
  end
end
