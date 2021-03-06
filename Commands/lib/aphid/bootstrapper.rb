
require "fileutils"
require File.join(File.dirname(__FILE__), "..", "aphid")
require File.join(File.dirname(__FILE__), "extensions")

module Aphid
  class AlreadyVendoredError < RuntimeError; end

  class Bootstrapper

    #
    # Set the APHID_ROOT constant to the Aphid folder to which this library
    # belongs.
    #
    APHID_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..', '..', '..'))

    #
    # Define the skeleton directory structure of new Aphid-based projects.
    #
    SKELETON_STRUCTURE = [
      "Application",
      "Application/Controllers",
      "Application/Models",
      "Application/Views",
      "Build",
      "Library",
      "Public",
      "Resources",
      "Resources/Images",
      "Resources/Stylesheets",
      "Resources/Templates",
      "Tests",
      "Vendor"
    ]

    attr_accessor :project_name
    attr_accessor :project_path

    def initialize(path)
      @project_path = path
      @project_name = File.basename(path)
      yield self if block_given?
    end

    def create_project_folder
      puts "Creating Project Folder \"#{@project_path}\" ..."
      Dir.mkdir @project_path
    end

    def create_project_structure
      puts "Creating Project Structure ..."
      SKELETON_STRUCTURE.each do |path|
        Dir.mkdir "#{@project_path}/#{path}"
      end
      Dir.clone! "#{Aphid.path}/Skeleton", @project_path, ["^\\."]
    end

    def evaluate_templates
      puts "Evaluating Templates ..."
      Dir["#{@project_path}/**/*.erb"].each do |filename|
        File.open(filename, "r+") do |file|
          template = ERB.new file.read
          file.reopen(filename, "w")
          file.write template.result(binding)
        end
        File.rename filename, filename[0..-5]
      end
    end

    def initialize_git_repository
      puts "Initializing Git repository ..."
      `git init "#{@project_path}"`
      File.open "#{@project_path}/.gitignore", "w" do |file|
        file.write ".DS_Store\n"
        file.write "Build\n"
        file.write "Resources/Stylesheets/*.css\n"
      end
      `cd "#{@project_path}" && git add . && cd -`
    end

    def vendorize_aphid(options = {})
      puts "Vendorizing Aphid from \"#{Aphid.path}\" ..."
      vendorized_path = "#{@project_path}/Vendor/Aphid"
      unless options[:force] or not File.exists? vendorized_path
        raise AlreadyVendoredError, "Aphid already exists in Vendor"
      end

      if File.exists? "#{@project_path}/.git"
        `cd "#{@project_path}" && git submodule add git@github.com:activeprospect/aphid.git Vendor/Aphid && cd -`
        `cd "#{vendorized_path}" && git submodule init && git submodule update && cd -`
        `cd "#{vendorized_path}" && rake build && cd -`
      else
        Dir.clone! Aphid.path, vendorized_path, ["^\\."] unless File.exists? vendorized_path
      end
    end

    def build_project
      puts "Building Project ..."
      FileUtils.chdir @project_path do
        `rake build`
      end
    end

    def bootstrap!
      create_project_folder
      create_project_structure
      evaluate_templates
      puts "Initialized \"#{project_name}\" in #{@project_path} ..."
    end

  end
end
