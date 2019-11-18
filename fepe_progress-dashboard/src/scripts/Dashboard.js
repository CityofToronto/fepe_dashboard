
class Dashboard{
    constructor(){
      this.fuse = '';
      this.data = new this.Model();
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
        sum += arr[ndx-1];
        b.push(sum);
      });
  
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
        routes: {
          "": () => {
            document.getElementById('master').classList.remove('hide')
            document.getElementById('detail').classList.add('hide')
            document.querySelector('.dashboard__nav').classList.remove('hide')

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



            /*
            var $themeFilterBtn = document.querySelector('#js-category-label');
            var $themeBtns = document.querySelectorAll('#theme-filter [data-category]')
                $themeBtns.forEach($btn=>{
                  $btn.addEventListener('click',evt=>{
                    let $li = evt.target.closest('li')
                    $themeFilterBtn.setAttribute('aria-active-decendent',$li.id);
                    var cat = evt.target.dataset.category;
                    var cards = document.querySelectorAll(`#master [data-category]`);
                        cards.forEach(card=>{ card.style.display = 'none';  })

                    if(cat !== 'all'){
                      var cards = document.querySelectorAll(`#master [data-category="${cat}"]`);
                      console.log(cat,cards)
                      cards.forEach(card=>{
                        card.style.display = null;
                      })
                    } else {
                      var cards = document.querySelectorAll(`#master [data-category]`);
                      cards.forEach(card=>{
                        card.style.display = null;
                      })
                    }
                    evt.preventDefault();      
                  })
                });

                var statusBtn = document.querySelectorAll('#status-filter [data-status]')
                statusBtn.forEach(btn=>{
                  btn.addEventListener('click',evt=>{
                    var cat = evt.target.dataset.status;
                    var cards = document.querySelectorAll(`#master [data-status]`);
                      cards.forEach(card=>{ card.style.display = 'none';  })


                    if(cat !== 'all'){
                      var cards = document.querySelectorAll(`#master [data-status="${cat}"]`);
                      console.log(cat,cards)
                      cards.forEach(card=>{
                        card.style.display = null;
                      })
                    } else {
                      var cards = document.querySelectorAll(`#master [data-status]`);
                      cards.forEach(card=>{
                        card.style.display = null;
                      })
                    }
                    evt.preventDefault();      
                  })
                });
              */
          },
          "detail": (s) => {
            document.getElementById('master').classList.add('hide')
            document.getElementById('detail').classList.remove('hide')    
            document.querySelector('.dashboard__nav').classList.add('hide')
          },
          "detail/:id": (id) => {
            let cached = localStorage.getItem('HousingDashboardData');
            let panel = JSON.parse(cached).find(d=>d.id==id);
            let similarPanels = [];
            
            JSON.parse(cached).forEach(d=>{
              if(d.category.includes(panel.category[0])){
                similarPanels.push(d)
              }
            });

            let $widget = document.getElementById('pothole-bar1');
            let $notes = document.querySelector('.dashboard__notes');
            let $title = document.querySelector('.dashboard__detail--title')
            let $chartTitle = document.querySelector('.dashboard__chart--title');
            let $description = document.querySelector('.dashboard__detail--description');
            let $mightBeInterestedIn = document.querySelector('.dashboard__content--navigation select');

            let data = {
              chartData:{
                labels: panel.data.labels,
                datasets: panel.data.datasets
              }
            }
            
            $title.innerText =  panel.category.toString();
            $widget.yAxisLabel = "Total Units";
            $widget.xAxisLabel = "Year";
            $widget.chartTitle = panel.label;
            $widget.data = data;

            $chartTitle.innerText = panel.label;
            $description.innerHTML = panel.description;
            $notes.innerHTML = panel.body;

            $mightBeInterestedIn.innerHTML = ''
            similarPanels.forEach(panel=>{
              $mightBeInterestedIn.innerHTML += `<option>${panel.label}</option>`
            });


           document.querySelectorAll('[name=options]').forEach(radio=>{
             radio.parentElement.addEventListener('click',evt=>{
              var dash = new HousingDashboard()
              dash.getHousingData(evt.target.innerText.toLowerCase()).then(res=>{
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

            

            document.getElementById('master').classList.add('hide')
            document.getElementById('detail').classList.remove('hide')
            document.querySelector('.dashboard__nav').classList.add('hide')
          }
        }
      }))();
      Backbone.history.start();
    }

    Model(){
      return{
        meta:{
          title:'',
          enableSearch: true,
          filters:{
            display: true,
            label:'Filter Indicators',
            options:[{
              label:'Select Category',
              options:[{
                label:''
              }]
            }]
          },
          cssGrid:{
            master:{
              'grid-template-columns': '40px 50px auto 50px 40px',
              'grid-template-rows': '25% 100px auto'
            },
            detail:{
              'grid-template-columns': '40px 50px auto 50px 40px',
              'grid-template-rows': '25% 100px auto'
            }
          },
          layout:[{
            panelID: 'panel--0000',
            class:'',
            icon:'png|gif|svg',
            widget:'card',
            widgetLink: 'master-detail', // http(s?)://
            cssGrid:{
              'grid-column-start': '2',
              'grid-column-end': 'five',
              'grid-row-start': 'row1-start',
              'grid-row-end': '3'
            }
          }],
          
        },
        panels:[{
            id:'panel-0000',
            label: 'Number of Personal Bankruptcies\n(Ontario)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0001',
            label: '# of active affordable rental developments',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0002',
            label: '# of affordable rental units in  pre-development',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: '# of affordable rental units under development',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'New Affordable Ownership Homes Completed',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'Average and Asking Prices and Rents (annual)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: '# of affordable rental units under construction',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'New Affordable Ownership Homes Approved',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'New Affordable Rental Homes Approved',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'New Affordable Rental Homes Completed',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'Misc Census variables (e.g., HH Spending 30% on Core Housing, Strucure Type etc)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: '# of jobs to be created from active rental projects',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'Total City funding for active projects (in $M)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'Total estimated City incentives for active projects (in $M)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: 'Total Provincial/Federal funding for active rental projects (in $M)',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          },{
            id:'panel-0003',
            label: '# New Refugees Entering Shelters',
            caption: 'Decrease of 3.9% from previous year',
            description:'2019 May Year-To-Date Result',
            body:'<h2>Notes Go Here</h2>',
            category:['Community Vulnerability'],
            keywords:['Bankruptcies','Debt'],
            options:{
              title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
              xAxis:'Month',
              yAxis:'Total Bankruptcies'
            },
            change: '-',
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
               ]
            }
          }]
      }
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