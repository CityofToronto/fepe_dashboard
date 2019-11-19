// The main javascript file for fepe_housing.

const ahd = new AffordableHousingData();
const AffordableHousingProjects = [
  {type:'own',label:'777 Victoria Park',latlon:[43.694015799999995,-79.28951119999999],projectInfo:{completed:'2024'}},
  {type:'own',label:'50 Wilson Heights ',latlon:[43.7413369,-79.4154458],projectInfo:{completed:'2024'}},
  {type:'own',label:'140 Merton',latlon:[43.6974603,-79.3918249],projectInfo:{completed:'2024'}},
  {type:'own',label:'705 Warden',latlon:[43.71132789999999,-79.2806745],projectInfo:{completed:'2025'}},
  {type:'own',label:'805 Don Mills',latlon:[43.72064839999999,-79.33876479999999],projectInfo:{completed:'2025'}},
  {type:'own',label:'770 Don Mills',latlon:[43.71039809999999,-79.33400970000004],projectInfo:{completed:'2025'}},
  {type:'own',label:'Bloor/Kipling',latlon:[43.641857, -79.535297],projectInfo:{completed:'2024'}},
  {type:'own',label:'Bloor/Islington',latlon:[43.644843, -79.523430],projectInfo:{completed:'2025'}},
  {type:'own',label:'1250 Eglinton W.',latlon:[43.578288, -79.683015],projectInfo:{completed:'2026'}},
  {type:'own',label:'251 Esther Shiner',latlon:[43.768510, -79.366441],projectInfo:{completed:'2026'}},
  {type:'own',label:'3933 Keele',latlon:[43.763046, -79.490852],projectInfo:{completed:'2026'}},
  {type:'rental',label:'30 Cosburn Ave',latlon:[43.6889031771, -79.3527309834],projectInfo:{completed:'2019-1'}},
  {type:'rental',label:'110 River Street',latlon:[43.660710805, -79.358266884],projectInfo:{completed:'2019-2'}},
  {type:'rental',label:'63-65 Homewood Ave',latlon:[43.66506921, -79.374930399],projectInfo:{completed:'2019-4'}},
  {type:'rental',label:'9 Huntley St',latlon:[43.6687347588, -79.3776411384],projectInfo:{completed:'2019-9'}},
  {type:'rental',label:'200 Madison Ave',latlon:[43.676442017, -79.500116466],projectInfo:{completed:'2019-9'}},
  {type:'rental',label:'212 Epson Downs',latlon:[43.7237320593, -79.490852],projectInfo:{completed:'2019-11'}},
  {type:'rental',label:'150 River Street',latlon:[43.662110961, -79.35881063],projectInfo:{completed:'2019-12'}},
  {type:'rental',label:'14 Spadina Road',latlon:[43.6678434794, -79.4049570473],projectInfo:{completed:'2019-12'}},
  {type:'rental',label:'25 Leonard Street',latlon:[43.6538260344, -79.4041248696],projectInfo:{completed:'2019-Q1'}},
  {type:'rental',label:'257 Dundas Street East',latlon:[43.6580304486, -79.3721056808],projectInfo:{completed:'2020-Q1'}},
  {type:'rental',label:'33 King Street',latlon:[43.702358535, -79.51891304],projectInfo:{completed:'2020-Q2'}},
  {type:'rental',label:'22 John Street',latlon:[43.701860897, -79.517659198],projectInfo:{completed:'2020-Q2'}}
]

const $map = L.map('js-housing-map',{scrollWheelZoom: false});
const $mapRentaleHousing = L.map('js-rental-housing-map',{scrollWheelZoom: false})
const $allHousingMap = L.map('js-allhousing-map',{scrollWheelZoom: false})

new (Backbone.Router.extend({
  routes: {
    "": () => {
      document.getElementById(`js-page-01`).hidden = false;
      document.getElementById(`js-page-02`).hidden = true;
      document.getElementById(`js-page-03`).hidden = true;
      document.getElementById(`js-page-04`).hidden = true;
    },
    "page": (s) => {
      document.getElementById(`js-page-01`).hidden = false;
      document.getElementById(`js-page-02`).hidden = true;
      document.getElementById(`js-page-03`).hidden = true;
      document.getElementById(`js-page-04`).hidden = true;
    },
    "page/:id": (id) => {
      document.getElementById(`js-page-01`).hidden = true;
      document.getElementById(`js-${id}`).hidden = false;
    }
  }
}))();
Backbone.history.start();


