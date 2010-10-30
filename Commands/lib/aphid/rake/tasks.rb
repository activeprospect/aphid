# encoding: UTF-8

# Default Task ---------------------------------------------------------------

desc "Defaults to build"
task :default => :build

# Cleanup & Preparation Tasks ------------------------------------------------

desc "Clean up the built project"
task :clean do
  header "Cleaning Project"
  rm_rf "#{ROOT_PATH}/Build/*"
  puts
end

task :prepare do
  header "Preparing Build Folder"
  mkdir_p "#{ROOT_PATH}/Build/Library"
  mkdir_p "#{ROOT_PATH}/Build/Resources/Images"
  mkdir_p "#{ROOT_PATH}/Build/Resources/Stylesheets"
  mkdir_p "#{ROOT_PATH}/Build/Resources/Templates"
  puts
end

# Build Tasks ----------------------------------------------------------------

desc "Build the project"
task :build => [ :clean, :prepare ] do

  begin
    require "less"
  rescue LoadError
    puts "\nYou'll need Less to build this project. Simply run:\n\n"
    puts "  $ gem install less"
    puts "\nand you should be all set!\n\n"
    exit
  end

  if File.exists? "#{ROOT_PATH}/Vendor/Sprockets"
    begin
      require "#{ROOT_PATH}/Vendor/Sprockets/lib/sprockets"
    rescue LoadError
      puts "\nYou'll need Sprockets to build this project. Simply run:\n\n"
      puts "  $ git submodule init"
      puts "  $ git submodule update"
      puts "\nand you should be all set!\n\n"
      exit
    end
  else
    begin
      require "sprockets"
    rescue LoadError
      puts "\nYou'll need Sprockets to build this project. Simply run:\n\n"
      puts "  $ gem install sprockets"
      puts "\nand you should be all set!\n\n"
      exit
    end
  end

  header "Building #{PROJECT_NAME}"

  # Copy Application Template
  if File.exist? File.join("Resources", "Templates", "Application.html")
    cp File.join("Resources", "Templates", "Application.html"), File.join("Build", "index.html")
  end

  # Copy Templates
  if File.exist? "Resources/Templates"
    Dir.clone! "Resources/Templates", "Build/Resources/Templates"
  end

  # Sprocketize Source
  SOURCE_FILES.each do |file|
    sprocketize(File.join("Build", "Library", File.basename(file)), { :source_Files => [ file ]})
  end

  # Sprocketize Source w/Documentation Intact
  if DOCUMENTATION_SOURCE
    sprocketize(File.join("Build", "Library", File.basename(DOCUMENTATION_SOURCE).gsub(/js$/, "Documented.js")), { :source_files => [ DOCUMENTATION_SOURCE ], :strip_comments => false })
  end

  # Lessify Stylesheets
  STYLESHEET_FILES.each do |file|
    lessify(file, File.join("Build", "Resources", "Stylesheets", File.basename(file).gsub(/less/, "css")))
  end

  # Copy Vendored Aphid
  copy_vendored_aphid_to_build_folder unless PROJECT_NAME == "Aphid"

  # Update Buildstamp
  File.open("Build/.buildstamp", 'w') do |file|
    file.puts Time.now.to_i
  end

  puts
end

# Publish --------------------------------------------------------------------

