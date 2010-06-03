require 'rake'
require 'rake/packagetask'

ROOT_PATH = File.expand_path(File.dirname(__FILE__))

task :default => :build
task :build => [ :sprocketize, :update_demo ]

#
# Sprocketize
#
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

task :update_demo do
  cp "Build/Aphid.js", "Demo/JavaScripts/Aphid.js"
end
