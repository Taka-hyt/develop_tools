// ブラウザの自動リロード
// HTMLファイル変更時の自動リロード
// CSSファイル変更時の自動リロード
// JSファイル変更時の自動リロード

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const browserSync = require('browser-sync').create();

function sync(done) {
  browserSync.init({
    server: {
      baseDir: './'
    },
    reloadOnRestart: true
  });
  done();
}
function browserReload(done){
  browserSync.reload();
  done();
};
function watchFiles(done) {
  gulp.watch('./sass/**/*.scss', function () {
    return (
      gulp
        .src('./sass/**/*.scss')
        .pipe(sass({
          outputStyle: 'expanded'
        }))
        .on('error', sass.logError)
        .pipe(gulp.dest('./css'))
    );
  });
  gulp.watch('*.html').on('change', gulp.series(browserReload));
  gulp.watch('./css/*.css').on('change', gulp.series(browserReload));
  gulp.watch('./js/*.js').on('change', gulp.series(browserReload));
  done();
}
gulp.task('default', gulp.series(sync, watchFiles));
