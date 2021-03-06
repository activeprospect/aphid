# Aphid

Aphid is a collection of standard templates, layouts, stylesheets and
JavaScripts for use within ActiveProspect's web-based projects.

## Project Structure

  * **Build** - The built Aphid project
  * **Documentation** - Documentation for Aphid (generated by PDoc)
  * **Library** - The Aphid Library
    * **Core** - Core foundation code, which includes the Modal-View-Controller
      layer support, routing and other basic scaffolding.
    * **Support** - Shared support code for the core library and applications
      that use Aphid. This includes language and library extensions, a logger,
      browser compatibility shims and other useful common code.
    * **UI** - The UI namespace includes all of our custom components classes.
  * **Resources** - Contains images, stylesheets, sounds and similar assets
    that are part of the Aphid library.
  * **Tests** - Unit and functional tests for the Aphid library, to be run
    with unittest.js from script.aculo.us.
  * **Vendor** - Imported 3rd-party libraries and projects, such as Prototype
    and script.aculo.us.

## Building Aphid

To build Aphid (which will compile and combine all of the library code and
assets into library form), simply run `rake build` from the Aphid source
folder.

The results of the build will be placed in the Build subfolder of the Aphid
source folder.

## Automatically Building Aphid

If you are actively developing within the Aphid framework itself, you may run
`rake watch` from the Aphid source folder to watch the filesystem for changes
and automatically rebuild the Aphid project.

## Demo Application

There is a self-consuming demonstration application in the Demo directory. You
must first build Aphid and update the demo with the built product (simply
running `rake` will do both of these things) or you may launch it by running
`rake demo` from the Aphid source folder, which takes care of both building,
updating and launching the demo in your default web browser.
