require "date"

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
    "Aphid.gemspec",
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
  s.require_paths = [ "Commands/lib" ]
  s.bindir = "Commands"
  s.executables = ["aphid"]
  s.default_executable = "aphid"
  s.add_dependency("less")
  s.add_dependency("sprockets")
  s.add_dependency("commander")
end
