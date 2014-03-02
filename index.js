'use strict';
var path = require('path');
var gutil = require('gulp-util');
var filesize = require('filesize');
var optipngStream = require('optipng-stream-bin').path;
var through = require('through2');
var concat = require('concat-stream');
var spawn = require('child_process').spawn;
var multipipe = require('multipipe');

module.exports = function (options) {
    var printStats = function(filePath, origSize, newSize) {
	var saved = origSize - newSize;
	var savedMsg = saved > 0 ? 'saved ' + filesize(saved, {round: 1}) : 'already optimized';
	gutil.log('gulp-optipng:', filePath + gutil.colors.green(' (' + savedMsg + ')'));
    };

    var stream = through.obj(function(file, enc, callback) {
	if ( file.isNull() ) {
	    this.push(file);
	    return callback();
	}

	var ext = path.extname(file.path);

	if ( ext !== ".png" ) {
	    this.push(file);
	    return callback();
	}

	// Massage the options
	options = options || {};

	var optipng = spawn(optipngStream, options);
	var self = this;
	var origSize;

	if ( file.isBuffer() ) {
	    optipng.stdin.end(file.contents);
	    origSize = file.contents.length;
	    file.contents = new Buffer(0);

	    optipng.stdout.on('data', function(data) {
		file.contents = Buffer.concat([file.contents, data]);
	    });

	    optipng.stdout.on('end', function() {
		printStats(file.relative, origSize, file.contents.length);
		self.push(file);
		return callback();
	    });

	    return;
	}

	if ( file.isStream() ) {
	    file.contents.pipe(concat(function(data) {
		origSize = data.length;
	    }));

	    file.contents = file.contents.pipe( multipipe(optipng.stdin, optipng.stdout)) ;
	    this.push(file);

	    file.contents.pipe(concat(function(data) {
		printStats(file.relative, origSize, file.contents.length);
	    }));
	    return callback();
	}
    });

    return stream;
};
