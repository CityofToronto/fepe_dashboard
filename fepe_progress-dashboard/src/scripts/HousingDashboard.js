
class HousingDashboard{
    constructor(){
      this.fuse = '';
      this.Model ={
        id:'panel-0001',
        label: '# of active affordable rental developments',
        caption: 'Decrease of 3.9% from previous year',
        description:'2019 May Year-To-Date Result',
        body:'<h2>Notes Go Here</h2>',
        category:['Community Vulnerability'],
        keywords:['Bankruptcies','Debt'],
        meta:{
          theme:[],
        },
        options:{
          title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
          xAxis:'Month',
          yAxis:'Total Bankruptcies'
        },
        direction: '-',
        data:{
           calculatedValue: 6007,
           labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
           datasets:[
                { label:'2017 YTD Actual', data:[1066,2233,3774,5129,6630,7993,9113,10325,11619,12945,14206,15339], sum:null },
                { label:'2018 YTD Actual', data:[992,2090,3458,4796,6218,7483,8705,9907,11073,12365,13577,14660], sum:null },
                { label:'2019 YTD Actual', data:[1004,2030,3264,4551,6007], sum:null }
           ]
        }
      }
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


    getHousingData(period='year'){
      let URI = '/*@echo DATA_SRC*/';
      
      return fetch(URI).then(res=>{return res.json()}).then(({measures}=res)=>{
        console.debug('getHousingData',measures);
        let dataTemp = {}

        return measures.map(({m,kw,c, vs, v,ds,dd}=measure,ndx)=>{
          let years = [];
          let data = [];
          let ytdTotal = 0;
          let labels = [];
          let target = [];
          let datasets=[];


          vs.forEach(values=>{
            let date = moment().set({'year': values.y, 'month': values.p-1});
            ytdTotal += values.v;
            years.push(values.y);           
            data.push({
              x:date,
              y:values.v
            });            
          });


          if(period == 'year'){
            labels = [...new Set(years)];
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})
            datasets.push({ label: m, data, sum:null , backgroundColor:'#E64A19'});

            return {
              id:`panel-${ndx}`,
              label: `${m}`,
              caption: ds,
              description:'2019 May Year-To-Date Result',
              body:`<h2>Notes:<small>${m}</small></h2>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: dd,
              data:{
                 calculatedValue: ytdTotal,
                 labels,
                 datasets
              }
            }
          }


          if(period == 'month'){
            labels = moment.months();
            [...new Set(years)].forEach((year,ndx)=>{
              datasets.push({
                label: year.toString(),
                data: data.filter(d=>parseInt(d.x.format('YYYY'))===year)
              })
            })
            
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})

            return {
              id:`panel-${ndx}`,
              label: `${m}`,
              caption: ds,
              description:'2019 May Year-To-Date Result',
              body:`<h2>Notes:<small>${m}</small></h2>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: dd,
              data:{
                 calculatedValue: ytdTotal,
                 labels,
                 datasets
              }
            }
          }


          if(period == 'quarter'){
            let quarterTemp = [...moment.months()];
            let getDateRange = {
                Q1: quarterTemp.slice(0,3),
                Q2: quarterTemp.slice(3,6),
                Q3: quarterTemp.slice(6,9),
                Q4: quarterTemp.slice(9,12)
            }
            labels = Object.keys(getDateRange);
            [...new Set(years)].forEach((year,ndx)=>{
              labels.forEach(quarter=>{
                datasets.push({
                  label: `${year.toString()} - ${quarter}`,
                  data: data.filter(d=>getDateRange[quarter].includes(d.x.format('MMMM')))
                })
              })
              
            })
            
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})

            return {
              id:`panel-${ndx}`,
              label: `${m}`,
              caption: ds,
              description:'2019 May Year-To-Date Result',
              body:`<h2>Notes:<small>${m}</small></h2>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: dd,
              data:{
                 calculatedValue: ytdTotal,
                 labels,
                 datasets
              }
            }
          }


          if(period == 'season'){
            let seasonTemp = [...moment.months()];
              seasonTemp.pop();
              seasonTemp.unshift('December');

            getDateRange={
              winter: seasonTemp.slice(0,3),
              spring: seasonTemp.slice(3,6),
              summer: seasonTemp.slice(6,9),
              fall: seasonTemp.slice(9,12)
            }

            labels = Object.keys(getDateRange);
            

            labels.forEach(season=>{ 
              [...new Set(years)].forEach((year,ndx)=>{
                
                datasets.push({
                  label: `${year.toString()} - ${season}`,
                  data: data.filter(d=>getDateRange[season].includes(d.x.format('MMMM')))
                })
              })
            })
            
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})

            return {
              id:`panel-${ndx}`,
              label: `${m}`,
              caption: ds,
              description:'2019 May Year-To-Date Result',
              body:`<h2>Notes:<small>${m}</small></h2>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: dd,
              data:{
                 calculatedValue: ytdTotal,
                 labels,
                 datasets
              }
            }
          }
          
        })
      })
    }
}