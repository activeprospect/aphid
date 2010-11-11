# encoding: UTF-8

include Aphid::Rake

# Default Task ---------------------------------------------------------------

desc "Defaults to build"
task :default => :build

# Cleanup & Preparation Tasks ------------------------------------------------

desc "Clean up the built project"
task :clean do
  header "Cleaning Project" do
    rm_rf "#{ROOT_PATH}/Build/*"
  end
end

task :prepare do
  header "Preparing Build Folder" do
    mkdir_p "#{ROOT_PATH}/Build/Library"
    mkdir_p "#{ROOT_PATH}/Build/Resources/Images"
    mkdir_p "#{ROOT_PATH}/Build/Resources/Stylesheets"
    mkdir_p "#{ROOT_PATH}/Build/Resources/Templates"
  end
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

  header "Building #{PROJECT_NAME}" do

    # Copy Application Template
    if File.exist? File.join("Resources", "Templates", "Application.html")
      cp File.join("Resources", "Templates", "Application.html"), File.join("Build", "index.html")
    end

    # Copy Templates
    if File.exist? "Resources/Templates"
      Dir.clone! "Resources/Templates", "Build/Resources/Templates"
    end

    # Copy Public Assets
    if File.exist? "Public"
      Dir.clone! "Public", "Build"
    end

    # Sprocketize Source
    SOURCE_FILES.each do |input|
      output = File.join("Build", "Library", File.basename(input))
      sprocketize(output, { :source_Files => [ input ]})
      optimize output
    end

    # Sprocketize Source w/Documentation Intact
    if DOCUMENTATION_SOURCE
      sprocketize(File.join("Build", "Library", File.basename(DOCUMENTATION_SOURCE).gsub(/js$/, "Documented.js")), { :source_files => [ DOCUMENTATION_SOURCE ], :strip_comments => false })
    end

    # Lessify Stylesheets
    STYLESHEET_FILES.each do |input|
      output = File.join("Build", "Resources", "Stylesheets", File.basename(input).gsub(/less/, "css"))
      lessify(input, output)
      optimize output
    end

    # Copy Vendored Aphid
    copy_vendored_aphid_to_build_folder unless PROJECT_NAME == "Aphid"

    # Add Asset Timestamps
    (Dir["Build/**/*.html"] + Dir["Build/**/*.css"]).each do |file|
      add_asset_timestamps file
    end

    # Update Buildstamp
    File.open("Build/.buildstamp", 'w') do |file|
      file.puts Time.now.to_i
    end

  end
end

# Publish Tasks --------------------------------------------------------------

namespace :publish do

  desc "Prepares each configured host for publishing"
  task :setup do
    begin
      hosts = read_environment_variable(:hosts)

      header "Preparing Hosts for Publishing" do
        Publish.setup hosts
      end
    ensure
      Publish.disconnect
    end
  end

  desc "Lists all published releases"
  task :releases do
    begin
      header "Published Releases" do
        hosts    = read_environment_variable(:hosts)
        releases = Publish.releases(hosts)

        if releases.length == 0
          puts "Error: There are no published releases.\n\n"
          exit
        end

        puts "   " + "Release".ljust(18) + "Revision".ljust(11) + "Dirty?".ljust(9) + "Publish Date".ljust(29) + "Hosts"
        puts "".ljust(`stty size`.split(' ')[1].to_i, "-")

        releases.keys.sort.each do |release|
          metadata = releases[release]
          hosts    = metadata[:hosts].collect { |host| host[0, host.index(".")] }
          active   = metadata[:active] ? (metadata[:atomic] ? "*" : "-") : ""

          puts active.ljust(3) + release.ljust(18) + (metadata[:revision] || "-")[0, 8].ljust(11) + (metadata[:dirty] ? "Y" : "N").ljust(9) + metadata[:timestamp].strftime("%Y-%m-%d %I:%M:%S %p %Z").ljust(29) + hosts.join(", ")
        end
        puts "\n- = Active Release, * = Atomic Active Release"
      end
    rescue Publish::HostStateError, Publish::PublishError => e
      puts "Error: #{e.message}\n\n"
    ensure
      Publish.disconnect
    end
  end

  desc "Rollback to the published release specified as RELEASE=YYYYMMDDHHMM.SS"
  task :rollback do
    begin
      release = read_environment_variable(:release)
      hosts   = read_environment_variable(:hosts)

      header "Rolling Back" do

        # Allow the release to be specified as an environment variable...
        unless release.nil? or release =~ /^[0-9]{12}\.[0-9]{2}$/
          puts "Error: You must specify a valid release. Example:\n\n"
          puts "  $ rake publish:rollback RELEASE=YYYYMMDDHHMM.SS\n\n"
          exit
        end

        if release.nil? and !Publish.atomic?
          puts "Error: Cannot rollback atomically as hosts are not in an atomic state.\n\n"
          exit
        end

        # Default to the previous release...
        release = Publish.previous_atomic_release if release.nil?

        # Ensure that there is at least one previously published release...
        unless release
          puts "Error: There are no previous releases to roll back to.\n\n"
          exit
        end

        puts "Rolling back to #{release} ...\n\n"
        Publish.activate_release release, hosts

      end
    rescue Publish::InvalidReleaseError
      puts "\n\nError: #{release} is not a valid release. To list available releases, run:\n\n"
      puts "  $ rake publish:releases\n\n"
    rescue Publish::PublishError => e
      puts "Error: #{e.message}\n\n"
    ensure
      Publish.disconnect
    end
  end

  desc "Cleans up old releases (retains the last 3 by default, override with RETAIN=n)"
  task :cleanup do
    begin
      retain = read_environment_variable(:retain, 3)
      hosts  = read_environment_variable(:hosts)

      header "Cleaning Up Published Releases" do
        if !Publish.cleanup(retain, hosts)
          puts "No releases to clean up!"
        end
      end
    ensure
      Publish.disconnect
    end
  end

end

desc "Publishes the project to the configured hosts"
task :publish do
  begin
    hosts   = read_environment_variable(:hosts)
    release = nil

    header "Publishing Project" do

      # Publish Release
      release = Publish.publish "Build", hosts

      # Activate Release
      Publish.activate_release release, hosts

    end
  rescue Publish::HostStateError, Publish::PublishError => e
    puts "Error: #{e.message}\n\n"
  ensure
    Publish.disconnect
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
