var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var clean = require('gulp-clean');
var webpack = require('gulp-webpack');
var stylus = require('gulp-stylus');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var bootstrap = require('bootstrap-styl');
var jeet = require('jeet');
var rupture = require('rupture');
var browserSync = require('browser-sync').create();

gulp.task('default', function () {
  "use strict";
  
});

gulp.task('browserSync', function() {
  "use strict";
  browserSync.init({
    proxy: "localhost:3000",
    notify: false,
    online: false
  });
});

gulp.task('vendors', function () {
  "use strict";
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-validator/js/validator.js',
    'node_modules/bootstrap-styl/js/dropdown.js',
    'node_modules/bootstrap-styl/js/alert.js',
    'node_modules/bootstrap-styl/js/collapse.js'
  ]).pipe(concat('vendors.js'))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.stream());
});

gulp.task('client', function () {
  "use strict";
  return gulp.src('client/**/*.{js,jsx}')
    .pipe(webpack({
      displayErrorDetails: true,
      module: {
        loaders: [
          {
            test: /client\/.+\.jsx$/,
            loader: 'babel?presets[]=react,presets[]=es2015'
          },
          {
            test: /client\/.+\.js$/,
            loader: 'babel?presets[]=es2015'
          }
        ]
      },
      output: {
        filename: 'client.js'
      }
    }))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.stream());
});

gulp.task('js', ['vendors', 'client']);

gulp.task('styles', function () {
  "use strict";
  return gulp.src('client/styles/style.styl')
    .pipe(stylus({
      compress: true,
      use: [jeet(), rupture(), bootstrap()]
    })).on('error', onError)
    .pipe(autoprefixer({
      browsers: ['last 1 version', 'ie 10'],
      cascade: false
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('public/styles/'))
    .pipe(browserSync.stream());
});

gulp.task('build', ['vendors', 'client', 'styles'], function () {
  "use strict";
  return gulp.src([
      'public/js/vendors.js',
      'public/js/client.js'
    ])
    .pipe(minify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('imagemin', function () {
  gulp.src('client/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
    .pipe(browserSync.stream());
});

gulp.task('dev', ['browserSync', 'vendors', 'client', 'styles', 'imagemin'], function () {
  "use strict";
  gulp.watch('client/**/*.styl', ['styles']);
  gulp.watch('client/**/*.{js,jsx}', ['js']);
  gulp.watch(['app/views/**/*.jade', 'public/js/*.js', 'public/js/styles.css'], browserSync.reload);
});

function onError(err) {
  "use strict";
  notify.onError({
    title: "Error",
    message: "<%= error %>"
  })(err);
  this.emit('end');
}
