/**
 * Created by listen1013 on 17/1/10.
 */

var gulp = require('gulp'),
    minifyCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint')

// 压缩js, css
gulp.task('minifyCss', function() {
    return gulp.src('src/server/public/css/*')
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyJs', function() {
    return gulp.src('src/server/public/js/*')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyLib', function() {
    return gulp.src('src/server/public/lib/*')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('devConfig', function() {
    return gulp.src('src/config/apiconfig/config-dev.js')
        .pipe(concat('config-now.js'))
        .pipe(gulp.dest('src/config/apiconfig/'));
});

gulp.task('testConfig', function() {
    return gulp.src('src/config/apiconfig/config-test.js')
        .pipe(concat('config-now.js'))
        .pipe(gulp.dest('src/config/apiconfig/'));
});

gulp.task('prodConfig', function() {
    return gulp.src('src/config/apiconfig/config-prod.js')
        .pipe(concat('config-now.js'))
        .pipe(gulp.dest('src/config/apiconfig/'));
});

gulp.task('package', ['minifyCss', 'minifyJs', 'minifyLib'], function() {
    console.log('build success');
});


// lint
const lintDirs = [
    'src/app/**/*.jsx',
    'src/app/**/*.js'
];

gulp.task('lint', () => {
    return gulp.src(lintDirs)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('lintWatch',['lint'], () => {
    gulp.watch(lintDirs, function(event) {
        return gulp.src(event.path)
            .pipe(eslint())
            .pipe(eslint.format());
    });
});
