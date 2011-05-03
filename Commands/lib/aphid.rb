
module Aphid

  #
  # Returns the path to the current version of Aphid.
  #
  def self.path
    File.expand_path(File.join(File.dirname(__FILE__), "..", ".."))
  end

  #
  # Returns the current version of Aphid, as specified by the VERSION file in
  # the Aphid root path.
  #
  def self.version
    File.read("#{Aphid.path}/VERSION").strip
  end

end
