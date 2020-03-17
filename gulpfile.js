const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
// const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

// ブラウザの立ち上げ
function sync(done) {
    browserSync.init({
        server: {
            baseDir: './dist/',
            index: 'index.html',
        },
        open: 'external',
        reloadOnRestart: true,
    });
    done();
}

// ブラウザをリロード
function browserReload(done) {
    browserSync.reload();
    done();
}

// 立ち上げた際にdistを一旦クリーンにする
function clean(cb) {
    return rimraf('./dist', cb);
}

// HTMLをMinifyしてdistディレクトリに吐き出す
function htmlMin() {
    return gulp
        .src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'));
}

// PugをHTMLに変換・Minifyしてdistに吐き出し
function pugMin() {
    return (
        gulp
            .src('./src/**/*.pug')
            .pipe(plumber())
            .pipe(
                pug({
                    pretty: true,
                })
            )
            // .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest('./dist/'))
    );
}

// SassをCSSに変換・Minifyしてdistに吐き出し
function sassMin() {
    return (
        gulp
            .src('./src/sass/**/*.{scss,sass}')
            .pipe(plumber(notify.onError('Error: <%= error.message %>')))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle: 'expanded',
                })
            )
            .on('error', sass.logError)
            .pipe(
                autoprefixer({
                    cascade: false,
                })
            )
            .pipe(sourcemaps.write())
            .pipe(gcmq())
            // .pipe(gulp.dest('./dist/css'))
            .pipe(cleanCSS())
            .pipe(
                rename({
                    extname: '.min.css',
                })
            )
            .pipe(gulp.dest('./dist/css'))
    );
}

// imageをMinifyしてdistに吐き出し
function imageMin() {
    return gulp
        .src('./src/image/*.{jpg,jpeg,png,gif,svg}')
        .pipe(changed('dist/image'))
        .pipe(
            imagemin([
                pngquant({
                    quality: [0.7, 0.85],
                    speed: 1,
                }),
                mozjpeg({
                    quality: 85,
                    progressive: true,
                }),
                imagemin.svgo(),
                imagemin.optipng(),
                imagemin.gifsicle(),
            ])
        )
        .pipe(gulp.dest('dist/image'));
}

// videoをそのまま吐き出す
function movie() {
    return gulp.src('./src/movie/*.*').pipe(gulp.dest('dist/movie'));
}

// faviconをそのまま吐き出す
function favicon() {
    return gulp.src('./src/image/*.ico').pipe(gulp.dest('dist/image'));
}

// PDFをそのまま吐き出す
function pdf() {
    return gulp.src('./src/pdf/*.*').pipe(gulp.dest('dist/pdf'));
}

// JSファイルを圧縮
// function jsMin(done) {
//     gulp.watch('./src/js/*.js', function() {
//         return gulp
//             .src('./src/js/*.js')
//             .pipe(gulp.dest('./dist/js'))
//             .pipe(uglify())
//             .pipe(rename({ suffix: '.min' }))
//             .pipe(gulp.dest('./dist/js'));
//     });
// done();
// }

// webpackでjsをbundleしてdistに吐き出し
function jsBundle(done) {
    return webpackStream(webpackConfig, webpack).pipe(gulp.dest('dist/js'));
}

// srcのファイルに変更があれば自動でリロード
function watchFile(done) {
    gulp.watch('./src/**/*.html', htmlMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/**/*.pug', pugMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/sass/**/*.{scss,sass}', sassMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/js/**/*.js', jsBundle).on('change', gulp.series(browserReload));
    gulp.watch('./src/image/*.{jpg,jpeg,png,gif,svg}', imageMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/movie/*.*', movie).on('change', gulp.series(browserReload));
    gulp.watch('./src/favicon/*.*', favicon).on('change', gulp.series(browserReload));
    gulp.watch('./src/pdf/*.*', pdf).on('change', gulp.series(browserReload));
    gulp.series(browserReload);
    done();
}

// タスクの実行！
gulp.watch('./src/movie/*.*', movie).on('change', gulp.series(browserReload));
exports.default = gulp.series(clean, gulp.parallel(htmlMin, pugMin, sassMin, imageMin, movie, favicon, pdf, jsBundle), sync, watchFile);
