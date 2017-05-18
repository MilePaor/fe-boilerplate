var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');
var notify = require("gulp-notify");
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var fontgen = require('gulp-fontgen');

livereload({ start: true })


// Define paths for sass, js and where to export

// Sass
var sassPath = './resources/scss/**/*.scss';
var sassExport = './html/css/';

// Require JS
var jsPath = './resources/js/app.js';
var jsExport = './html/js';

// Font WebFont Generator
var fontExport = "./html/fonts/";

// Gulp tasks

gulp.src("./src/test.ext")
  .pipe(notify("Hello Gulp!"));

gulp.src('./resources/*.ext')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('./html'));

gulp.task('fontgen', function() {
    return gulp.src("./html/fonts/*.{ttf,otf}")
      .pipe(fontgen({
        dest: fontExport
        }));
    });
gulp.task('sass', function () {
    gulp.src(sassPath)
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass())
    // .pipe(cssmin())
    .pipe(plumber.stop())
    // .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(sassExport))
    .pipe(livereload())
    .pipe(notify({
        message: "Such notification. So smooth. Wow",
        title: "Sass compiled",
        icon : "./resources/assets/doge.jpg"
    }))
});

browserify().transform("babelify", {presets: ["es2015"]});

function compile(watch) {

  var bundler = watchify(browserify(jsPath, { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(jsExport))
      .pipe(livereload())
      .pipe(notify({
          message: "Such notification. So smooth. Wow",
          title: "Javascript compiled",
          icon : "./resources/assets/doge.jpg"
      }))
  }

  if (watch) {
    bundler.on('update', function() {
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() {
   livereload.listen();
   gulp.watch(sassPath, ['sass'])
   return watch();
});

gulp.task('default', ['watch']);
