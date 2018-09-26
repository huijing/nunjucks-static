const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const prefix      = require('gulp-autoprefixer');
const cssnano     = require('gulp-cssnano');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const render      = require('gulp-nunjucks-render');

const startServer = (done) => {
  browserSync.init({
    server: "./",
    port: 6950
  })
  done()
}

const compileScripts = () => { 
  return gulp.src(['js/*.js', 'js/custom.js'])
  .pipe(babel({
    "presets": [ "@babel/preset-env" ]
  }))
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({ stream:true }))
}

const compileStyles = () => {
  return gulp.src('scss/styles.scss')
  .pipe(sass({
    includePaths: ['scss'],
    onError: browserSync.notify
  }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({ stream:true }))
}

const compileMarkup = () => {
  return gulp.src('pages/**/*.+(njk)')
  .pipe(render({
      path: ['templates']
    }))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({ stream:true }))
}

const watchMarkup = () => {
  gulp.watch(['pages/**/*.+(njk)'], compileMarkup);
}

const watchScripts = () => {
  gulp.watch(['js/*.js'], compileScripts);
}

const watchStyles = () => { 
  gulp.watch(['scss/*.scss'], compileStyles)
}

const compile = gulp.parallel(compileScripts, compileStyles, compileMarkup)
compile.description = 'compile all sources'

// Not exposed to CLI
const serve = gulp.series(compile, startServer)
serve.description = 'serve compiled source on local server at port 6950'

const watch = gulp.parallel(watchMarkup, watchScripts, watchStyles)
watch.description = 'watch for changes to all source'

const defaultTasks = gulp.parallel(serve, watch)

export {
  compile,
  compileScripts,
  compileStyles,
  compileMarkup,
  serve,
  watch,
  watchMarkup,
  watchScripts,
  watchStyles,
}

export default defaultTasks
