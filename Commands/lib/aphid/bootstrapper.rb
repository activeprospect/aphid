require "fileutils"

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
      vendorize_aphid
      build_project
      puts "Initialized \"#{project_name}\" in #{@project_path} ..."
    end

  end
end

class Dir

  def self.clone!(source, destination, exclude = [])
    exclude = ["^\\.{1,2}$"].concat(exclude).uniq
    FileUtils.mkdir(destination) unless Dir.exists?(destination)
    Dir.foreach(source) do |file|
      next if exclude.detect { |pattern| file.match(/#{pattern}/i) }

      source_path      = File.join(source, file)
      destination_path = File.join(destination, file)

      if File.directory?(source_path)
        FileUtils.mkdir(destination_path) unless Dir.exists?(destination_path)
        clone! source_path, destination_path, exclude
      else
        FileUtils.cp(source_path, destination_path)
      end
    end
  end

end
