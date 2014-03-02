# [gulp](https://github.com/wearefractal/gulp)-optipng [![Build Status](https://secure.travis-ci.org/ameyp/gulp-optipng.png?branch=master)](http://travis-ci.org/ameyp/gulp-optipng)

> Lossless minification of PNG with [optipng](http://optipng.sourceforge.net)

*Issues with the output should be reported on the optipng [issue tracker](http://sourceforge.net/p/optipng/bugs/)

## Install

Install with [npm](https://npmjs.org/package/gulp-optipng)

```
npm install --save-dev gulp-optipng
```

## Example

```js
var gulp = require('gulp');
var optipng = require('gulp-optipng');

var options = ['-o2'];

gulp.task('default', function () {
	gulp.src('src/*.png')
		.pipe(optipng(options))
		.pipe(gulp.dest('dist'));
});
```

## API

### optipng(options)

See the optipng [options](http://optipng.sourceforge.net).

## License

MIT © [Amey Parulekar](http://wirywolf.com)
