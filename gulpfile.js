// ブラウザの自動リロード
// HTMLファイル変更時の自動リロード
// CSSファイル変更時の自動リロード
// JSファイル変更時の自動リロード

const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const changed = require("gulp-changed");

// ブラウザの立ち上げ
function sync(done) {
    browserSync.init({
        server: {
            baseDir: "./dist/",
            index: "index.html"
        },
        reloadOnRestart: true
    });
    done();
}
function browserReload(done) {
    browserSync.reload();
    done();
}

// HTMLファイルをdistディレクトリに吐き出す
function watchHtml(done) {
    gulp.watch("./src/**/*.html", function() {
        return gulp.src("./src/**/*.html").pipe(gulp.dest("./dist/"));
    });
    done();
}

// ファイル変更時に自動更新
function watchFiles(done) {
    gulp.watch("./src/sass/**/*.scss", function() {
        return gulp
            .src("./src/sass/**/*.scss")
            .pipe(plumber(notify.onError("Error: <%= error.message %>")))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle: "expanded"
                })
            )
            .on("error", sass.logError)
            .pipe(
                autoprefixer({
                    cascade: false
                })
            )
            .pipe(sourcemaps.write())
            .pipe(gcmq())
            .pipe(gulp.dest("./dist/css"))
            .pipe(cleanCSS())
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(gulp.dest("./dist/css"))
            .pipe(browserSync.reload({ stream: true }));
    });
    gulp.watch("./dist/*.html").on("change", gulp.series(browserReload));
    gulp.watch("./dist/css/*.css").on("change", gulp.series(browserReload));
    gulp.watch("./dist/js/*.js").on("change", gulp.series(browserReload));
    done();
}

// JSファイルを圧縮
function jsMin(done) {
    gulp.watch("./src/js/*.js", function() {
        return gulp
            .src("./src/js/*.js")
            .pipe(gulp.dest("./dist/js"))
            .pipe(uglify())
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("./dist/js"));
    });
    done();
}

// imageフォルダの画像を自動圧縮
function imageMin(done) {
    gulp.watch("./src/image/*.{jpg,jpeg,png,gif,svg}", function() {
        return gulp
            .src("./src/image/*.{jpg,jpeg,png,gif,svg}")
            .pipe(changed("dist/image"))
            .pipe(
                imagemin([
                    pngquant({
                        quality: [0.7, 0.85],
                        speed: 1
                    }),
                    mozjpeg({
                        quality: 85,
                        progressive: true
                    }),
                    imagemin.svgo(),
                    imagemin.optipng(),
                    imagemin.gifsicle()
                ])
            )
            .pipe(gulp.dest("dist/image"));
    });
    done();
}

gulp.task("default", gulp.series(sync, watchHtml, watchFiles, jsMin, imageMin));
