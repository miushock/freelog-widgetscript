/*
* freelog-widgetscripts
* https://github.com/miushock/freelog-widgetscripts
*
* Copyright (c) 2015 Miushock
* Licensed under the MIT license.
*/

'use strict';

var grunt = require('grunt');
var jquery = grunt.file.read('./node_modules/jquery/dist/jquery.min.js');
var jsdom = require('jsdom');

module.exports = function(grunt) {

  grunt.registerTask('build-index-page', 'create index page for testing the widget', function(){
    var config = grunt.config('build_index_page');
    var widget_html = grunt.file.read(config.widget_html);
    var container = grunt.file.read(config.container_file);
    var dest = config.dest;

    jsdom.env({
      html:container,
      src:[jquery],
      done: function (err, window) {
        if (err) {
          grunt.fail.warn(err);
        }
        var $ = window.$;
        $("#widgets").html(widget_html);
        var html_export = "<!DOCTYPE html>\n<html>\n" + $("html").html() + "\n</html>";
        grunt.file.write(dest, html_export);
      }
    });

  });

  grunt.registerTask('submit-widget', 'submit-widget to freelog.co', function(){
    var config = grunt.config('submit_widget');
    var widget_html = grunt.file.read(config.widget_html);
    var widget_style = grunt.file.read(config.widget_css);
    var widget_script = grunt.file.read(config.widget_js);

    var author_email = config.author_email;

    var widget_object = JSON.stringify({html:widget_html, css:widget_style, javascript:widget_script});

    var formData = {
      resource_type: 'widget',
      owner: author_email,
      meta: {},
      mime_type: 'application/json',
      sharing_policy: {},
      content: widget_object
    }

    request.post({url:'http://freelog.co/resources.json', formData: formData} ,function (err) {
      if (err) {
        return console.error('upload failed:', err);
      }
    });
  });

};
