Backbone.Router.prototype.before = function () {};
  Backbone.Router.prototype.after = function () {};
    Backbone.Router.prototype.route = function (route, name, callback) {
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (_.isFunction(name)) {
      callback = name;
      name = '';
    }
    if (!callback) callback = this[name];
  
    var router = this;
  
    Backbone.history.route(route, function(fragment) {
      var args = router._extractParameters(route, fragment);
  
      router.before.apply(router, arguments);
      callback && callback.apply(router, args);
      router.after.apply(router, arguments);
  
      router.trigger.apply(router, ['route:' + name].concat(args));
      router.trigger('route', name, args);
      Backbone.history.trigger('route', router, name, args);
    });
    return this;
  };


class Dashboard{
    constructor(){
      this.fuse = '';
      this.data = new this.Model();
      //this.origtitle = '';
    }

    getDateRange(period){
      let months = moment.months()
      switch(period.toLowerCase()){
        case 'season':
          let seasonTemp = [...months];
              seasonTemp.pop();
              seasonTemp.unshift('December');
          return {
             winter: seasonTemp.slice(0,3),
             spring: seasonTemp.slice(3,6),
             summer: seasonTemp.slice(6,9),
             fall: seasonTemp.slice(9,12)
          }
          break;
        case 'quarter':
            let quarterTemp = [...months];
            return {
                q1: quarterTemp.slice(0,3),
                q2: quarterTemp.slice(3,6),
                q3: quarterTemp.slice(6,9),
                q4: quarterTemp.slice(9,12)
            }
            break;
        default:
            return months;
            break;
      }
    }

    calculateCumulativeData(_dataset,id){
      var b = [null];
      var sum = 0;
      _dataset.data.reduce((prev,curr,ndx,arr)=>{
        sum += arr[ndx-1].y;
        b.y.push({x:arr[ndx-1].x, y:sum});
      });
  
      console.log('calculateCumulativeData',b)
      return [{
        stack:`ytd-${_dataset.label}`,
        label:`Previous Total (${_dataset.label})`,
        backgroundColor:'#ddd' ,
        data:b,
      },{
        stack:`ytd-${_dataset.label}`,
        label:`Added (${_dataset.label})`,
        backgroundColor: _dataset.backgroundColor,
        data:_dataset.data
      }];
    }
    
