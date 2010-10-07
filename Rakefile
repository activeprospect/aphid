# encoding: UTF-8

require 'rubygems'
require 'rake'
require 'rake/gempackagetask'

ROOT_PATH          = File.expand_path(File.dirname(__FILE__))
DEFAULT_TASKS      = [ :clean, :build, "docs:build", "demo:update", "templates:update" ]
WATCH_SOURCE_TASKS = [ :clean, :build ]
WATCH_DOCS_TASKS   = [ "docs:build", "demo:update", "templates:update" ]

$WATCHING  = false
$FAILED    = false

# Support Methods ------------------------------------------------------------

def header(message)
  message = " #{message} "
  puts "\n#{message.center(`stty size`.split(' ')[1].to_i, '-')}\n\n"
end

# Check Vendor Dependencies --------------------------------------------------

begin
  require "maruku"
rescue LoadError
  puts "\nYou'll need Maruku to build this project. Simply run:\n\n"
  puts "  $ gem install maruku"
  puts "\nand you should be all set!\n\n"
  exit
end

begin
  require "coderay"
rescue LoadError
  puts "\nYou'll need CodeRay to build this project. Simply run:\n\n"
  puts "  $ gem install coderay"
  puts "\nand you should be all set!\n\n"
  exit
end

begin
  require "#{ROOT_PATH}/Vendor/PDoc/lib/pdoc"
rescue LoadError
  puts "\nYou'll need PDoc to build this project. Simply run:\n\n"
  puts "  $ git submodule init"
  puts "  $ git submodule update"
  puts "\nand you should be all set!\n\n"
  exit
end

begin
  require "#{ROOT_PATH}/Vendor/script.aculo.us/src/javascripttest"
rescue LoadError
  puts "\nYou'll need script.aculo.us to build this project. Simply run:\n\n"
  puts "  $ git submodule init"
  puts "  $ git submodule update"
  puts "\nand you should be all set!\n\n"
  exit
end

begin
  require "ruby-growl"
  $GROWL = Growl.new("localhost", "Aphid", ["Build Succeeded", "Build Failed"])
rescue LoadError
  # Do nothing...
end

if ARGV[0] and ARGV[0].include? "watch"
  begin
    require "filewatcher"
  rescue LoadError
    puts "\nYou'll need FileWatcher to watch for changes. Simply run:\n\n"
    puts "  $ gem install filewatcher"
    puts "\nand you should be all set!\n\n"
    exit
  end
  unless $GROWL
    header "Growl Support Notice"
    puts "To enable Growl notifications during automated builds, you will need to install ruby-growl by running:\n\n"
    puts "  $ gem install ruby-growl"
    puts "\nOnce installed, you must also enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
  end
end

# Default Tasks --------------------------------------------------------------

desc "Defaults to #{DEFAULT_TASKS.inspect}"
task :default => DEFAULT_TASKS

# Clean Task -----------------------------------------------------------------

desc "Clean up the built project"
task :clean do
  header "Cleaning Project"
  rm_rf "#{ROOT_PATH}/Build"
  mkdir "#{ROOT_PATH}/Build"
  puts
end

# Watcher Task ---------------------------------------------------------------

desc "Watches for changes and rebuilds the project and documentation as changes occur"
task :watch do
  watch_with DEFAULT_TASKS
end

desc "Watches for changes and rebuilds the project source as changes occur"
task "watch:source" do
  watch_with WATCH_SOURCE_TASKS
end

# Build Tasks ----------------------------------------------------------------

desc "Build the project"
task :build do
  load_build_dependencies
  header "Building Aphid"
  sprocketize(File.join("Build", "Aphid.js"), { :source_files => [ "Library/Aphid.js" ] }) \
  and sprocketize(File.join("Build", "Aphid.Combined.js"), { :source_files => [ "Library/Aphid.Combined.js" ] }) \
  and sprocketize(File.join("Build", "Aphid.Documented.js"), { :source_files => [ "Library/Aphid.Documented.js" ], :strip_comments => false }) \
  and lessify(File.join("Resources", "Stylesheets", "Aphid.less"), File.join("Build", "Aphid.css")) \
  and lessify(File.join("Resources", "Stylesheets", "Aphid.IE.less"), File.join("Build", "Aphid.IE.css")) \
  and lessify(File.join("Resources", "Stylesheets", "Aphid.IE7.less"), File.join("Build", "Aphid.IE7.css")) \
  and lessify(File.join("Resources", "Stylesheets", "Aphid.IE8.less"), File.join("Build", "Aphid.IE8.css")) \
  and lessify(File.join("Resources", "Stylesheets", "Aphid.IE9.less"), File.join("Build", "Aphid.IE9.css"))
  puts
