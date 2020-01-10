// ブラウザの自動リロード
// HTMLファイル変更時の自動リロード
// CSSファイル変更時の自動リロード
// JSファイル変更時の自動リロード

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const browserSync = require('browser-sync').create();
const imagemin    = require('gulp-imagemin');

// ブラウザの立ち上げ
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

// ファイル変更時に自動更新
function watchFiles(done) {
  gulp.watch('./sass/**/*.scss', function () {
    return (
      gulp
        .src('./sass/**/*.scss')
        .pipe(sass({
          outputStyle: 'expanded'
        }))
        .on('error', sass.logError)
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css'))
    );
  });
  gulp.watch('*.html').on('change', gulp.series(browserReload));
  gulp.watch('./css/*.css').on('change', gulp.series(browserReload));
  gulp.watch('./js/*.js').on('change', gulp.series(browserReload));
  done();
}

// imageフォルダの画像を自動圧縮
function imageMin(done) {
  gulp.watch('./image/**', function() {
    return (
      gulp
      .src('./image/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/image'))
      );
  });
}

gulp.task('default', gulp.series(sync, watchFiles, imageMin));
