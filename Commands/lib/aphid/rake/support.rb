# encoding: UTF-8

module Aphid
  module Rake
    module Support

      # Sprocketize ------------------------------------------------------------

      def sprocketize(output, options = {})
        sprockets_options = {
          :root         => ROOT_PATH,
          :asset_root   => "Build/Resources/Images",
          :load_path    => [ "Library", "Application", "Vendor/Prototype/src", "Vendor/script.aculo.us/src", "Vendor/excanvas" ],
          :source_files => [ "Library/**/*.js", "Application/**/*.js" ]
        }.merge(options)
        puts "Sprocketizing #{sprockets_options[:source_files]} to #{output} ..."
        sprockets = Sprockets::Secretary.new(sprockets_options)
        sprockets.concatenation.save_to(output)
        sprockets.install_assets
      rescue => e
        $FAILED = true
        if $WATCHING and $GROWL
          begin
            $GROWL.notify "Build Failed", "#{PROJECT_NAME} Build Failed — Sprocketize",
              "An error occurred while compiling JavaScripts with Sprockets:\n\n#{e.message}\n\nReference the console for more information…"
          rescue Errno::ECONNREFUSED
            puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
          end
        end
        puts e
        exit unless $WATCHING
        false
      end

      # Lessify ----------------------------------------------------------------

      def lessify(input, output, options = {})
        puts "Lessifying #{input} to #{output} ..."
        template = File.read(input)
        $LESS_LOAD_PATH = [ "Resources/Stylesheets" ]
        less = Less::Engine.new(template)
        File.open(output, 'w') do |file|
          file.write less.to_css
        end
      rescue => e
        $FAILED = true
        if $WATCHING and $GROWL
          prefix = "An "
          if e.instance_of? Less::SyntaxError
            prefix = "A syntax"
          end
          begin
            $GROWL.notify "Build Failed", "#{PROJECT_NAME} Build Failed — Lessify",
              "#{prefix} error occurred while compiling CSS with Less.\n\nReference the console for more information…"
          rescue Errno::ECONNREFUSED
            puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
          end
        end
        puts e
        exit unless $WATCHING
        false
      end

      # Watch ------------------------------------------------------------------

      def watch_with(tasks)

        begin
          require "filewatcher"
        rescue LoadError
          puts "\nYou'll need FileWatcher to watch for changes. Simply run:\n\n"
          puts "  $ gem install filewatcher"
          puts "\nand you should be all set!\n\n"
          exit
        end

        begin
          require "ruby-growl"
          $GROWL = Growl.new("localhost", PROJECT_NAME, ["Build Succeeded", "Build Failed"])
        rescue LoadError
          header "Growl Support Notice"
          puts "To enable Growl notifications during automated builds, you will need to install ruby-growl by running:\n\n"
          puts "  $ gem install ruby-growl"
          puts "\nOnce installed, you must also enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
        end

        $WATCHING = true
        header "Waiting for Change(s)"
        watched_files = Dir["Application/**/*.js"] \
                      + Dir["Library/**/*.js"] \
                      + Dir["Resources/Stylesheets/**/*.less"] \
                      + Dir["Resources/Templates/**/*.html"] \
                      + Dir["Resources/Images/**/*"] \
                      + Dir["Public/**/*"] \
                      + [ "Vendor/Aphid/Build/.buildstamp" ]
        FileWatcher.new(watched_files).watch do |filename|
          puts filename + " was changed. Rebuilding project...\n"
          tasks.each { |task| Rake::Task[task].reenable }
          tasks.each do |task|
            if $FAILED
              puts
              header "Build Failed!"
              break
            end
            Rake::Task[task].invoke
          end
          if $GROWL and $WATCHING and not $FAILED
            begin
              $GROWL.notify "Build Succeeded", "#{PROJECT_NAME} Build Succeeded",
                "Automated build of #{PROJECT_NAME} has completed successfully."
            rescue Errno::ECONNREFUSED
              puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
            end
          end
          $FAILED = false
          header "Waiting for Change(s)"
        end
      end

      # ------------------------------------------------------------------------

      # TODO Move this to something like Aphid.vendorize! with various options to vendor from gem or git
      def copy_vendored_aphid_to_build_folder
        mkdir "#{ROOT_PATH}/Build/Vendor" unless File.exist? "#{ROOT_PATH}/Build/Vendor"
        mkdir "#{ROOT_PATH}/Build/Vendor/Aphid" unless File.exist? "#{ROOT_PATH}/Build/Vendor/Aphid"
        Dir.clone! "Vendor/Aphid/Build", "Build/Vendor/Aphid", [ "\.git" ]
      end

      # ------------------------------------------------------------------------

      def add_asset_timestamps(filename)
        File.open filename, "r+" do |template|
          puts "Adding asset timestamps to #{filename} ..."
          markup = template.read
          markup.scan(/((link.*href=|script.*src=|img.*src=|url\()"?'?([^"')]+))/).each do |match|
            asset = match[2]
            path = asset =~ /^\.\.\// ? "#{ROOT_PATH}/#{File.dirname(filename)}/#{asset}" : "#{ROOT_PATH}/Build/#{asset}"
            next if asset =~ /^http/
            next if asset =~ /\?[0-9]+$/
            begin
              File.open(path, "r") do |file|
                timestamp = file.mtime.to_i
                markup.sub! asset, "#{asset}?#{timestamp}"
              end
            rescue Errno::ENOENT
              puts "ERROR: Unable to add asset timestamp for missing file '#{path}' (referenced in #{filename})"
              next
            end
          end
          template.rewind and template.write markup
        end
      end

      def optimize(filename)
        output_filename = filename.gsub(/\.([a-z]+)$/, '.Optimized.\1')
        puts "Optimizing #{filename} as #{output_filename} ..."
        # TODO Make this an APHID_ROOT global somewhere
        aphid_root = File.join(File.dirname(__FILE__), "../../../..")
        `java -jar "#{aphid_root}/Vendor/YUI Compressor/yuicompressor-2.4.2.jar" --line-break 80 -o "#{output_filename}" "#{filename}"`
      end

      # ------------------------------------------------------------------------

      def header(message, &block)
        message = " #{message} "
        puts "\n#{message.center(`stty size`.split(' ')[1].to_i, '-')}\n\n"
        if block_given?
          yield
          puts
        end
      end

      def current_head
        `git show-ref --head --hash HEAD`.chop
      end

      def dirty?
        `git diff --shortstat`.chop.length > 0
      end

      def read_environment_variable(name, default = nil)
        name  = name.to_s
        value = if ENV.include? name.upcase
          ENV[name.upcase]
        elsif ENV.include? name.downcase
          ENV[name.downcase]
        else
          default
        end
        if value =~ /,/
          value.split(/,/)
        else
          value
        end
      end

    end
  end
end

include Aphid::Rake::Support
