const gulp = require('gulp')
const sass =  require('gulp-sass')
const browserify = require('gulp-browserify')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('sass', function () {
    gulp.src('src/sass/app.scss')
        .pipe(sass({
            includePaths: [
                'node_modules/bulma'
            ]
        }))
        .pipe(gulp.dest("compiled/css"))
})

gulp.task('vue.js', function () {
    gulp.src('src/js/app.js')
        .pipe(sourcemaps.init({}))
            .pipe(browserify({
                transform: ['vueify', 'babelify', 'aliasify'],
                presets: ["es2015"]
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/js'))
})

gulp.task('watcher', function () {
    gulp.watch(['src/sass/**/*.scss', 'src/sass/**/*.sass'], ['sass'])
    gulp.watch(['src/js/**/*.js', 'src/js/**/*.vue'], ['vue.js'])
})

gulp.task('default', ['watcher', 'sass', 'vue.js'])