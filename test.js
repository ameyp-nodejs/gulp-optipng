'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var imagemin = require('./index');
var concat = require('concat-stream');
var util = require('util');
var compare = require('comparejs');

it('should minify stream images', function (done) {
    var stream = imagemin();

    stream.once('data', function(file) {
	assert(file.isStream());

	file.contents.pipe(concat(function(data) {
	    assert(data.length < fs.statSync('fixture.png').size);
	    done();
	}));
    });

    stream.write(new gutil.File({
	path: "./fixture.png",
	contents: fs.createReadStream('fixture.png')
    }));
});

it('should minify buffer images', function (done) {
    var stream = imagemin();

    stream.once('data', function(file) {
	assert(file.isBuffer());

	assert(file.contents.length < fs.statSync('fixture.png').size);
	done();
    });

    stream.write(new gutil.File({
	path: "./fixture.png",
	contents: fs.readFileSync('fixture.png')
    }));
});

it('should skip unsupported buffer images', function (done) {
    var stream = imagemin();
    var contents = fs.readFileSync('fixture.bmp');

    stream.on('data', function (file) {
	assert(file.isBuffer());

	assert(compare.eqs(file.contents, contents));
	done();
    });

    stream.write(new gutil.File({
	path: "./fixture.bmp",
	contents: contents
    }));
});

it('should skip unsupported stream images', function (done) {
    var stream = imagemin();

    stream.once('data', function(file) {
	assert(file.isStream());

	file.contents.pipe(concat(function(data) {
	    assert(compare.eqs(data, new Buffer(fs.readFileSync('fixture.bmp'))));
	    done();
	}));
    });

    stream.write(new gutil.File({
	path: "./fixture.bmp",
	contents: fs.createReadStream('fixture.bmp')
    }));
});

it('should skip null files', function (done) {
    var stream = imagemin();

    stream.on('data', function (file) {
	assert.strictEqual(file.contents, null);
	done();
    });

    stream.write(new gutil.File({
    }));
});
