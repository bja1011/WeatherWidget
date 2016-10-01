var gulp = require("gulp");
var concat = require("gulp-concat");
var less = require('gulp-less');
var lr = require('gulp-livereload');
var preprocess = require('gulp-preprocess');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');

var paths = {
    src: 'src',
    dist: 'dist'
};
gulp.task('index_dev',function(){
    gulp.src(paths.src+'/index.html')
        .pipe(preprocess({
                context: {
                    ENV: "development"
                }
            }
        ))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dist))
        .pipe(lr());
})

gulp.task('index',function(){
    gulp.src(paths.src+'/index.html')
        .pipe(preprocess({
                context: {
                    ENV: "production"
                }
            }
        ))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dist))
        .pipe(lr());
})



gulp.task('assets', function () {
    gulp.src([paths.src + '/assets/**/*'])
        .pipe(gulp.dest(paths.dist + "/assets"))
        .pipe(lr());
});

gulp.task('js', function () {
    gulp.src([
        paths.src + '/js/*.js'
    ])
        .pipe(concat('weather.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest(paths.dist + '/js'))
});

gulp.task('js-dev', function () {
    gulp.src([
        paths.src + '/js/*.js'
    ])
        .pipe(gulp.dest(paths.dist + '/dev/js'))
});

gulp.task('css', function () {

    gulp.src([
        paths.src + '/less/*.less'
    ])
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('weather.min.css'));

})

gulp.task('watch', function () {
    lr.listen();
    gulp.watch(
        paths.src + '/js/*.js', ['js-dev']);
    gulp.watch([
            paths.src + '/less/*.less'
        ], ['css']
    );
    gulp.watch([
        paths.src + '/assets/**/*'
    ], ['assets']);
    gulp.watch([
        paths.src + '/js/guiapp/pages/**/*.html'
    ], ['views']);

    connect.server({
        root: 'dist',
        port:8888,
        livereload: true
    });
});

gulp.task('prod', ['index','assets', 'js', 'css']);
gulp.task('dev', ['index_dev','assets','js-dev', 'css', 'watch']);