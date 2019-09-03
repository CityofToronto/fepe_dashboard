
class Dashboard{
    constructor(){
      this.fuse = '';
      this.data = new this.Model();
    }
  
    Model(){
      return{
        meta:{
          title:'',
          enableSearch: true,
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
          }]
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
  }