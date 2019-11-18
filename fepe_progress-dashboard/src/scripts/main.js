// The main javascript file for fepe_dashboard.
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

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
	    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};




let data = new HousingDashboard();
let categories = [];
let directions=[]
let $filterIndicators = document.getElementById('js-category');
let $filterDirection = document.getElementById('js-desired-direction');
let $filterPopulation = document.getElementById('js-population-group');

data.getHousingData().then(res=>{
  localStorage.setItem('HousingDashboardData',JSON.stringify(res));
  let $dashboardBody = document.createElement('div');
  let categoriesTemp = [];
  let directionTemp = [];
  let populationTemp = [];
  let directionColor  = {};

  let $cards = res.forEach((result,ndx)=>{
    let icon;
    let colour;
    switch (result.direction.toLowerCase()){
      case 'down': 
        icon = 'glyphicon glyphicon-arrow-down';
        colour = '#88161f';
        break;
      case 'up': 
        icon = 'glyphicon glyphicon-arrow-down';
        colour = '#208816';
        break;
      default: 
        icon = 'glyphicon glyphicon-minus';
        colour = '#374047'; 
        break;
    }

    directionColor[result.direction.toLowerCase()] = colour

    directionTemp.push(result.direction);
    //populationTemp.concat(result.population.flat());
    categoriesTemp.push(...result.category.flat())
    let $card= `
    <div 
      data-category="${result.category.toString().toLowerCase()}" 
      data-status="${result.direction.toLowerCase()}" 
      data-keywords="${result.keywords.toString().toLowerCase()}"
      id="panel-${ndx}" 
      class="card card-height">
        <cotui-chart 
          id="card-1" 
          chart-value="${Math.round(result.data.calculatedValue)}"
          href="#detail/${result.id}" 
          chart-type="card" 
          caption="${result.caption}" 
          chart-colour="${colour}" 
          chart-title="${result.label}" 
          x-axisLabel="Fill Date" 
          y-axisLabel="Total Fills">
            <span class="${icon}" style="font-size: 0.75em; color: ${colour}"></span>
        </cotui-chart>
    </div>`;

    $dashboardBody.innerHTML += $card;
  })
  
  console.log(directionColor);

  directions = [...new Set(directionTemp)].sort();
  directions.forEach((status,ndx)=>{
    let li = `<li id="${status.replace(/\s/gi,'_').toLowerCase()}-${ndx}"><button type="button" class="btn btn-link" role="menuitem" data-status="${status.toLowerCase()}"><i style="height: 10px; width:10px; display:inline-block; background: ${directionColor[status.toLowerCase()]};"></i> ${status}</button></li>`
    $filterDirection.insertAdjacentHTML('beforeend', li);
  })


  categories = [...new Set(categoriesTemp)].sort();
  categories.forEach((category,ndx)=>{
    let li = `<li id="${category.replace(/\s/gi,'_').toLowerCase()}-${ndx}"><button class="btn btn-link" role="menuitem" data-category="${category.toLowerCase()}">${category}</button></li>`
    $filterIndicators.insertAdjacentHTML('beforeend', li);
  })

  
  let $body = document.getElementById('master')
  while($dashboardBody.firstChild) {
    $body.appendChild($dashboardBody.firstChild);
  } 

  return res;
}).then(res=>{
  
  let list = [];
  res.forEach(result=>{
    list.push({
      id: result.id ,
      title: result.label,
      keywords: result.keywords,
      direction: result.direction,
      category: result.category
    });
  })

  var options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'title',
      'keywords',
      'category'
    ]
  };
  var fused = new Fuse(list, options);

  var input = document.getElementById('js-datatable__input');
  var cards = document.querySelectorAll('#master [data-category]');

  input.addEventListener('keyup',evt=>{
    var val = evt.target.value;
    var searchResult = fused.search(val);
    cards.forEach(card=>{
      if(val != ''){
        card.style.display = 'none';
      } else {
        card.style.display = null;
      }
    })

    searchResult.forEach(res=>{
      document.getElementById(res.id).style.display = null;
    });
  })

})
















$(document).ready(function(){
  const dashboard = new Dashboard();
  console.log('DASHBOARD', dashboard);
  console.log( dashboard.getDateRange('season'));

  dashboard.startRouter();

  // var themeBtn = document.querySelectorAll('#theme-filter [data-category]')
  // themeBtn.forEach(btn=>{
  //   btn.addEventListener('click',evt=>{
  //     var cat = evt.target.dataset.category;
  //     var cards = document.querySelectorAll(`#master [data-category]`);
  //         cards.forEach(card=>{ card.style.display = 'none';  })


  //     console.log(cat);
      
  //     if(cat !== 'all'){
  //       var cards = document.querySelectorAll(`#master [data-category="${cat}"]`);
  //       console.log(cat,cards)
  //       cards.forEach(card=>{
  //         card.style.display = null;
  //       })
  //     } else {
  //       var cards = document.querySelectorAll(`#master [data-category]`);
  //       cards.forEach(card=>{
  //         card.style.display = null;
  //       })
  //     }
  //     evt.preventDefault();      
  //   })
  // });

  // var statusBtn = document.querySelectorAll('#status-filter [data-status]')
  // statusBtn.forEach(btn=>{
  //   btn.addEventListener('click',evt=>{
  //     var cat = evt.target.dataset.status;
  //     var cards = document.querySelectorAll(`#master [data-status]`);
  //       cards.forEach(card=>{ card.style.display = 'none';  })


  //     if(cat !== 'all'){
  //       var cards = document.querySelectorAll(`#master [data-status="${cat}"]`);
  //       console.log(cat,cards)
  //       cards.forEach(card=>{
  //         card.style.display = null;
  //       })
  //     } else {
  //       var cards = document.querySelectorAll(`#master [data-status]`);
  //       cards.forEach(card=>{
  //         card.style.display = null;
  //       })
  //     }
  //     evt.preventDefault();      
  //   })
  // });
})






$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax

  //create a new application object:
  //let app = new SampleApp('fepe_dashboard');

  // //@if !IS_EMBEDDED
  // app.setBreadcrumb([ //only standalone apps set their own breadcrumb
  //   {"name": "fepe_dashboard", "link": "#"}
  // ]);
  // //@endif

  // document.querySelector('h1').innerText = "Housing Dashboard";
  // app.render(); //render the application


  
  
  
});




  