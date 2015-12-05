gulp = require 'gulp'
$ = require('gulp-load-plugins')()

gulp.task 'babel', ->
  gulp.src 'src/**/*.js'
    .pipe $.babel()
    .pipe gulp.dest 'lib'

gulp.task 'jade', ->
  gulp.src 'src/views/**/*.jade'
    .pipe gulp.dest 'lib/views'

gulp.task 'stylus', ->
  gulp.src 'src/styles/style.styl'
    .pipe $.stylus()
    .pipe gulp.dest 'public/assets'

gulp.task 'default', ['babel', 'jade', 'stylus']

gulp.task 'watch', ['default'], ->
  gulp.watch 'src/**/*.js', ['babel']
  gulp.watch 'src/views/**/*.jade', ['jade']
  gulp.watch 'src/styles/**/*.styl', ['stylus']
