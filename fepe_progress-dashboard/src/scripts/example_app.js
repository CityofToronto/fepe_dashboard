class SampleApp extends (window['CotApp'] || window['CotApp']) {
  constructor() {
    super();
    this.$container = $('#fepe_dashboard_container');
    this.currentlySelectedSection = '';
    this.renderedSections = {};
  }

  render() {
    //@if !IS_EMBEDDED
    super.render(); //this function only exists in CotApp
    //@endif

    //this.startRouter();
    this.enableIndicatorFilters();
  }

  enableIndicatorFilters(){
    console.log('THIS')
      /*
    for(var i =1; i<6; i++ ){
      document.getElementById(`pothole-bar${i}`).data = phdata.getData('ytd');
    }
    document.getElementById(`pothole-bar6`).data = new ChartData();
    */
  const $btns = document.querySelectorAll('button');
  console.log($btns);


  $btns.forEach($btn=>{
    $btn.addEventListener('click',evt=>{
      console.log('WORKS')
      evt.preventDefault();
      const cat = evt.target.getAttribute('data-category');
      const $tiles = document.querySelectorAll(`.dashboard__grid--tile [data-category]`);
      $tiles.forEach(tile=>{ tile.classList.remove('hide') })
      
      if(cat!='all'){
        $tiles.forEach(tile=>{ tile.classList.add('hide') })

        const $tiles_selected = document.querySelectorAll(`.dashboard__grid--tile [data-category=${cat}]`);
        $tiles_selected.forEach(tile=>{ tile.classList.remove('hide') })
      }
    })
 })


  }

  /*
  startRouter() {
    new (Backbone.Router.extend({
      routes: {
        "": () => {
          document.getElementById('master').classList.remove('hide')
          document.getElementById('detail').classList.add('hide')
          document.querySelector('.dashboard__nav').classList.remove('hide')
        },
        "detail": (s) => {
          document.getElementById('master').classList.add('hide')
          document.getElementById('detail').classList.remove('hide')
  
          document.querySelector('.dashboard__nav').classList.add('hide')
          phdata = new PotholeData();
          document.getElementById(`pothole-bar1`).data = phdata.getData('ytd')
        }
      }
    }))();
    Backbone.history.start();
  }
  */

}
