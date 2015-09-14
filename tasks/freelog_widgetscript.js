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
var request = require('request');

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
        var widget= $(widget_html);
        $('body').append(widget);
        var html_export = "<!DOCTYPE html>\n<html>\n" + $("html").html() + "\n</html>";
        grunt.file.write(dest, html_export);
      }
    });

  });

  grunt.registerTask('submit-widget', 'submit-widget to freelog.co', function(){
  //make async
    var done = this.async();

    var config = grunt.config('submit_widget');
    var widget_html = grunt.file.read(config.widget_html);
    var widget_style = grunt.file.read(config.widget_style);
    var widget_script = grunt.file.read(config.widget_script);

    var author_email = config.author_email;

    var widget_object = JSON.stringify({html:widget_html, css:widget_style, javascript:widget_script});

    var resource = {
      resource: {
        resource_type: 'widget',
        meta: JSON.stringify({shim_dependencies: config.shim_dependencies}),
        name: config.name,
        mime_type: 'application/json',
        sharing_policy: '{}',
        content: widget_object
      }
    }

    request(
      {
        method:'post',
        uri:'http://freelog.co:3000/resources.json', 
        json:true,
        body:resource
      } ,
      function (err, response, body) {
        if (err) {
          console.error('upload failed:', err);
          done();
        }
        done();
      })
      .auth(config.auth_email,config.auth_pw);
  });

  grunt.registerTask('submit-pagebuild', 'submit a page build to freelog.co', function(){
    var done = this.async();

    var config = grunt.config('submit_pagebuild');
    var pb_layout = grunt.file.read(config.layout);
    var pb_style = grunt.file.read(config.style);
    var pb_widgets = config.widgets;
    var author_email = config.author_email;

    var pb_object = JSON.stringify({widgets:pb_widgets, layout:pb_layout, css:pb_style});

    var resource = {
      resource: {
        resource_type: 'page_build',
        meta: {},
        name: config.name,
        mime_type: 'application/json',
        sharing_policy: '{}',
        content: pb_object
      }
    }

    request(
      {
        method:'post',
        uri:'http://freelog.co:3000/resources.json', 
        json:true,
        body:resource
      } ,
      function (err, response, body) {
        if (err) {
          console.error('upload failed:', err);
          done();
        }
        done();
      })
      .auth(config.auth_email,config.auth_pw);
  });
};