end

# Documentation Tasks --------------------------------------------------------

desc "Generate and launch the Aphid documentation"
task :docs => [ "docs:build", "docs:open" ]

desc "Generate the Aphid documentation"
task "docs:build" => [ :build, "docs:clean" ] do
  header "Generating Documentation"
  begin
    PDoc.run({
      :source_files => [ "Build/Aphid.Documented.js" ],
      :destination => File.join(ROOT_PATH, "Documentation"),
      :syntax_highlighter => :coderay,
      :markdown_parser => :maruku,
      :src_code_href => proc { |obj|
        "https://github.com/activeprospect/aphid/blob/#{current_head}/#{obj.file}#LID#{obj.line_number}"
      },
      :pretty_urls => false,
      :bust_cache => true,
      :name => 'Aphid Framework',
      :short_name => 'Aphid',
      :home_url => 'http://aphid.activeprospect.com/',
      :doc_url => 'http://aphid.activeprospect.com/api',
      :version => File.read("#{ROOT_PATH}/VERSION").strip,
      :copyright_notice => "Copyright &copy; 2010 ActiveProspect, Inc. All Rights Reserved."
    })
  rescue => e
    $FAILED = true
    if $GROWL
      begin
        $GROWL.notify "Build Failed", "Aphid Build Failed — PDoc",
          "An error occurred while compiling documentation with PDoc:\n\n#{e}\n\nReference the console for more information…"
      rescue Errno::ECONNREFUSED
        puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
      end
    end
    puts e
    exit unless $WATCHING
  end
end

desc "Clean up the generated documentation"
task "docs:clean" do
  header "Cleaning Project"
  rm_rf "#{ROOT_PATH}/Documentation"
  mkdir "#{ROOT_PATH}/Documentation"
  puts
end

desc "Open documentation in the default system browser"
task "docs:open" do
  header "Opening Documentation"
  `open "#{ROOT_PATH}/Documentation/index.html"`
  puts "open \"#{ROOT_PATH}/Documentation/index.html\"\n\n"
end

# Demo Tasks -----------------------------------------------------------------

desc "Update and launch the demo application"
task :demo => [ 'demo:update' ] do
  `open "#{ROOT_PATH}/Demo/index.html"`
end

namespace "demo" do
  desc "Update the demo application with the built project files and vendor libraries"
  task :update => [ :build ] do
    header "Updating Demo"
    cp "Build/Aphid.Combined.js", "Demo/JavaScripts/Aphid.Combined.js"
    cp "Build/Aphid.css", "Demo/Stylesheets/Aphid.css"
    puts
  end
end

# Template Tasks -------------------------------------------------------------

# desc "Update and launch the demo application"
# task :demo => [ 'demo:update' ] do
#   `open "#{ROOT_PATH}/Demo/index.html"`
# end

namespace "templates" do
  desc "Update the templates with the built project files and vendor libraries"
  task :update => [ :build ] do
    header "Updating Templates"
    mkdir "Templates/JavaScripts" unless File.exists? "Templates/JavaScripts"
    mkdir "Templates/Stylesheets" unless File.exists? "Templates/Stylesheets"
    cp "Build/Aphid.Combined.js", "Templates/JavaScripts/Aphid.Combined.js"
    cp "Build/Aphid.css", "Templates/Stylesheets/Aphid.css"
    puts
  end
end

# Test Tasks -----------------------------------------------------------------

desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test) do |test|
  test.mount("/Build")
  test.mount("/Tests")
  test.mount("/Vendor")

  Dir["Tests/**/*Test.html"].each { |test_file| test.run("/#{test_file}") }

  test.browser(:safari)
