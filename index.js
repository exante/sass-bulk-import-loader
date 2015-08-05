'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = function(source, map) {

  var process = function(filename, context) {
    var replaceString = '';
    var abs = path.join(context, filename);

    if (fs.statSync(abs).isDirectory()) {
      // Ignore directories start with _
      if (path.basename(abs).substring(0, 1) == '_') return '';

      fs.readdirSync(abs).forEach(function (file) {
        replaceString += process(path.join(path.relative(context, abs), file), context);
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
  var context = this.context;
  this.cacheable && this.cacheable();

  while((result = reg.exec(content)) !== null) {
    var sub = result[0];
    var globName = result[1];

    var directory = path.join(context, globName.slice(0, -1));
    var files = glob.sync(globName, { cwd: context });
    var replaceString = '';

    this.addContextDependency(directory);

    files.forEach(function(filename) {
      replaceString += process(filename, context);
    }, this);

    content = content.replace(sub, replaceString);
  }

  this.callback(null, content, map);
};