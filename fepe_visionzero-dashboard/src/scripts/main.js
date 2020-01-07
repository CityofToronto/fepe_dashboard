// The main javascript file for fepe_visionzero-dashboard.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

const CURRENT_YEAR = parseInt(moment().format('YYYY'), 10);

String.prototype.formatNumber = function() {
  var n = this;
  var decimal = arguments[0];
  var places = arguments[1]||2;

  var intNum = typeof n != 'number' ? parseFloat(n.replace(/\,/g, '')) : n;

  if(decimal > 0)  initNum = intNum.toFixed(places);
  return intNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
/*
  if (Math.floor(intNum) > 0.99) intNum = intNum.toFixed(0);

  if (!decimal) {

    console.log( intNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') );

    return intNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  if (decimal) {
    var per = intNum * 1;
    if( Math.floor(per) != 0 ) return per.toFixed(0);
    if( Math.floor(per) == 0 ) return per.toFixed(places);
  }
*/
};
var apiContent;
let $container = $('#fepe_visionzero-dashboard_container');
var vs = new VisionZero();

var $ariaLive = document.createElement('div')
    $ariaLive.id = 'js-visionzero-dashboard-status';
    $ariaLive.classList.add('sr-only');
    $ariaLive.setAttribute('aria-live','polite');
    $ariaLive.setAttribute('aria-role','status');
    $ariaLive.setAttribute('aria-relevant','additions text');

document.body.appendChild($ariaLive);
$(document).ready(function(){
  
  $.ajax('/*@echo APP_CONFIG*/').then(res=>{
    console.log('/*@echo APP_CONFIG*/',res[0])
    initApp(res[0])
  })
  .fail(res=>{
    $container.html('<p>Error Loading Content</p>');
  })
})

