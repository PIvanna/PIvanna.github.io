const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');



const html = () => {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({ pretty:true}))
        .pipe(gulp.dest('build'))
}

const styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass({pretty: true}).on('err', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(gulp.dest('build/css'))
}

const scripts = () => {
    return gulp.src('src/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('build/js'))
}

const images = () => {
    return gulp.src('src/styles/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}

const icons = () => {
    return gulp.src('src/styles/icons/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/icons'))
}

const fonts = () => {
    return gulp.src('src/styles/fonts/Montserrat/static/*')
        .pipe(gulp.dest('build/fonts/Montserrat/static'))
}

const fonts1 = () => {
    return gulp.src('src/styles/fonts/Roboto/*')
        .pipe(gulp.dest('build/fonts/Roboto'))
}

const fonts2 = () => {
    return gulp.src('src/styles/fonts/Montserrat/*')
        .pipe(gulp.dest('build/fonts/Montserrat'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload)
}

const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb()})
}

const watch = () => {
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/scripts/**/*.js', scripts);
    gulp.watch('src/images/*', images);
    gulp.watch('src/styles/fonts/*', fonts);
}



exports.default = series(
    deleteBuild,
    parallel(html, styles, scripts, images, fonts, fonts1, fonts2, icons),
    parallel(watch, server)
)