    startRouter() {
      new (Backbone.Router.extend({
        preinitialize() {this.origtitle = document.title},
        after(){
          const $body = document.getElementById('fei_teleworking_container');
          const title = document.querySelector('.dashboard__chart--title').innerText;

          document.title = `${title?`${title} -`:''} ${this.origtitle}`
          $body.setAttribute('tabindex', '-1')
          $body.focus();
          setTimeout(()=>{$body.removeAttribute('tabindex');}, 500)
        },
        routes: {
          "": () => {
            document.getElementById('master').removeAttribute('hidden')
            document.getElementById('detail').setAttribute('hidden','')
            document.querySelector('.dashboard__nav').removeAttribute('hidden')

            document.querySelector('.dashboard__chart--title').innerText = "";

            let $filterMenu =  document.querySelectorAll('.filter-menu');
            let filtered = {};
            $filterMenu.forEach($menu=>{
              let ref = $menu.dataset.ref;
              let $menuBtn = $menu.firstElementChild;
              let $menuOptions = $menu.querySelectorAll('[role=menuitem]');
              $menuOptions.forEach($btn=>{
                $btn.addEventListener('click',evt=>{
                  let $li = evt.target.closest('li')
                  $menuBtn.setAttribute('aria-active-decendent',$li.id);
                  var cat = evt.target.dataset[ref];
                  var cards = document.querySelectorAll(`#master [data-${ref}]`);
                      cards.forEach(card=>{ card.hidden = null; })

                  if(cat !== 'all'){
                    let cards = document.querySelectorAll(`#master [data-${ref}]`);
                    filtered[ref] = cat;
                    cards.forEach(card=>{ 
                      
                      if(card.hidden == false){
                        
                        if(card.dataset[ref] !== cat) {
                          card.hidden = true;
                        } else{
                          card.hidden = false;
                        }
                      }
                      
                      //card.hidden = card.getAttribute(`data-${ref}`) !== cat; 
                    })
                  } else {
                    let cards = document.querySelectorAll(`#master [data-${ref}]`);
                    filtered[ref] = null;
                    cards.forEach(card=>{
                      //card.hidden = null;
                    })
                  }


                  evt.preventDefault();      
                })
              });

            })
          },
          "detail": (s) => {
            document.getElementById('master').setAttribute('hidden','')
            document.getElementById('detail').removeAttribute('hidden') 
            document.querySelector('.dashboard__nav').setAttribute('hidden','')
          },
          "detail/:id": (id) => {
            let cached = localStorage.getItem('DashboardData');
            let panel = JSON.parse(cached).find(d=>d.id==id);
            let similarPanels = [];
            
            JSON.parse(cached).forEach(d=>{

              if(d && d.category.includes(panel.category[0])){
                similarPanels.push(d)
              }
            });

            console.log(panel)

            let $widget = document.getElementById('pothole-bar1');
            let $notes = document.querySelector('.dashboard__notes');
            let $title = document.querySelector('.dashboard__detail--title')
            let $chartTitle = document.querySelector('.dashboard__chart--title');
            let $description = document.querySelector('.dashboard__detail--description');
            let $mightBeInterestedIn = document.querySelector('.dashboard__content--navigation select');
            let $trendAnalyis = document.getElementById('js-trend-analysis');
            let $lastReported = document.getElementById('js-last-reported');
            let $cumulativeswitch = document.getElementById('js-cumulativeTotalSwitch');
            
            let data = {
              chartOptions: panel.options,
              chartData:{
                labels: panel.data.labels,
                datasets: panel.data.datasets
              }
            }
            

            /*
            if(panel.options.hasOwnProperty('scales') ){
              if(panel.options.scales.xAxes.filter(opts=>opts.stacked) || panel.options.scales.yAxes.filter(opts=>opts.stacked))
              $cumulativeswitch.classList.add('hide')
            } 
            */

            $title.innerText =  panel.category.toString();
            $widget.yAxisLabel = "Average Sessions";
            $widget.xAxisLabel = "Date";
            $widget.chartTitle = panel.label;
            $widget.data = data;

            $chartTitle.innerText = panel.label.replace(/\n|\r/gi,' ');
            $description.innerHTML = `${panel.description}`;
            $notes.innerHTML = panel.body;
            $lastReported.innerHTML = ''

            $mightBeInterestedIn.innerHTML = ''
            similarPanels.forEach(panel=>{
              $mightBeInterestedIn.innerHTML += `<option value="${panel.id}">${panel.label} ${panel.id == id?' - selected':''}</option>`
            });

            let $select = document.getElementById('js-select-panel')
            let $go = document.getElementById('js-jump-panel')
            $go.addEventListener('click',evt=>{
              evt.preventDefault();
              window.scrollTo(0,0)
              Backbone.history.navigate(`detail/${$select.value}`, { trigger: true });
              document.body.focus();
            })


            /*Trend Analysis Table
            console.log('$trendAnalyis',$trendAnalyis,panel.custom)
            const $thead = $trendAnalyis.querySelector('thead'); 
            const $tbody = $trendAnalyis.querySelector('tbody'); 
            const headings = []            

            $thead.innerHTML = '';
            $tbody.innerHTML = '';
           
            for(thText in panel.custom.trendAnalysis[0]){
              const $th = document.createElement('th')
                    $th.innerText = thText;
                    $thead.appendChild($th);
                headings.push(thText);
            }
            
           
            panel.custom.trendAnalysis.forEach(row=>{
              const $tr = document.createElement('tr')
              headings.forEach(heading=>{
                const analysis = row['Analysis'];
                const $td = document.createElement('td')
                if(heading != 'Analysis'){
                  $td.innerText = row[heading]
                } else {
                  let message;
                  let icon;
                  switch (analysis.direction.toLowerCase()){
                    case 'down': 
                      icon = 'glyphicon glyphicon-arrow-down';
                      message = 'Down'
                      break;

                    case 'up':
                      icon = 'glyphicon glyphicon-arrow-up'; 
                      message = 'Up'
                      break;
                    default: 
                      icon = 'glyphicon glyphicon-minus'; 
                      message = 'Stable'
                      break;
                  }

                  let colour;
                  let impact;
                  switch (analysis.isPositive){
                    case -1: 
                      colour = '--impact-negative'//'#88161f'; 
                      impact = 'Negative'
                      break;
                    case 1: 
                      colour = '--impact-positive'//'#208816'; 
                      impact = 'Positive'
                      break;
                    case 0: colour = '--impact'//'#374047'; 
                      break;
                  }
                  $td.classList.add('text-center');
                  $td.innerHTML = `<span class="${icon}" style="font-size: 0.75em; color: var(${colour})" aria-label="Direction: ${message} Direction: ${impact}"></span>`
                }
                $tr.appendChild($td)
              });
              $tbody.appendChild($tr)
            })
            */

            /* DataTable */
            const $datatable = {
              h2: document.querySelector('.dashboard__datatable table caption'),
              table: document.querySelector('.dashboard__datatable table'),
              thead: document.querySelector('.dashboard__datatable thead'),
              tbody: document.querySelector('.dashboard__datatable tbody'),
            }
            
            $datatable.h2.innerHTML = '';
            $datatable.thead.innerHTML = '';
            $datatable.tbody.innerHTML = '';

            $datatable.h2.innerText = `${panel.label}`;

            $datatable.thead.innerHTML = `<tr><th>User Session </th><th>Value</th></tr>`;
            
            panel.data.datasets.forEach(dataset=>{
              dataset.data.forEach(d=>{
                $datatable.tbody.innerHTML += `<tr><td>${moment(d.x).format('YYYY-MM-DD')}</td><td>${d.y||d}</td></tr>`;
              })
            })

                
            //$($datatable.table).DataTable();

            
          

          // calculateCumulativeData 


          const switchID = 'ytd_toggle'
          const $switchToggle = document.getElementById(switchID);
          const $switchToggleLabel = document.querySelector(`[for="${switchID}"]`)


          const $switch = $switchToggle.parentElement.parentElement
              $switch.setAttribute('tabindex','0');

          const handleToggle = (evt)=>{
            
            $switchToggle.checked = !$switchToggle.checked;


            const calculateCumulativeData = (_dataset,id)=>{
              var b = [];
              var sum = 0;
              _dataset.data.forEach((d,ndx)=>{
                sum += ndx==0?0:_dataset.data[ndx-1].y;
                b.push({x:d.x, y:sum});               
              });
          
              console.log('previous',panel,'added', _dataset)
              return [{
                stack:`ytd-${_dataset.label}`,
                label:`${_dataset.label} - Previous ${panel.config.unit}`,
                backgroundColor:'#ddd' ,
                data:b,
              },{
                stack:`ytd-${_dataset.label}`,
                label:`${_dataset.label} - Added this ${panel.config.unit}`,
                backgroundColor: _dataset.backgroundColor,
                data:_dataset.data
              }];
            }

            let datasetTemp = panel.data.datasets.map(dataset=>{
              return calculateCumulativeData(dataset)
            })
            
            if(panel.options.hasOwnProperty('scales')){
              if(panel.options.scales.xAxes.filter(opts=>opts.stacked) || panel.options.scales.yAxes.filter(opts=>opts.stacked)){
                datasetTemp = datasetTemp[0]
              } else {
                datasetTemp = datasetTemp.flat()
              }
            }



            console.log('calculateCumulativeData', datasetTemp, panel.data.datasets)
            $widget.data = {
              chartOptions: panel.options,
              chartData:{
                labels: panel.data.labels,
                datasets: $switchToggle.checked?datasetTemp:panel.data.datasets
              }
            }
            evt.preventDefault();
          }

          //$switchToggleLabel.addEventListener('click',handleToggle)
          $switchToggle.setAttribute('tabindex','0');
          $switch.addEventListener('keydown', evt=>{
            if(evt.keyCode == 13 || evt.keyCode == 32) handleToggle(evt);
          });
          $switch.addEventListener('click',handleToggle)



        




           document.querySelectorAll('[name=options]').forEach(radio=>{
             radio.parentElement.addEventListener('click',evt=>{
              var dash = new TeleworkingData()
              dash.getData(evt.target.innerText.toLowerCase()).then(res=>{
                let results = res.filter(res=>res.id == panel.id)[0];
                let data = {
                  chartData:{
                    labels: results.data.labels,
                    datasets: results.data.datasets
                  }
                }
                if(data) $widget.data = data;
              });
              
             });
           })

            

            document.getElementById('master').setAttribute('hidden','')
            document.getElementById('detail').removeAttribute('hidden')
            document.querySelector('.dashboard__nav').setAttribute('hidden','')
          }
        }
      }))();
      Backbone.history.start();
    }

    Model(){
      return{}
    }

    /*
    search(term){
      var options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'label',
          'keywords',
          'category'
        ]
      };

      this.fuse = new Fuse(this.data.panels, options); // "list" is the item array
      var results = this.fuse.search(term);

      console.log(results);
    }
    */
  }