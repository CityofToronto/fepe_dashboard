const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');

core.embeddedApp.createTasks(gulp, {
  pkg,
  embedArea: 'full',
  environmentOverride: null,
  deploymentPath: '',
  preprocessorContext: {
    local: {
      APP_CONFIG: '/app_content/visionzero-dashboard-dev.json'
    },
    dev: {
      APP_CONFIG: '/app_content/visionzero-dashboard/'
    },
    qa: {
      APP_CONFIG: '/app_content/visionzero-dashboard/'
    },
    prod: {
      APP_CONFIG: '/app_content/visionzero-dashboard/'
    }
  }
});


gulp.task('_data', () => {
  let cotuiDEVPath = '/resources/cdn/cotui/cotui';
  //gulp.src(['node_modules/cotui/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
  gulp.src(['/usr/local/node_apps/toronto_ca/cot-apps/COT_UI/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
})

gulp.task('_data', () => {
  let myDataPath = '/app_content/'; //On S3, this will be something like /data/division/my_app
                            //On WP, this will be something different
  return gulp.src(['src/data/**/*']).pipe(gulp.dest('dist' + myDataPath));
});
