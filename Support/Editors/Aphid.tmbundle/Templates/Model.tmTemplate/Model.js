/**
 * class ${TM_NEW_FILE_BASENAME} < Aphid.Model.Base
 *
 * --
 * Created by ${TM_FULLNAME} on ${TM_DATE}.
 * Copyright (c) ${TM_YEAR} ${TM_ORGANIZATION_NAME}. All rights reserved.
 * --
 *
 * 
 *
**/

var ${TM_NEW_FILE_BASENAME} = Aphid.Class.create("${TM_NEW_FILE_BASENAME}", Aphid.Model.Base, {

	// Loading -----------------------------------------------------------------

  siteUrl: "http://example.com/",
  instancePath: "/$(TM_NEW_FILE_BASENAME)/#{identifier}.json",
  collectionPath: "/$(TM_NEW_FILE_BASENAME)s.json",

	// Associations ------------------------------------------------------------

  hasMany: {
    // yourAssociationName: {
    //   className: "YourAssociationClassName"
    // }
  },

  belongsTo: {
    // yourAssociationName: {
    //   className: "YourAssociationClassName",
    //   property: "associationIdentifierProperty"
    // }
  },

	// Model Callbacks ---------------------------------------------------------

  afterLoad: function()
  {
    // ...
  }

});
