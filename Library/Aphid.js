/**
 * ==Aphid Framework==
 *
 * The Aphid namespace is the main container for the various Aphid frameworks
 * and contains other metadata for Aphid, including version.
 *
 * Aphid is a lightweight framework for modern web applications that utilize
 * new and emerging standards, such as HTML5 and CSS3. The framework also
 * attempts to degrade gracefully for older browsers, where possible.
 *
 * The design of Aphid was heavily influenced by the delegate and notification
 * patterns of Cocoa and Cocoa Touch and much of the view stack mimicks that
 * of UIKit from the iPhone SDK. The overall goal of Aphid, however, is to
 * create just a very thin layer on top of HTML and CSS so that we're able to
 * take full advantage of the flexibility of those technologies while simply
 * assisting the developer in compartmentalizing the behavioral aspects of
 * their application.
 *
**/

/** section: Aphid Framework
 * Aphid
**/
var Aphid = {

  /**
   * Aphid.Version = "<%= APHID_VERSION %>"
   *
   * The version number for Aphid in the *major.minor.build* format *(e.g. 1.0.123)*.
  **/
  Version: '<%= APHID_VERSION %>'

};

//= require <Aphid/Support>
//= require <Aphid/Core>
//= require <Aphid/Model>
//= require <Aphid/UI>

//= provide "../Resources/Images"
