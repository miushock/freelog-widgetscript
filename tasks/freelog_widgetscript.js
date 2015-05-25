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
    var widget_html = grunt.file.read(config.widget_file);
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

};
