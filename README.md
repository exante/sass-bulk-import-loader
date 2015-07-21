sass-bulk-import-loader
=====================

This loader for Webpack is based on [gulp-sass-bulk-import](https://github.com/mathisonian/gulp-sass-bulk-import) by Matthew Conlen

## installation

```
npm install --save-dev sass-bulk-import-loader
```


## usage

```scss

@import "some/path/*";

// becomes
// @import "some/path/file1.scss";
// @import "some/path/file2.scss";
// ...

```

```javascript
require('css!loader!sass!sass-bulk-import');
```

or in your Webpack config