end

# Package Tasks --------------------------------------------------------------

spec = Gem::Specification.new do |s|
  s.name = "aphid"
  s.version = File.read("VERSION").strip.downcase.gsub("-", ".")
  s.date = Date.today
  s.authors = "Justin Mecham"
  s.email = "justin@activeprospect.com"
  s.summary = "An elegant HTML5 web framework"
  s.homepage = "http://aphid.activeprospect.com/"
  s.files = [
    "VERSION",
    "README.markdown",
    "ROADMAP.markdown",
    "TODO.markdown",
    "CHANGELOG.markdown",
    "Rakefile",
    Dir["Build/**/*"],
    Dir["Commands/**/*"],
    Dir["Demo/**/*"],
    Dir["Library/**/*"],
    Dir["Resources/**/*"],
    Dir["Skeleton/**/*"],
    Dir["Templates/**/*"],
    Dir["Tests/**/*"],
    Dir["Vendor/**/*"]
  ]
  s.bindir = "Commands"
  s.executables = ["aphid"]
  s.default_executable = "aphid"
  s.add_dependency("less")
  s.add_dependency("sprockets")
  s.add_dependency("commander")
end

Rake::GemPackageTask.new(spec) do |pkg|
  pkg.need_zip = true
  pkg.need_tar = true
  pkg.package_dir = "Build/Packages"
end

# Support Methods ------------------------------------------------------------

def sprocketize(output, options = {})
  sprockets_options = {
    :root         => ROOT_PATH,
    :asset_root   => "Build/Images",
    :load_path    => [ "Library", "Vendor/Prototype/src", "Vendor/script.aculo.us/src", "Vendor/excanvas" ],
    :source_files => [ "Library/**/*.js" ]
  }.merge(options)
  puts "Sprocketizing #{sprockets_options[:source_files]} to #{output} ..."
  sprockets = Sprockets::Secretary.new(sprockets_options)
  sprockets.concatenation.save_to(output)
  sprockets.install_assets
rescue => e
  $FAILED = true
  if $WATCHING and $GROWL
    begin
      $GROWL.notify "Build Failed", "Aphid Build Failed — Sprocketize",
        "An error occurred while compiling JavaScripts with Sprockets:\n\n#{e.message}\n\nReference the console for more information…"
    rescue Errno::ECONNREFUSED
      puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
    end
  end
  puts e
  exit unless $WATCHING
  false
end

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
      $GROWL.notify "Build Failed", "Aphid Build Failed — Lessify",
        "#{prefix} error occurred while compiling CSS with Less.\n\nReference the console for more information…"
    rescue Errno::ECONNREFUSED
      puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
    end
  end
  puts e
  exit unless $WATCHING
  false
end

def watch_with(tasks)
  $WATCHING = true
  header "Waiting for Change(s)"
  watched_files = Dir["Library/**/*.js"] + Dir["Resources/Stylesheets/**/*.less"]
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
        $GROWL.notify "Build Succeeded", "Aphid Build Succeeded",
          "Automated build of Aphid has completed successfully."
      rescue Errno::ECONNREFUSED
        puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
      end
    end
    $FAILED = false
    header "Waiting for Change(s)"
  end
end

def current_head
  `git show-ref --head --hash HEAD`
end

# Dependencies ---------------------------------------------------------------

def load_build_dependencies

  begin
    require "less"
  rescue LoadError
    puts "\nYou'll need Less to build this project. Simply run:\n\n"
    puts "  $ gem install less"
    puts "\nand you should be all set!\n\n"
    exit
  end

  begin
    require "#{ROOT_PATH}/Vendor/Sprockets/lib/sprockets"
  rescue LoadError
    puts "\nYou'll need Sprockets to build this project. Simply run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nand you should be all set!\n\n"
    exit
  end

  begin
    require "json"
  rescue LoadError
    puts "\nYou'll need the JSON gem to build this project. Simply run:\n\n"
    puts "  $ gem install json"
    puts "\nand you should be all set!\n\n"
    exit
  end

end
