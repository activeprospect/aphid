# encoding: UTF-8

require 'rake/gempackagetask'
require File.expand_path(File.dirname(__FILE__)) + "/Commands/lib/aphid/rake"

PROJECT_NAME         = "Aphid"
ROOT_PATH            = File.expand_path(File.dirname(__FILE__))
DEFAULT_TASKS        = [ :build, "docs:build" ]
WATCH_TASKS          = DEFAULT_TASKS
WATCH_SOURCE_TASKS   = [ :build ]
SOURCE_FILES         = [ "Library/Aphid.js", "Library/Aphid.Combined.js" ]
DOCUMENTATION_SOURCE = "Library/Aphid.js"
STYLESHEET_FILES     = [ "Resources/Stylesheets/Aphid.less",
                         "Resources/Stylesheets/Aphid.IE.less",
                         "Resources/Stylesheets/Aphid.IE7.less",
                         "Resources/Stylesheets/Aphid.IE8.less",
                         "Resources/Stylesheets/Aphid.IE9.less" ]

# Documentation Tasks --------------------------------------------------------

desc "Generate and launch the Aphid documentation"
task :docs => [ "docs:build", "docs:open" ]

desc "Generate the Aphid documentation"
task "docs:build" => [ :build, "docs:clean" ] do
  header "Generating Documentation"

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
    PDoc.run({
      :source_files => [ "Build/Library/#{File.basename(DOCUMENTATION_SOURCE).gsub(/js$/, "Documented.js")}" ],
      :destination => File.join(ROOT_PATH, "Documentation"),
      :syntax_highlighter => :coderay,
      :markdown_parser => :maruku,
      :src_code_href => proc { |obj|
        "https://github.com/activeprospect/aphid/blob/#{current_head}/#{obj.file}#LID#{obj.line_number}"
      },
      :pretty_urls => false,
      :bust_cache => true,
      :name => PROJECT_NAME,
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
        $GROWL.notify "Build Failed", "#{PROJECT_NAME} Build Failed — PDoc",
          "An error occurred while compiling documentation with PDoc:\n\n#{e}\n\nReference the console for more information…"
      rescue Errno::ECONNREFUSED
        puts "ERROR: Connection to Growl was refused. You must enable the options \"Listen for incoming notifications\" and \"Allow remote application registration\" in your Growl settings.\n\n"
      end
    end
    puts e.message
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

# Test Tasks -----------------------------------------------------------------

begin
  require "#{ROOT_PATH}/Vendor/script.aculo.us/src/javascripttest"
rescue LoadError
  puts "\nYou'll need script.aculo.us to build this project. Simply run:\n\n"
  puts "  $ git submodule init"
  puts "  $ git submodule update"
  puts "\nand you should be all set!\n\n"
  exit
end

desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test) do |test|
  test.mount("/Build")
  test.mount("/Tests")
  test.mount("/Vendor")

  Dir["Tests/**/*Test.html"].each { |test_file| test.run("/#{test_file}") }

  test.browser(:safari)
end

# Package Tasks --------------------------------------------------------------

spec = eval(File.read("Aphid.gemspec"))
Rake::GemPackageTask.new(spec) do |pkg|
  pkg.need_zip    = true
  pkg.need_tar    = true
  pkg.package_dir = "Distribution"
end
