// The main javascript file for fei_teleworking.
String.prototype.formatNumber = function(decimal=0) {
  var n = this;
  if (n==null) {return "";}
  n = parseFloat(n).toFixed(decimal);
  var parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
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




let data = new TeleworkingData();
let categories = [];
let directions=[]
let $filterIndicators = document.getElementById('js-category');
let $filterDirection = document.getElementById('js-desired-direction');
let $filterPopulation = document.getElementById('js-population-group');
let cardsTemp = {};

console.log('START', data)

data.getData().then(res=>{
  console.log('GETDATA')
  localStorage.setItem('DashboardData',JSON.stringify(res));
  let $dashboardBody = document.createElement('div');
  let categoriesTemp = [];
  let directionTemp = [];
  let colourTemp = [];

  let $cards = res.forEach((result,ndx)=>{
    if(!result)return {}
    


    let icon;
    let colour;    
    let trend = result.custom.trendAnalysis[0];

    switch (trend.Analysis.direction.toLowerCase()){
      case 'down': icon = 'glyphicon glyphicon-arrow-down'; break;
      case 'up': icon = 'glyphicon glyphicon-arrow-up'; break;
      default: icon = 'glyphicon glyphicon-minus'; break;
    }
    switch (trend.Analysis.isPositive){
      case -1: colour = '#88161f'; break;
      case 1: colour = '#208816'; break;
      case 0: colour = '#374047'; break;
    }
    

    
    colourTemp.push(colour);
    //directionTemp.push('trend.Analysis.direction');
    directionTemp.push('-');
    //populationTemp.concat(result.population);
    categoriesTemp.push(...result.category )

    let $card= `
    <div 
      data-category="${result.category.toString().toLowerCase()}" 
      data-status="${trend.Analysis.direction}" 
      data-keywords="${result.keywords.toString().toLowerCase()}"
      id="panel-${ndx}" 
      class="card card-height">
        <cotui-chart 
          id="card-1" 
          chart-value="${result.data.calculatedValue.toString().formatNumber()}"
          href="#detail/${result.id||'test'}" 
          chart-type="card" 
          caption="${result.caption}" 
          chart-colour="${colour}" 
          chart-title="${result.label}" 
          x-axisLabel="Fill Date" 
          y-axisLabel="Total Fills">
            <span class="${icon}" style="font-size: 0.75em; color: ${colour}"></span>
        </cotui-chart>
    </div>`;

    //$dashboardBody.innerHTML += $card;

    var category = result.category.toString().toLowerCase();
    if(!cardsTemp.hasOwnProperty(category)){
      cardsTemp[category] = [$card];
    } else {
      cardsTemp[category].push($card);
    }
    

    return  JSON.parse( `{"${result.category.toString().toLowerCase()}" : "$card"}` );
  })



  directions = [...new Set(directionTemp)].sort();
  directions.forEach((status,ndx)=>{
    if(status){
      let li = `<li id="${status.replace(/\s/gi,'_').toLowerCase()}-${ndx}"><button type="button" class="btn btn-link" role="menuitem" data-status="${status.toLowerCase()}"><i style="height: 10px; width:10px; display:inline-block; background: ${colourTemp[ndx]};"></i> ${status}</button></li>`
      $filterDirection.insertAdjacentHTML('beforeend', li);
    }
  })

  //let $tabs = document.getElementById('js-categories');
  let $tabs = document.createElement('cotui-tabs');

  categories = [...new Set(categoriesTemp)].sort();
  categories.forEach((category,ndx)=>{
    let li = `<li id="${category.replace(/\s/gi,'_').toLowerCase()}-${ndx}"><button class="btn btn-link" role="menuitem" data-category="${category.toLowerCase()}">${category}</button></li>`
    $filterIndicators.insertAdjacentHTML('beforeend', li);
    
    let $tab = document.createElement('div');
        $tab.setAttribute('data-label',category.replace(/\&amp\;/gi,'&'))
        $tab.id = `js-tab__category-${ndx}`;  
        $tabs.appendChild($tab);

        for(var cate in cardsTemp){
          if(cate == category.toLowerCase()) $tab.innerHTML += `<div class="dashboard__grid--tile">${cardsTemp[cate].join('')}</div>`;
        }     
    })
    $tabs.setAttribute('selected','js-tab__category-0');
    $tabs.setAttribute('label','Toronto Dashboard Themes');
  
    document.getElementById('js-categories').appendChild($tabs)
  
 
  let $body = document.getElementById('master')
  while($dashboardBody.firstChild) {
    $body.appendChild($dashboardBody.firstChild);
  } 

  return res;
}).then(res=>{
  
  let list = [];
  res.forEach(result=>{
    if(result)
    list.push({
      id: result.id,
      title: result.label.replace(/\n|\r/gi,' ').toLowerCase(),
      keywords: result.keywords,
      direction: result.direction,
      category: result.category
    });
  })

  var options = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    includeScore: true,
    threshold: 0.2,
    location: 1,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 4,
    keys: [
      'title',
      'keywords',
      'category',
      // {name:'title',weight: 0.9},
      // {name:'keywords',weight:0.1},
      // {name:'category',weight:0.1}
    ]
  };
  var fused = new Fuse(list, options);

  var input = document.getElementById('js-datatable__input');
  var cards = document.querySelectorAll('#master [data-category]');

  input.addEventListener('keyup',evt=>{
    var val = evt.target.value.trim();
    var searchResult = fused.search(val);
    


  console.log('TEST', searchResult, val)
    cards.forEach(card=>{
      if(val != ''){
        card.style.display = 'none';
      } else {
        card.style.display = null;
      }
    })


    const exactMatch = searchResult.filter(res=>res.score < 0.0001);
    if(exactMatch)
      exactMatch.forEach(res=>{
        document.getElementById(res.item.id).style.display = null;
      });

    if(exactMatch.length == 0)
      searchResult.forEach(res=>{
          document.getElementById(res.item.id).style.display = null;
          console.log(res.item.id,res.score, res.item.title);
      });

  });

});
















$(document).ready(function(){
  const dashboard = new Dashboard();
  console.log('DASHBOARD', dashboard);
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




  