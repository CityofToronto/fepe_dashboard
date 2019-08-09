
class Dashboard{
    constructor(){}
  
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
            data:{
               calculatedValue: 6007,
               labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
               datasets:[
                    { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339] },
                    { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660] },
                    { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007] }
               ]
            }
          }]
      }
    }
  }