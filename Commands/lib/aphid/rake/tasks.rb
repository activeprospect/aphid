# encoding: UTF-8

require "rake"
require "fileutils"
require File.join(File.dirname(__FILE__), "support")

# Default Task ---------------------------------------------------------------

desc "Defaults to build"
task :default => :build

# Cleanup & Preparation Tasks ------------------------------------------------

desc "Clean up the built project"
task :clean do
  header "Cleaning Project"
  rm_rf "#{ROOT_PATH}/Build"
  puts
end

task :prepare do
  header "Preparing Build Folder"
  mkdir "#{ROOT_PATH}/Build"
  mkdir "#{ROOT_PATH}/Build/Library"
  mkdir "#{ROOT_PATH}/Build/Resources"
  mkdir "#{ROOT_PATH}/Build/Resources/Images"
  mkdir "#{ROOT_PATH}/Build/Resources/Stylesheets"
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
    FileUtils.cp(File.join("Resources", "Templates", "Application.html"), File.join("Build", "index.html"))
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

  puts
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
