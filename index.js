'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = function(source, map) {

  var process = function(filename) {
    var replaceString = '';

    if (fs.statSync(filename).isDirectory()) {
      // Ignore directories start with _
      if (path.basename(filename).substring(0, 1) == '_') return '';

      fs.readdirSync(filename).forEach(function (file) {
        replaceString += process(filename + path.sep + file);
      });
      return replaceString;
    } else {
      if (filename.substr(-4).match(/sass|scss/i)) {
        return '@import "' + filename + '";\n'
      } else {
        return '';
      }
    }
  };

  var content = source;
  var reg = /@import\s+[\"']([^\"']*\*[^\"']*)[\"'];?/;
  var result;
  this.cacheable && this.cacheable();

  while((result = reg.exec(content)) !== null) {
    var sub = result[0];
    var globName = result[1];

    var files = glob.sync(path.join(this.context, globName));
    var replaceString = '';

    files.forEach(function(filename){
      replaceString += process(filename);
    });

    content = content.replace(sub, replaceString);
  }

  this.callback(null, content, map);
};