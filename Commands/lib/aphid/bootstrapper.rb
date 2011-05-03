
require "fileutils"
require File.join(File.dirname(__FILE__), "extensions")

module Aphid
  class Bootstrapper

    APHID_ROOT = File.expand_path(File.join(File.dirname(__FILE__), '..', '..', '..'))
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
      "Vendor",
      "Vendor/Aphid"
    ]

    attr_accessor :project_name
    attr_accessor :project_path

    def initialize(path)
      @project_path = path
      @project_name = File.basename(path)
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
      Dir.clone! "#{APHID_ROOT}/Skeleton", @project_path, ["^\\."]
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

    def vendorize_aphid
      puts "Vendorizing Aphid ..."
      vendorized_path = "#{@project_path}/Vendor/Aphid"
      Dir.clone! APHID_ROOT, vendorized_path, ["^\\."]
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
      vendorize_aphid
      build_project
      puts "Initialized \"#{project_name}\" in #{@project_path} ..."
    end

  end
end
