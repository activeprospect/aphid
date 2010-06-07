require 'rubygems'
require 'rake'
require 'rake/packagetask'

ROOT_PATH = File.expand_path(File.dirname(__FILE__))
DEFAULT_TASKS = [ :clean, :build, "docs:build", "demo:update" ]

# Check Vendor Dependencies --------------------------------------------------

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
  require "#{ROOT_PATH}/Vendor/PDoc/lib/pdoc"
rescue LoadError
  puts "\nYou'll need PDoc to build this project. Simply run:\n\n"
  puts "  $ git submodule init"
  puts "  $ git submodule update"
  puts "\nand you should be all set!\n\n"
  exit
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
  begin
    require "filewatcher"
  rescue LoadError
    puts "\nYou'll need FileWatcher to watch for changes. Simply run:\n\n"
    puts "  $ gem install filewatcher"
    puts "\nand you should be all set!\n\n"
    exit
  end
  header "Waiting for Change(s)"
  watched_files = Dir["Library/**/*.js"] + Dir["Assets/Stylesheets/**/*.less"]
  FileWatcher.new(watched_files).watch do |filename|
    puts filename + " was changed. Rebuilding project...\n"
    DEFAULT_TASKS.each { |task| Rake::Task[task].reenable }
    DEFAULT_TASKS.each { |task| Rake::Task[task].invoke }
    header "Waiting for Change(s)"
  end
end

# Build Tasks ----------------------------------------------------------------

desc "Build the project"
task :build do
  header "Building Aphid"
  sprocketize(File.join("Build", "Aphid.js"), { :source_files => "Library/Aphid.js" })
  sprocketize(File.join("Build", "Aphid.Combined.js"), { :source_files => "Library/Aphid.Combined.js" })
  sprocketize(File.join("Build", "Aphid.Documented.js"), { :source_files => "Library/Aphid.Documented.js", :strip_comments => false })
  lessify(File.join("Assets", "Stylesheets", "Aphid.less"), File.join("Build", "Aphid.css"))
  puts
end

# Documentation Tasks --------------------------------------------------------

desc "Generate and launch the Aphid documentation"
task :docs => [ "docs:build", "docs:open" ]

desc "Generate the Aphid documentation"
task "docs:build" => [ :build, "docs:clean" ] do
  header "Generating Documentation"
  PDoc.run({
    :source_files => "Build/Aphid.Documented.js",
    :destination => File.join(ROOT_PATH, "Documentation"),
    :syntax_highlighter => :coderay,
    :markdown_parser => :maruku,
    :src_code_href => proc { |obj|
      "https://github.com/activeprospect/aphid/blob/#{current_head}/#{obj.file}#LID#{obj.line_number}"
    },
    :pretty_urls => false,
    :bust_cache => true,
    :name => 'Aphid JavaScript Framework',
    :short_name => 'Aphid',
    :home_url => 'http://aphid.activeprospect.com/',
    :doc_url => 'http://aphid.activeprospect.com/api',
    :version => "1.0.0-alpha",
    :copyright_notice => "Copyright &copy; 2010 ActiveProspect, Inc. All Rights Reserved."
  })
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

# Support Methods ------------------------------------------------------------

def sprocketize(output, options = {})
  sprockets_options = {
    :root         => ROOT_PATH,
    :load_path    => [ "Library", "Vendor/Prototype/src", "Vendor/script.aculo.us/src" ],
    :source_files => "Library/**/*.js"
  }.merge(options)
  puts "Sprocketizing #{sprockets_options[:source_files]} to #{output} ..."
  sprockets = Sprockets::Secretary.new(sprockets_options)
  sprockets.concatenation.save_to(output)
end

def lessify(input, output, options = {})
  puts "Lessifying #{input} to #{output} ..."
  template = File.read(input)
  $LESS_LOAD_PATH = [ "Assets/Stylesheets" ]
  less = Less::Engine.new(template)
  File.open(output, 'w') do |file|
    file.write less.to_css
  end
end

def header(message)
  message = " #{message} "
  puts "\n#{message.center(`stty size`.split(' ')[1].to_i, '-')}\n\n"
end

def current_head
  `git show-ref --head --hash HEAD`
end
