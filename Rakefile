require 'rake'
require 'rake/packagetask'

ROOT_PATH = File.expand_path(File.dirname(__FILE__))

task :default => [ :build, "demo:update" ]

desc "Build Aphid"
task :build => [ :sprocketize ]

task :sprocketize do
  begin
    require "sprockets"
  rescue LoadError => e
    puts "\nYou'll need Sprockets to build Aphid. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nand you should be all set!\n\n"
  end
  
  puts "Sprocketizing..."
  secretary = Sprockets::Secretary.new(
    :root         => ROOT_PATH,
    :load_path    => [ "Library", "Vendor/Prototype/src", "Vendor/script.aculo.us/src" ],
    :source_files => [ "Library/**/*.js" ]
  )
  
  secretary.concatenation.save_to(File.join("Build", "Aphid.js"))
end

desc "Update and launch the Demo application"
task :demo => [ 'demo:update' ] do
  `open "#{ROOT_PATH}/Demo/index.html"`
end

namespace "demo" do
  desc "Update the Demo Application with the latest Aphid assets"
  task :update => [ :build ] do
    cp "Build/Aphid.js", "Demo/JavaScripts/Aphid.js"
  end
end