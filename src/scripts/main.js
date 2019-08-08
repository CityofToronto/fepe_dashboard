// The main javascript file for fepe_dashboard.

$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax

  //create a new application object:
  let app = new SampleApp('fepe_dashboard');

  //@if !IS_EMBEDDED
  app.setBreadcrumb([ //only standalone apps set their own breadcrumb
    {"name": "fepe_dashboard", "link": "#"}
  ]);
  //@endif

  app.render(); //render the application

});
