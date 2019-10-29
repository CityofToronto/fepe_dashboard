const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');

core.embeddedApp.createTasks(gulp, {
  pkg,
  embedArea: 'full',
  environmentOverride: null,
  deploymentPath: '',
  preprocessorContext: {
    local: {},
    dev: {},
    qa: {},
    prod: {}
  }
});


gulp.task('_data', () => {
  //let myDataPath = '/resources/cdn/cotui/cotui';
  let myDataPath = '/webapps/feis_cxupdate/scripts/cotui';
  gulp.src(['/usr/local/node_apps/toronto_ca/cot-apps/COT_UI/dist/cotui/**/*']).pipe(gulp.dest('dist' + myDataPath));
  //gulp.src(['node_modules/cotui/dist/cotui/**/*']).pipe(gulp.dest('dist' + myDataPath));


  // let cotuiDEVPath = '/webapps/cdn/cotui';
  // //gulp.src(['node_modules/cotui/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
  // gulp.src(['/usr/local/node_apps/toronto_ca/cot-apps/COT_UI/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
})