const initApp = function(apiContent){
  $('#general-data').removeAttr('hidden');

  function getMaxDate(url,dateField){
    var maxDatePromise = $.Deferred();
    const queryString = `/query?where=1%3D1&outFields=${dateField}&orderByFields=${dateField}+DESC&resultRecordCount=1&f=json` ;
    $.ajax({
      url:url + queryString,
      method: 'GET',
      success: function(data) {
        var maxData = JSON.parse(data);
        if(maxData.hasOwnProperty('features')){
          maxDatePromise.resolve(parseInt(maxData.features[0].attributes[dateField]));
        }
      }
    });
    return maxDatePromise.promise();
  }

  /*
  
  LOAD KSI PAGEs
  
  */
  if( $container.parent().data('page-ksi') ){
    var page = $container.parent().data('page-ksi');
    var type = $container.parent().data('injurytype')||4;
    
    $('#general-data').attr('hidden','');
    $('#single-data').attr('hidden','');
    $('#ksi-data').removeAttr('hidden');

    var lastFiveYear = parseInt(moment().subtract(10, 'years').format('YYYY'));
    $ariaLive.innerText = 'Loading dashboard data';
    Promise.all(
      [vs.getModeOfTravelByYear({from:lastFiveYear, to:CURRENT_YEAR, INJURY_TYPE:type}).then(res=>{
        let content;
        let now = moment().format('YYYY');
        let widget = document.getElementById('card-detail--ksi');
        content = apiContent['ksi-data'][4];
        widget.chartTitle = type==4?'Fatalities By Road User':'Seriously Injured By Road User';
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.data = res;


        /* Set the titles and default values */
        let total = 0;
        for(var i = 0; i < 4; i++){
          let widgeta = document.getElementById(`card-detail--${i}`);
          widgeta.chartTitle = `${widgeta.chartTitle} (${now})`;
        }


        res.chartData.datasets.forEach((dataset,ndx)=>{
          let widget = document.getElementById(`card-detail--${ndx}`);
          content = apiContent['ksi-data'][ndx];
          total = dataset.data[ dataset.data.length-1 ]||0;
          //widget.chartTitle = `${dataset.label} (${now})`;
          widget.setAttribute('caption', res.chartOptions.caption );
          widget.setAttribute('chart-colour', content.colour);
          widget.setAttribute('chart-value', total.toString().formatNumber());
        })
      }),
    ]).then(res=>{
      $ariaLive.innerText = 'Finished loading dashboard data';
    }).catch(err=>{
      $('#fepe_visionzero-dashboard_container').html('<div class="well">Error Loading Data</div>');
      $ariaLive.innerText = 'Error loading dashboard data';
    });
    
   
  } else {
    $('#ksi-data').attr('hidden','');
  }



  /*
    LOAD SUBPAGE
  */

  if( $container.parent().data('page') ){
    var page = $container.parent().data('page');
    var target = $container.parent().data('target');
    var content;

    //Remove Target for Senior Safety Zones and Red Light Cameras
    if(page == 'getSeniorSafetyZoneData' || page == 'getRedLightCameraData'){
      $('#card-detail--target').attr('hidden','');
    }

    
    $('#general-data').attr('hidden','');
    $('#ksi-data').attr('hidden');
    $('#single-data').removeAttr('hidden');

    var lastUpdated = '';
    $ariaLive.innerText = 'Loading dashboard data';
    Promise.all(
      [
        vs[page]({from:CURRENT_YEAR, to:CURRENT_YEAR}).then(res=>{
          let widget = document.getElementById('card-detail--current');
          let total = 0;
          content = apiContent['single-data'][0];
          //if(res.chartData.datasets.length > 0) {
            res.chartData.datasets.forEach(d=>{
              console.log(d)
              d.data.map(val=>{ total += val.y; });
            })
          //}

          if(page === 'getRedLightCameraData' || page === 'getLEDBlankoutSignData' || page === 'getAudiblePedestrianSignalData'){
            widget.chartTitle = `Intersection Installs in ${CURRENT_YEAR}`;
          } else {
            widget.chartTitle = content.title;
          }
          lastUpdated = res.chartOptions.caption;

        

          widget.setAttribute('chart-value', total.toString().formatNumber());
          widget.setAttribute('caption', lastUpdated );
          return res;
        }).catch(err=>{
          content = apiContent['single-data'][0];
          let widget = document.getElementById('card-detail--current');
              widget.setAttribute('chart-value', '&ndash;');

          $ariaLive.innerText = `Error loading ${content.title} data`;
        }),

        vs[page]({from:2016, to:CURRENT_YEAR}).then(res=>{
          let widgetA = document.getElementById('card-detail--target');
          let totalA = target||0;
          content = apiContent['single-data'][1];
          //res.chartData.datasets[0].data.map(val=>{ totalA += val.y; });
          widgetA.setAttribute('caption', '' );
          widgetA.setAttribute('chart-value', totalA.toString().formatNumber());
    
          let widgetB = document.getElementById('card-detail--current');
          // var totalB = 0;
          // content = apiContent['single-data'][0];
          // res.chartData.datasets[0].data.map(val=>{ totalB += val.y; });
          widgetB.setAttribute('caption', res.chartOptions.caption );
          // widgetB.setAttribute('chart-value', totalB.toString().formatNumber());
          lastUpdated = res.chartOptions.caption;
    
          let widgetC = document.getElementById('card-detail--chart');
          let totalC = 0;
          content = apiContent['single-data'][2];
          widgetC.setAttribute('caption', res.chartOptions.caption );
          widgetC.data = res;
          return res;
        }).catch(err=>{
          content = apiContent['single-data'][2];        
          var widgetA = document.getElementById('card-detail--target');
          var widgetB = document.getElementById('card-detail--current');
          var widgetC = document.getElementById('card-detail--chart');

          widgetA.setAttribute('chart-value', '&ndash;');
          widgetB.setAttribute('chart-value', '&ndash;');
          $('#card-detail--chart').html(`<div class="well">Error loading ${content.title} data</div>`);

          $ariaLive.innerText = `Error loading ${content.title} data`;
        }),
      ]
    ).then(data=>{
      console.log('All Data Loaded',data,lastUpdated, data[1].chartOptions.caption);
      let widget = document.getElementById('card-detail--current');
          //widget.setAttribute('caption', lastUpdated );
          widget.querySelector('.chart--caption').innerText = data[1].chartOptions.caption;

      $ariaLive.innerText = 'Finished loading dashboard data';
    }).catch(err=>{
      $('#fepe_visionzero-dashboard_container').html(`<div class="well">Error</div>`);
      $ariaLive.innerText = 'Error loading dashboard data';
    });

  } else {
    $('#single-data').attr('hidden','');    
  }

  

  /*
  LOAD MAIN PAGE
  */

 document.querySelectorAll('.current-year').forEach(node=>{
  node.innerText = `${CURRENT_YEAR}`;
 })

  if( !$container.parent().data('page') && !$container.parent().data('page-ksi')  ){
    $ariaLive.innerText = 'Loading dashboard data';
  Promise.all(
    [
      vs.getModeOfTravelByMonth({from:CURRENT_YEAR, to:CURRENT_YEAR, INJURY_TYPE:4}).then(res=>{
        var content = apiContent['general-data'][10];
        var widget = document.getElementById('TrendByModeFatalities');
        widget.chartTitle = content.title;
        widget.data = res;
      }).catch(err=>{
        var content = apiContent['general-data'][10];
        $('#TrendByModeFatalities').html(`<div class="well">Error loading ${content.title} data</div>`);
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getModeOfTravelByMonth({from:CURRENT_YEAR, to:CURRENT_YEAR, INJURY_TYPE:3}).then(res=>{
        var content = apiContent['general-data'][11];
        var widget = document.getElementById('TrendByModeSeriouslyInjured');
        widget.chartTitle = content.title;
        widget.data = res;
      }).catch(err=>{
        var content = apiContent['general-data'][11];
        $('#TrendByModeSeriouslyInjured').html(`<div class="well">Error loading ${content.title} data</div>`);
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      


      vs.getFatalitiesData({from:CURRENT_YEAR,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][8];
        var widget = document.getElementById('card-00');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
        
      }).catch(err=>{
        var content = apiContent['general-data'][8];
        var widget = document.getElementById('card-00');
        widget.setAttribute('chart-value', '0');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getSeriouslyInjuredData({from:CURRENT_YEAR,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][9];
        var widget = document.getElementById('card-01');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][9];
        var widget = document.getElementById('card-01');
        widget.setAttribute('chart-value', '0');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),


      vs.getCommunitySafetyZoneData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][0];
        var widget = document.getElementById('card-1');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][0];
        var widget = document.getElementById('card-1');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getSeniorSafetyZoneData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][1];
        var widget = document.getElementById('card-2');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][1];
        var widget = document.getElementById('card-2');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getSchoolSafetyZoneData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][2];
        var widget = document.getElementById('card-3');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][2];
        var widget = document.getElementById('card-3');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getTrafficSignalData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][3];
        var widget = document.getElementById('card-4');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][3];
        var widget = document.getElementById('card-4');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getLeadingPedestrianIntervalData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][4];
        var widget = document.getElementById('card-5');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][4];
        var widget = document.getElementById('card-5');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getRedLightCameraData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][5];
        var widget = document.getElementById('card-6');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][5];
        var widget = document.getElementById('card-6');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getAudiblePedestrianSignalData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][6];
        var widget = document.getElementById('card-7');
        var total = 0;
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][6];
        var widget = document.getElementById('card-7');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      }),
      vs.getLEDBlankoutSignData({from:2016,to:CURRENT_YEAR}).then(res=>{
        var content = apiContent['general-data'][7];
        var widget = document.getElementById('card-8');
        var total = 0;        
        if(res.chartData.datasets.length > 0) res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }).catch(err=>{
        var content = apiContent['general-data'][7];
        var widget = document.getElementById('card-8');
        widget.setAttribute('chart-value', '&ndash;');
        widget.removeAttribute('href');
        $ariaLive.innerText = `Error loading ${content.title} data`;
      })

    ])
    .then(res=>{
      $ariaLive.innerText = 'Finished loading dashboard data';
    })
  }
}