$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax




  const maps=[
    $map,
    $mapRentaleHousing,
    $allHousingMap
  ]

  maps.forEach(map=>{
    map.setView([43.694015799999995,-79.28951119999999], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  })


  let markers = [];
  let featureGroup;


  markers = []
  AffordableHousingProjects.forEach(addr=>{
    markers.push(
      L.marker(addr.latlon)
        .bindPopup(`<b>${addr.label}</b><br/>Est. move in date: ${addr.projectInfo.completed}`)
    )
  })
  featureGroup = L.featureGroup(markers).addTo($allHousingMap);
  $allHousingMap.fitBounds(featureGroup.getBounds());

  
  


  markers = []
  AffordableHousingProjects.forEach(addr=>{
    if(addr.type == 'rental')
      markers.push(
        L.marker(addr.latlon)
          .bindPopup(`<b>${addr.label}</b><br/>Est. move in date: ${addr.projectInfo.completed}`)
      )
  })
  featureGroup = L.featureGroup(markers).addTo($mapRentaleHousing);
  $mapRentaleHousing.fitBounds(featureGroup.getBounds());
  

  /*
  Setup Map|List buttons
  */

  const $btns = document.querySelectorAll('[data-toggle="buttons"] [type="radio"]');
        $btns.forEach($btn=>{
          $btn.parentElement.addEventListener('click',evt=>{
            let $options = $btn.parentElement.parentElement.querySelectorAll('[type="radio"]')
                $options.forEach($option=>{
                  let control = $option.getAttribute('aria-controls');
                  let $controlTarget = document.getElementById(control);
                  $controlTarget.hidden = true;
                })

            let $target = evt.target.firstChild;
            let controls = $target.getAttribute('aria-controls');
            let $view = document.getElementById(controls);            
            $view.hidden = false;
            console.log(currentSelected,$target,controls,$view)
          })
        })

  /*
  Summary
  */
 
 
  ahd.getHousingProjectData().then(res=>{
    $widget = document.getElementById('js-units-by-year');
    $widget.data = res;
  })

  ahd.getHousingProjectByUnitData().then(res=>{
    $widget = document.getElementById('js-units');
    $widget.data = res;
  });

  ahd.getHousingProjectByOwnershipData().then(res=>{
    $widget = document.getElementById('js-units--ownedrented');
    $widget.data = res;
  });

  

  let $master;
  let $detail;
  /*
  HOUSING NOW PROGRAM
  */

  //Get Estimated Units
  ahd.getHousingNowData().then(res=>{
    $widget = document.getElementById('js-housingnow-units');
    $widget.data = res;
    console.log($widget, res)
  })

  // Setup Master Detail View
  $master = document.getElementById('js-housing-property-master');
  $detail = document.getElementById('js-housing-property-detail');
  if($master && $detail){
    $master.classList.remove('col-sm-9');
    $master.classList.add('col-sm-12');  
  }

  // Setup Map Markers
  markers = []
  AffordableHousingProjects.forEach(addr=>{
    if(addr.type == 'own')
      markers.push(
        L.marker(addr.latlon)
          .bindPopup(`<b>${addr.label}</b><br/>Est. move in date: ${addr.projectInfo.completed}`)
      )
  })
  featureGroup = L.featureGroup(markers).addTo($map);
  featureGroup.on('click',evt=>{
    $master.classList.remove('col-sm-12');
    $master.classList.add('col-sm-9'); 

    $detail.classList.add('col-sm-12');
    $detail.hidden = false;
    let $closeBtn = $detail.querySelector('.btn')
        $closeBtn.addEventListener('click',evt=>{
          $master.classList.remove('col-sm-9');
          $master.classList.add('col-sm-12'); 
          $detail.hidden = true;
        })
  })
  $map.fitBounds(featureGroup.getBounds());



  /*
  Affordable Rental Housing
  */
  ahd.getCityOpenDoorIncentiveData().then(res=>{
    $widget = document.getElementById('js-rental-incentive');
    $widget.data = res;
    console.log($widget, res)
  })
  
})