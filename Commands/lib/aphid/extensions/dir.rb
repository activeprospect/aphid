
class Dir

  def self.clone!(source, destination, exclude = [])
    exclude = ["^\\.{1,2}$"].concat(exclude).uniq
    FileUtils.mkdir(destination) unless File.exists?(destination)
    Dir.foreach(source) do |file|
      next if exclude.detect { |pattern| file.match(/#{pattern}/i) }

      source_path      = File.join(source, file)
      destination_path = File.join(destination, file)

      if File.directory? source_path
        FileUtils.mkdir(destination_path) unless File.exists? destination_path
        clone! source_path, destination_path, exclude
      else
        FileUtils.cp source_path, destination_path, :preserve => true
      end
    end
  end

end
