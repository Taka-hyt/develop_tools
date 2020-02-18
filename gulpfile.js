const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');
const rimraf = require('gulp-rimraf');
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
function clean(done) {
    // return gulp.src('./dist/', { read: false }).pipe(rimraf());
    return gulp.src('./dist/', { allowEmpty: true }).pipe(rimraf());
    done();
}

// HTMLをMinifyしてdistディレクトリに吐き出す
function htmlMin(done) {
    return gulp
        .src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'));
    done();
}

// PugをHTMLに変換・Minifyしてdistに吐き出し
function pugMin(done) {
    return gulp
        .src('./src/pug/**/*.pug')
        .pipe(plumber())
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/pug/'));
    done();
}

// SassをCSSに変換・Minifyしてdistに吐き出し
function sassMin(done) {
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
    done();
}

// imageをMinifyしてdistに吐き出し
function imageMin(done) {
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
    done();
}

// videoをそのまま吐き出す
function movie(done) {
    return gulp.src('./src/movie/*.*').pipe(gulp.dest('dist/movie'));
    done();
}

// PDFをそのまま吐き出す
function pdf(done) {
    return gulp.src('./src/pdf/*.*').pipe(gulp.dest('dist/pdf'));
    done();
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
//     done();
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
    gulp.watch('./src/pdf/*.*', pdf).on('change', gulp.series(browserReload));
    gulp.series(browserReload);
    done();
}

// タスクの実行！
gulp.task('default', gulp.series(sync, clean, htmlMin, pugMin, sassMin, imageMin, movie, pdf, jsBundle, watchFile));
