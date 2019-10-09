// The main javascript file for fepe_visionzero-dashboard.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';


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

  if( $container.parent().data('page-ksi') ){
    var page = $container.parent().data('page-ksi');
    var type = $container.parent().data('injurytype')||4;
    
    $('#general-data').attr('hidden','');
    $('#single-data').attr('hidden','');
    $('#ksi-data').removeAttr('hidden');

    var lastFiveYear = parseInt(moment().subtract(10, 'years').format('YYYY'));
    $ariaLive.innerText = 'Loading dashboard data';
    Promise.all(
      [vs.getModeOfTravelByYear({from:lastFiveYear, to:2019, INJURY_TYPE:type}).then(res=>{
        var content;
        var widget = document.getElementById('card-detail--ksi');
        content = apiContent['ksi-data'][4];
        widget.chartTitle = type==4?'Fatalities By Road User':'Seriously Injured By Road User';
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.data = res;
      }),  
      vs.getModeOfTravelByYear({from:2019, to:2019, INJURY_TYPE:type}).then(res=>{
        var content;
        var to = moment().format('YYYY');
        var from = moment().format('YYYY');

        for(var i = 0; i < 4; i++){
          var widget = document.getElementById(`card-detail--${i}`);
          var total = 0;
          widget.chartTitle = `${widget.chartTitle} (${to})`;
          widget.setAttribute('caption', res.chartOptions.caption );
          widget.setAttribute('chart-value', total.toString().formatNumber());
        }

        res.chartData.datasets.map((dataset,ndx)=>{
          var widget = document.getElementById(`card-detail--${ndx}`);
          var total = 0;
          content = apiContent['ksi-data'][ndx];
          dataset.data.map(val=>{ total += val; });
          widget.chartTitle = `${dataset.label!=''?dataset.label:widget.chartTitle} (${to})`;
          widget.setAttribute('caption', res.chartOptions.caption );
          widget.setAttribute('chart-colour', content.colour);
          widget.setAttribute('chart-value', total.toString().formatNumber());
        })

        


  /*
        var widgetA = document.getElementById('card-detail--0');
        var totalA = 0;
        content = apiContent['ksi-data'][0];
        if(res.chartData.datasets[0].length > 0) res.chartData.datasets[0].data.map(val=>{ totalA += val; });
        widgetA.chartTitle = `Motorist (${to})`;
        widgetA.setAttribute('caption', res.chartOptions.caption );
        widgetA.setAttribute('chart-colour', content.colour);
        widgetA.setAttribute('chart-value', totalA.toString().formatNumber());
        
        var widgetB = document.getElementById('card-detail--1');
        var totalB = 0;
        content = apiContent['ksi-data'][1];
        if(res.chartData.datasets[1].length > 0) res.chartData.datasets[1].data.map(val=>{ totalB += val; });
        widgetB.chartTitle = `Pedestrian (${to})`;
        widgetB.setAttribute('caption', res.chartOptions.caption );
        widgetB.setAttribute('chart-colour', content.colour);
        widgetB.setAttribute('chart-value', totalB.toString().formatNumber());
  
        var widgetC = document.getElementById('card-detail--2');
        var totalC = 0;
        content = apiContent['ksi-data'][2];
        res.chartData.datasets[2].data.map(val=>{ totalC += val; });
        widgetC.chartTitle = `Cyclist (${to})`;
        widgetC.setAttribute('caption', res.chartOptions.caption );
        widgetC.setAttribute('chart-colour', content.colour);
        widgetC.setAttribute('chart-value', totalC.toString().formatNumber());
  
        var widgetD = document.getElementById('card-detail--3');
        var totalD = 0;
        content = apiContent['ksi-data'][3];
        res.chartData.datasets[3].data.map(val=>{ totalD += val; });
        widgetD.chartTitle = `Motorcyclist (${to})`;
        widgetD.setAttribute('caption', res.chartOptions.caption );
        widgetD.setAttribute('chart-colour', content.colour);
        widgetD.setAttribute('chart-value', totalD.toString().formatNumber());
*/
      })
    ]).then(res=>{
      $ariaLive.innerText = 'Finished loading dashboard data';
    })
    
   
  } else {
    $('#ksi-data').attr('hidden','');
  }



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

    var showLastUpdated = false;
    $ariaLive.innerText = 'Loading dashboard data';
    Promise.all(
      [
        vs[page]({from:2019, to:2019}).then(res=>{
          var widget = document.getElementById('card-detail--current');
          var total = 0;
          content = apiContent['single-data'][0];
          res.chartData.datasets[0].data.map(val=>{ total += val.y; });
          //widget.setAttribute('caption', res.chartOptions.caption );
          widget.setAttribute('chart-value', total.toString().formatNumber());
        }).catch(res=>{
          var widget = document.getElementById('card-detail--current');
          widget.setAttribute('chart-value', 0);
        }),

        vs[page]({from:2016, to:2019}).then(res=>{
          var widgetA = document.getElementById('card-detail--target');
          var totalA = target||0;
          content = apiContent['single-data'][1];
          //res.chartData.datasets[0].data.map(val=>{ totalA += val.y; });
          widgetA.setAttribute('caption', '' );
          widgetA.setAttribute('chart-value', totalA.toString().formatNumber());
    
          
          var widgetB = document.getElementById('card-detail--current');
          // var totalB = 0;
          // content = apiContent['single-data'][0];
          // res.chartData.datasets[0].data.map(val=>{ totalB += val.y; });
          widgetB.setAttribute('caption', res.chartOptions.caption );
          // widgetB.setAttribute('chart-value', totalB.toString().formatNumber());
    
    
          var widgetC = document.getElementById('card-detail--chart');
          var totalC = 0;
          content = apiContent['single-data'][2];
          widgetC.setAttribute('caption', res.chartOptions.caption );
          widgetC.data = res;
        })
      ]
    ).then(data=>{
      console.log('All Data Loaded');
      $ariaLive.innerText = 'Finished loading dashboard data';
    })
    

    ;

  } else {
    $('#single-data').attr('hidden','');    
  }

  

  if( !$container.parent().data('page') && !$container.parent().data('page-ksi')  ){
    $ariaLive.innerText = 'Loading dashboard data';
  Promise.all(
    [
      vs.getModeOfTravelByMonth({from:2019, to:2019, INJURY_TYPE:4}).then(res=>{
        var content = apiContent['general-data'][10];
        var widget = document.getElementById('TrendByModeFatalities');
        widget.chartTitle = content.title;
        widget.data = res;
      }),
      vs.getModeOfTravelByMonth({from:2019, to:2019, INJURY_TYPE:3}).then(res=>{
        var content = apiContent['general-data'][11];
        var widget = document.getElementById('TrendByModeSeriouslyInjured');
        widget.chartTitle = content.title;
        widget.data = res;
      }),
      
      vs.getFatalitiesData({from:2019,to:2019}).then(res=>{
        var content = apiContent['general-data'][8];
        var widget = document.getElementById('card-00');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getSeriouslyInjuredData({from:2019,to:2019}).then(res=>{
        var content = apiContent['general-data'][9];
        var widget = document.getElementById('card-01');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),


      vs.getCommunitySafetyZoneData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][0];
        var widget = document.getElementById('card-1');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getSeniorSafetyZoneData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][1];
        var widget = document.getElementById('card-2');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getSchoolSafetyZoneData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][2];
        var widget = document.getElementById('card-3');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getTrafficSignalData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][3];
        var widget = document.getElementById('card-4');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getLeadingPedestrianIntervalData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][4];
        var widget = document.getElementById('card-5');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getRedLightCameraData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][5];
        var widget = document.getElementById('card-6');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getAudiblePedestrianSignalData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][6];
        var widget = document.getElementById('card-7');
        var total = 0;
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      }),
      vs.getLEDBlankoutSignData({from:2016,to:2019}).then(res=>{
        var content = apiContent['general-data'][7];
        var widget = document.getElementById('card-8');
        var total = 0;        
        res.chartData.datasets[0].data.map(val=>{ total += val.y; });
        widget.chartTitle = content.title;
        widget.setAttribute('caption', res.chartOptions.caption );
        widget.setAttribute('href', content.url );
        widget.setAttribute('chart-colour', content.colour);
        widget.setAttribute('chart-value', total.toString().formatNumber());
      })      
    ])
    .then(res=>{
      $ariaLive.innerText = 'Finished loading dashboard data';
    });
  }
}


