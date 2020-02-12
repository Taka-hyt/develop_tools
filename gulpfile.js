// ブラウザの自動リロード
// HTMLファイル変更時の自動リロード
// CSSファイル変更時の自動リロード
// JSファイル変更時の自動リロード

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const htmlmin = require('gulp-htmlmin');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');
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
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
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

function browserReload(done) {
    browserSync.reload();
    done();
}

// function clean(done) {
//     return gulp.src('./dist/**', { read: false }).pipe(rimraf());
// }

// HTMLファイルをdistディレクトリに吐き出す
function htmlMin(done) {
    return gulp
        .src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'));
    done();
}

function pugMin(done) {
    console.log('pugpug');
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

// ファイル変更時に自動更新
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

// imageフォルダの画像を自動圧縮
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

// webpackでjsをbundle
function jsBundle(done) {
    return webpackStream(webpackConfig, webpack).pipe(gulp.dest('dist/js'));
}

function watchFile(done) {
    gulp.watch('./src/**/*.html', htmlMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/**/*.pug', pugMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/sass/**/*.{scss,sass}', sassMin).on('change', gulp.series(browserReload));
    gulp.watch('./src/js/**/*.js', jsBundle).on('change', gulp.series(browserReload));
    gulp.watch('./src/image/*.{jpg,jpeg,png,gif,svg}', imageMin).on('change', gulp.series(browserReload));
    gulp.series(browserReload);
    done();
}

gulp.task('default', gulp.series(sync, htmlMin, pugMin, sassMin, imageMin, jsBundle, watchFile));
