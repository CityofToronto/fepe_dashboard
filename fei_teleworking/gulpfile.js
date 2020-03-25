const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');

core.embeddedApp.createTasks(gulp, {
  pkg,
  embedArea: 'full',
  environmentOverride: null,
  deploymentPath: '',
  preprocessorContext: {
    DEBUG: true,
    local: {
      DATA_SRC: '/data/DashboardData.json',
    },
    dev: {
      DATA_SRC: '/app_content/telework_dashboard/'
    },
    qa: {
      DATA_SRC: '/app_content/telework_dashboard/'
    },
    prod: {
      DATA_SRC: '/app_content/telework_dashboard/'
    },
  },
});


gulp.task('_data', () => {
  let cotuiDEVPath = '/resources/cdn/cotui';
  let dataSrc = '/data';
  gulp.src(['node_modules/cotui/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
  //gulp.src(['/Users/dmatthe/Documents/Development/COT_UI/dist/cotui/**/*']).pipe(gulp.dest('dist' + cotuiDEVPath));
  gulp.src(['src/data/**/*']).pipe(gulp.dest('dist' + dataSrc));
})
