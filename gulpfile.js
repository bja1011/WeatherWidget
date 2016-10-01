var gulp = require("gulp");
var concat = require("gulp-concat");
var less = require('gulp-less');
var lr = require('gulp-livereload');
var preprocess = require('gulp-preprocess');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var merge = require('merge-stream');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
    src: 'src',
    dist: '../../web/apps/game'
};

gulp.task('assets', function () {
    gulp.src([paths.src + '/assets/**/*'])
        .pipe(gulp.dest(paths.dist + "/assets"))
        .pipe(lr());
});

gulp.task('views', function () {
    gulp.src([paths.src + '/js/guiapp/pages/**/*.html'])
        .pipe(gulp.dest(paths.dist + "/views/pages/"))
        .pipe(lr());
});

gulp.task('js-libs', function () {
    gulp.src([
        paths.src + '/libs/jquery.min.js',
        paths.src + '/libs/angular.min.js',
        paths.src + '/libs/ngUpload.js',
        paths.src + '/libs/phaser.min.js',
        paths.src + '/libs/phaser-debug.js',
        paths.src + '/libs/bootstrap.js',
        paths.src + '/libs/ui-bootstrap.min.js',
        paths.src + '/libs/angular-animate.min.js',
        paths.src + '/libs/angular-route.min.js',
        paths.src + '/libs/angular-sanitize.min.js',
    ])
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest(paths.dist + '/libs'))

    gulp.src([
        paths.src + '/libs/scrollbars/*.*']
    )
        .pipe(gulp.dest(paths.dist + '/libs/scrollbars'))
        .pipe(lr());
});

gulp.task('js-game', function () {
    gulp.src([
        paths.src + '/js/game/config.js',
        paths.src + '/js/game/boot.js',
        paths.src + '/js/game/preloader.js',
        paths.src + '/js/game/menu.js',
        paths.src + '/js/game/game.js',
        paths.src + '/js/game/main.js'
    ])
        .pipe(concat('game.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest(paths.dist + '/js'))
});

gulp.task('js-game-dev', function () {
    gulp.src([
        paths.src + '/js/game/*.js'
    ])
        .pipe(gulp.dest(paths.dist + '/dev/js'))
});

gulp.task('js-gui', function () {
    gulp.src([
            paths.src + '/js/guiapp/guiapp.js',
            paths.src + '/js/guiapp/controllers.js',
            paths.src + '/js/guiapp/pages/**/*.js',
            paths.src + '/js/guiapp/filters.js',
            paths.src + '/js/guiapp/services.js',
            paths.src + '/js/guiapp/directives.js'
        ]
    )
        .pipe(concat('guiapp.js'))
        .pipe(rename('guiapp.min.js'))
        .pipe(gulp.dest(paths.dist + '/js'))
});

gulp.task('js-gui-dev', function () {
    gulp.src([
        paths.src + '/js/guiapp/**/*']
    )
        .pipe(gulp.dest(paths.dist + '/dev/js'))
        .pipe(lr());
});

gulp.task('js-all', ['js-libs', 'js-game', 'js-gui']);
gulp.task('js-all-dev', ['js-libs', 'js-game-dev', 'js-gui-dev']);

gulp.task('less-mobile', function () {
    gulp.src(paths.src + '/js/less/mobile/*.less')
        .pipe(less())
        .pipe(rename('game-mobile.min.css'))
        .pipe(gulp.dest(paths.src + '/css/mobile'))

});

gulp.task('cssMerge', function () {

    var lessStream =
        gulp.src([
            paths.src + '/less/*.less',
            paths.src + '/js/guiapp/pages/**/*.less'
        ])
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(concat('game.min.css'));
    //.pipe(gulp.dest(paths.src+'/css'))

    var cssStream =
        gulp.src([
            paths.src + '/css/bootstrap.min.css',
            paths.src + '/css/main.css'
            //paths.src+'/css/game.min.css'
        ])
            .pipe(concat('all.css'))
    //.pipe(gulp.dest(paths.dist+'/css'))


    return merge(lessStream, cssStream)
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest(paths.dist + '/css'))
        .pipe(lr());

})

gulp.task('cssMobileMerge', function () {

    var lessStream =
        gulp.src([
            paths.src + '/less/mobile/*.less',
            paths.src + '/js/guiapp/pages/**/*.less'
        ])
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(concat('game.css'));
    //.pipe(gulp.dest(paths.src+'/css'))


    var cssStream =
        gulp.src([
            paths.src + '/css/mobile/bootstrap.min.css',
            paths.src + '/css/mobile/main.css'
        ])
            .pipe(concat('all.css'))


    return merge(lessStream, cssStream)
        .pipe(concat('mobile.min.css'))
        .pipe(gulp.dest(paths.dist + '/css/mobile'))
        .pipe(lr());

})

gulp.task('css-mobile', function () {
    gulp.src([
        paths.src + '/css/mobile/bootstrap.min.css',
        paths.src + '/css/mobile/main.css',
        paths.src + '/css/mobile/game-mobile.min.css'
    ])
        .pipe(concat('mobile.min.css'))
        .pipe(gulp.dest(paths.dist + '/css/mobile'))
        .pipe(lr());
});

gulp.task('css-all', ['cssMerge', 'cssMobileMerge']);

gulp.task('copyLibs', function () {
    gulp.src(paths.src + '/libs/**/*')
        .pipe(gulp.dest(paths.dist + '/libs'))
});

gulp.task('watch', function () {
    lr.listen();
    gulp.watch([
        paths.src + '/js/game/*.js',
        paths.src + '/js/guiapp/**/*.js'], ['js-all-dev']);
    gulp.watch([
            paths.src + '/less/*.less',
            paths.src + '/less/mobile/*.less',
            paths.src + '/js/guiapp/pages/**/*.less',
        ], ['css-all']
    );
    gulp.watch([
        paths.src + '/assets/**/*'
    ], ['assets']);
    gulp.watch([
        paths.src + '/js/guiapp/pages/**/*.html'
    ], ['views']);
});

gulp.task('prod', ['assets','views', 'js', 'css']);
gulp.task('dev', ['assets', 'views','js-dev', 'css', 'watch']);