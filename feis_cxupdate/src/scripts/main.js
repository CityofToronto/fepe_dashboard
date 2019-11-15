// The main javascript file for feis_cxupdate.
// IMPORTANT:
// Any resources from this project should be referenced using SRC_PATH preprocessor var
// Ex: let myImage = '/*@echo SRC_PATH*//img/sample.jpg';

$(function () {
  if (window['cot_app']) { //the code in this 'if' block should be deleted for embedded apps
    const app = new cot_app("feis_cxupdate",{
      hasContentTop: false,
      hasContentBottom: false,
      hasContentRight: false,
      hasContentLeft: false,
      searchcontext: 'INTRA'
    });

    app.setBreadcrumb([
      {"name": "feis_cxupdate", "link": "#"}
    ]).render();
  }
  let container = $('#feis_cxupdate_container');
  let $h1 = $('h1');

  $h1.text('CX Snapshot Dashboard');

  
  let toronto311Data = new Toronto311();

  /* Summary */
  toronto311Data.getContactCentreData().then(res=>{
    let $widget = $('#contact-center')[0];
    $widget.data = res;
  });

  toronto311Data.getOnlineData('setOne').then(res=>{
    let $widget = $('#online-setone')[0];
    $widget.data = res;
  });
  
  toronto311Data.getOnlineData('setTwo').then(res=>{
    let $widget = $('#online-settwo')[0];
    $widget.data = res;
  });

  toronto311Data.getContactCentreData('setTwo').then(res=>{
    let $widget = $('#js-channel-useage')[0];
    $widget.data = res;
  });

  /* Maximize Self Service */
  toronto311Data.getServiceRequestsData('setOne').then(res=>{
    let $widget = $('#maximize-self-service__a')[0];
    $widget.data = res;
  });

  toronto311Data.getGeneralInquiriesData('setOne').then(res=>{
    let $widget = $('#maximize-self-service__b')[0];
    $widget.data = res;
  });

  toronto311Data.getOnlineData('setOne').then(res=>{
    let $widget = $('#maximize-self-service__c')[0];
    $widget.data = res;
  });

  toronto311Data.getOnlineData('setOne').then(res=>{
    let $widget = $('#maximize-self-service__d')[0];
    $widget.data = res;
  });
});
