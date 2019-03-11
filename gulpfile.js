// Load plugins
const browsersync = require("browser-sync").create();
const gulp = require("gulp");
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const del = require('del');
//const uglify = require("gulp-uglify");


// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(cb) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  cb();

});

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "app"
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("app/css/*", browserSyncReload);
  gulp.watch("app/**/*.html", browserSyncReload);
}

gulp.task("default", gulp.parallel('vendor'));

gulp.task('useref', function(){
  return gulp.src(['app/*.html', 'app/*/*.html'])
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/css/icons/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/css/icons/'))
});

gulp.task('clean:dist', function() {
  return del(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// dev task
gulp.task("dev", gulp.parallel(watchFiles, browserSync));
gulp.task('build',
  gulp.series('clean:dist', gulp.parallel('useref', 'images'),
  function() {
    console.log('Finished');
  }));

// gulp.task('minify', function () {
//   gulp.src('app/js/internationalisation.js')
//      .pipe(uglify())
//      .pipe(gulp.dest('build'))
// });

// gulp.task('build', ['css', 'js', 'imgs']);