namespace :publish do

  desc "Setup"
  task :setup do
    begin
      config = Aphid::Rake::Publish.config

      puts
      puts "  Setting up hosts for publishing:"
      puts

      config[:hosts].each do |host|
        print "    * #{host} ... "
        connection = Aphid::Rake::Publish.connection(host)
        connection.exec! "mkdir -p \"#{config[:path]}\""
        connection.exec! "mkdir -p \"#{config[:path]}/releases\""
        print "done!\n"
      end
      puts
    ensure
      Aphid::Rake::Publish.disconnect
    end
  end

  desc "List all releases currently on the publish hosts"
  task :releases do
    begin
      releases = Aphid::Rake::Publish.releases
      timestamps = releases.keys.sort
      puts
      puts "   " + "Release".ljust(18) + "Revision".ljust(11) + "Dirty?".ljust(9) + "Publish Date".ljust(29) + "Hosts"
      puts "".ljust(`stty size`.split(' ')[1].to_i, "-")
      timestamps.each do |release|
        metadata = releases[release]
        hosts = metadata[:hosts].collect { |host| host[0, host.index(".")] }
        puts (metadata[:current] ? "*" : "").ljust(3) + release.ljust(18) + (metadata[:revision] || "-")[0, 8].ljust(11) + (metadata[:dirty] ? "Y" : "N").ljust(9) + metadata[:timestamp].strftime("%Y-%m-%d %I:%M:%S %p %Z").ljust(29) + hosts.join(", ")
      end
      puts
    ensure
      Aphid::Rake::Publish.disconnect
    end
  end

  desc "Rollback to a previously published release (specified with RELEASE=)"
  task :rollback do
    begin
      config = Aphid::Rake::Publish.config
      available_releases = Aphid::Rake::Publish.releases.keys

      # Allow a specific release to be specified as an environment variable
      release = ENV["RELEASE"] || ENV["release"]
      unless release.nil? or release =~ /^[0-9]{12}\.[0-9]{2}$/
        puts "\nError: You must specify a release to rollback to. For example:\n\n"
        puts "  $ rake publish:rollback RELEASE=YYYYMMDDHHMM.SS\n\n"
        exit
      end

      # Default to the previous release
      if release.nil? or release.strip == ""
        release = Aphid::Rake::Publish.previous_release
      end

      unless available_releases.include? release
        if release
          puts "\nError: Release #{release} was not found. View published releases with:\n\n"
          puts "  $ rake publish:releases\n\n"
        else
          puts "\nError: No previous releases are published.\n\n"
        end
        exit
      end

      puts "\nRolling back to release #{release} ...\n\n"

      # Update Current
      config[:hosts].each do |host|
        connection = Aphid::Rake::Publish.connection(host)
        connection.exec! "rm \"#{config[:path]}/current\""
        connection.exec! "ln -sf \"#{config[:path]}/releases/#{release}\" \"#{config[:path]}/current\""
      end
    ensure
      Aphid::Rake::Publish.disconnect
    end
  end

  desc "Cleanup"
  task :cleanup do
    begin
      config          = Aphid::Rake::Publish.config
      releases        = Aphid::Rake::Publish.releases
      current_release = Aphid::Rake::Publish.current_release
      release_times   = releases.keys.sort
      current_index   = release_times.index(current_release)

      puts
      puts "  Cleaning up releases:"
      puts

      retain = ENV["retain"] || ENV["RETAIN"] || 5

      cleanup = release_times[0, current_index - retain.to_i]
      cleanup.each do |release|
        releases[release][:hosts].each do |host|
          connection = Aphid::Rake::Publish.connection(host)
          puts "    * [#{host}] rm -rf \"#{config[:path]}/releases/#{release}\""
          connection.exec! "rm -rf \"#{config[:path]}/releases/#{release}\""
        end
      end
      puts
    ensure
      Aphid::Rake::Publish.disconnect
    end
  end

end

desc "Publish the project"
task :publish do
  begin
    config   = Aphid::Rake::Publish.config
    release  = Aphid::Rake::Publish.generate_release_time
    revision = Aphid::Rake::Publish.current_git_revision

    puts
    puts "  Publishing built project to remote host(s):"
    puts

    # Publish Release
    config[:hosts].each do |host|
      connection = Aphid::Rake::Publish.connection(host)
      print "    * Uploading to #{host} ... "
      Net::SSH.start(host, config[:user]) do |ssh|
        connection.scp.upload! "Build", "#{config[:path]}/releases/#{release}", :recursive => true, :verbose => true
        connection.exec! "echo \"#{revision}\" > \"#{config[:path]}/releases/#{release}/.revision\""
      end
      print "done!\n"
    end

    # Update Current
    config[:hosts].each do |host|
      connection = Aphid::Rake::Publish.connection(host)
      print "    * Linking current to release #{release} ... "
      connection.exec! "rm \"#{config[:path]}/current\""
      connection.exec! "ln -sf \"#{config[:path]}/releases/#{release}\" \"#{config[:path]}/current\""
      print "done!\n"
    end
    puts
  ensure
    Aphid::Rake::Publish.disconnect
  end
end

# Watcher Tasks --------------------------------------------------------------

$WATCHING = false
$FAILED   = false

desc "Watches for changes and rebuilds the project and documentation as changes occur"
task :watch do
  watch_with WATCH_TASKS
end

desc "Watches for changes and rebuilds the project source as changes occur"
task "watch:source" do
  watch_with WATCH_SOURCE_TASKS
end
