// The main javascript file for fepe_housing.
$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax

  const $map = L.map('js-housing-map',{scrollWheelZoom: false}).setView([43.694015799999995,-79.28951119999999], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });


  const $mapRentaleHousing = L.map('js-rental-housing-map').setView([51.505, -0.09], 13);
  const $allHousingMap = L.map('js-allhousing-map',{scrollWheelZoom: false}).setView([43.694015799999995,-79.28951119999999], 13);

  
        const housingNowAddresses =[
          {label:'777 Victoria Park',latlon:[43.694015799999995,-79.28951119999999],projectInfo:{movein:'2024'}},
          {label:'50 Wilson Heights ',latlon:[43.7413369,-79.4154458],projectInfo:{movein:'2024'}},
          {label:'140 Merton',latlon:[43.6974603,-79.3918249],projectInfo:{movein:'2024'}},
          {label:'705 Warden',latlon:[43.71132789999999,-79.2806745],projectInfo:{movein:'2025'}},
          {label:'805 Don Mills',latlon:[43.72064839999999,-79.33876479999999],projectInfo:{movein:'2025'}},
          {label:'770 Don Mills',latlon:[43.71039809999999,-79.33400970000004],projectInfo:{movein:'2025'}},
          {label:'Bloor/Kipling',latlon:[43.641857, -79.535297],projectInfo:{movein:'2024'}},
          {label:'Bloor/Islington',latlon:[43.644843, -79.523430],projectInfo:{movein:'2025'}},
          {label:'1250 Eglinton W.',latlon:[43.578288, -79.683015],projectInfo:{movein:'2026'}},
          {label:'251 Esther Shiner',latlon:[43.768510, -79.366441],projectInfo:{movein:'2026'}},
          {label:'3933 Keele',latlon:[43.763046, -79.490852],projectInfo:{movein:'2026'}}
        ]

        const markers = [];
        housingNowAddresses.forEach(addr=>{
          markers.push(
            L.marker(addr.latlon)
              .bindPopup(`<b>${addr.label}</b><br/>Est. move in date: ${addr.projectInfo.movein}`)
          )
        })
        
        var featureGroup = L.featureGroup(markers).addTo($map);
            $map.fitBounds(featureGroup.getBounds());
  
  
})