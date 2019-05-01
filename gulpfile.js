var gulp = require('gulp');
var minifycss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util')
var del = require('del');
var runSequence = require('run-sequence');
var Hexo = require('hexo');
var request = require('request');
var fs = require("fs");


gulp.task('clean', function () {
  return del(['public/**/*']);
});

// generate html with 'hexo generate'
var hexo = new Hexo(process.cwd(), {});
gulp.task('generate', function (cb) {
  hexo.init().then(function () {
    return hexo.call('generate', {
      watch: false
    });
  }).then(function () {
    return hexo.exit();
  }).then(function () {
    return cb()
  }).catch(function (err) {
    console.log(err);
    hexo.exit(err);
    return cb(err);
  })
})

gulp.task('bd-zz-send', function (cb) {
  var walk = function (dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function (file) {
      file = dir + '/' + file
      var stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file))
      } else {
        results.push(file)
      }
    })
    return results
  }
  var array = walk('public')
    .filter(file => file.indexOf('index.html') !== -1)
    .map(file => {
      return file
        .replace(/^public/, 'http://www.liuyiqi.cn')
        .replace(/index.html$/, '')
    });
  var body = array.join('\n');

  request.post(
    {
      url: 'http://data.zz.baidu.com/urls?site=www.liuyiqi.cn&token=iXikmQ5JiHNvr7tz',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: body
    }, function (error, response, body) {
      console.log(body);
      return cb();
    }
  );
})

gulp.task('minify-css', function () {
  return gulp.src('./public/**/*.css')
    .pipe(minifycss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-html', function () {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function () {
  return gulp.src('./public/**/*.js')
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-img', function () {
  return gulp.src('./public/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images'))
})

gulp.task('minify-img-aggressive', function () {
  return gulp.src('./public/images/**/*.*')
    .pipe(imagemin(
      [imagemin.gifsicle({ 'optimizationLevel': 3 }),
      imagemin.jpegtran({ 'progressive': true }),
      imagemin.optipng({ 'optimizationLevel': 7 }),
      imagemin.svgo()],
      { 'verbose': true }))
    .pipe(gulp.dest('./public/images'))
})

gulp.task('compress', function (cb) {
  runSequence(['minify-html', 'minify-css', 'minify-js', 'minify-img-aggressive'], cb);
});

gulp.task('build', function (cb) {
  runSequence('clean', 'generate', 'bd-zz-send', 'compress', cb)
});

gulp.task('default', ['build'])
