#
# Publish Configuration for Aphid
#

{

  #
  # Specify each of the hosts that you would like to publish to. You must
  # provide at least one host.
  #
  :hosts => [
    "mongo1.activeprospect.com",
    "mongo2.activeprospect.com",
    "mongo3.activeprospect.com"
  ],

  #
  # Specify the base path that the application will be published to. This path
  # will be created by the "publish:setup" Rake task and will also contain a
  # "releases" folder and a "current" symlink to the published release.
  #
  :path => "/var/www/vhosts/assets/aphid",

  #
  # Specify the user that you wish to use to connect to the hosts specified
  # above. If you do not specify a user, your login user will be used.
  #
  :user => "www-data",

  #
  # You may optionally specify multiple environments to publish to. The
  # settings provided for each environment below will override any of the
  # settings specified above. You may publish to a specific environment by
  # providing the PUBLISH= environment variable to the "rake publish" command
  # (i.e. "rake publish environment=production").
  #
  :environments => {
    :staging => {
    },
    :production => {
    }
  },

  #
  # If you have defined multiple environments, it is recommended that you set
  # a default environment so that you don't have to specify the environment
  # with each rake task you invoke.
  #
  :default_environment => :production

  #
  # If you wish to perform some action after a successful publish operation
  # (such as posting a notification to Campfire), you may do so in the "After
  # Publish" callback.
  #
  # :after_publish => Proc.new { |details|
  #   puts "Published w/Details: "
  #   puts details.inspect
  # }

}
