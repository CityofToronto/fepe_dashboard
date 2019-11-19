
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
      let URI = 'https://www.toronto.ca/app_content/tpp_measures/'; //'/*@echo DATA_SRC*/';

      let narratives;
      const getNarratives = async ()=>{
        const narrativesJSON = await fetch(`https://www.toronto.ca/app_content/tpp_narratives/`);
        let text = await narrativesJSON.json();
        return text;
      }
      getNarratives().then(res=>narratives=res) 

      return fetch(URI).then(res=>{return res.json()}).then(({measures}=res)=>{
        console.debug('getHousingData',measures,narratives);
        let dataTemp = {}

        return measures.map(({m,kw,c, vs, v,ds,da,dd,id,ytd,vt,it}=measure,ndx)=>{
          let years = [];
          let data = [];
          
          let labels = [];
          let target = [];
          let datasets=[];    

          let res = {m,kw,c, vs, v,ds,da,dd,id,ytd,vt,it}

          
          vs.forEach(values=>{
            let date;
            if(it=='s') date = moment().set({'year': parseInt(values.y), 'month': parseInt(values.p)-1, 'date': 1});
            if(it=='m') date = moment().set({'year': parseInt(values.y), 'month': parseInt(values.p)-1, 'date': 1});
            if(it=='q') date = moment().set({'year': parseInt(values.y)}).quarter(values.p);
            if(it=='y') date = moment().set({'year': parseInt(values.y)});
            
            years.push(values.y);           
            data.push({
              x:date,
              y:values.v
            });
          });

          data.sort((a,b)=>a.x.valueOf() - b.x.valueOf());

          let ytdTotal = 0;
          let caption;
          let LastYear, ThisYear;
          let valueBegin,valueEnd;
          let isStable;

          switch(ytd){
            case 'True':
                ThisYear = data.filter(v=>v.x.format('YYYY') == moment().format('YYYY'))
                LastYear = data.filter(v=>v.x.format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length)

                valueBegin = LastYear[LastYear.length-1].y;
                valueEnd = ThisYear[ThisYear.length-1].y;

                ytdTotal = ThisYear.reduce((a,b)=>({y: a.y + b.y})).y
                caption = `${ThisYear[ThisYear.length-1].x.format('YYYY MMM')} Year-To-Date Result`
              break;
              
            case 'False':
              //ThisYear.forEach(val=>{ ytdTotal+= val.y });
              switch(it){
                case 'm':
                    ThisYear = data.filter(v=>v.x.format('YYYY') == moment().format('YYYY'));
                    LastYear = data.filter(v=>v.x.format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length);
                    
                    ytdTotal = ThisYear[ThisYear.length-1].y
                    valueBegin = LastYear[LastYear.length-1].y
                    valueEnd =  ThisYear[ThisYear.length-1].y                 
                    caption = `${ThisYear[ThisYear.length-1].x.format('YYYY MMM')} Result`
                    
                  break;
                case 'q':
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = data[data.length-1].y
                    valueBegin = LastYear.y
                    valueEnd = ThisYear.y
                    
                    caption = `${ThisYear.x.format('YYYY [Q]Q')}`
                  break;
                case 's':
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = data[data.length-1].y
                    valueBegin = LastYear.y
                    valueEnd = ThisYear.y
                    
                    let season;
                    for(var s in this.getDateRange('season')){
                      if(this.getDateRange('season')[s].includes( ThisYear.x.format('MMMM'))){
                        season = `${s[0].toUpperCase()}${s.slice(1)} `
                      }
                    }

                    caption = `${season} Result`
                  break;
                case 'y':
                    ytdTotal = data[data.length-1].y;
                    valueBegin = data[data.length-1].y
                    valueEnd = data[data.length-2].y

                    caption = `${data[data.length-1].x.format('YYYY')} Result`
                  break;
              }
              break;
          }

          isStable = Math.abs(valueBegin - valueEnd) <= Math.abs(valueEnd * (1+parseFloat(v)) - valueEnd);



          let sCHANGE = (valueBegin/valueEnd-1) * 100;
          sCHANGE = Math.abs(sCHANGE.toFixed(2)) + "%";
          sCHANGE = (m.vt=="p") ? ((valueBegin - valueEnd) * 100).toFixed(2) + "%" : sCHANGE;



          let indicators = {direction:'',isPositive:null};
          let getDirection = valueBegin < valueEnd;

          if (isStable) {
            sPOSNEG = 0;
            sDIRECTION = "none";
            sMESSAGE = 'Stable from'
          } else {
            if ( getDirection ) {
              sDIRECTION = "up";
              sMESSAGE = 'Increase of'
            } else {
              sDIRECTION = "down";
              sMESSAGE = 'Decrease of'
            }
        
            if ( getDirection && dd=="Up" ) {
              sPOSNEG = 1;
            } else if (!getDirection && dd=="Down") {
              sPOSNEG = -1;
            } else {
              sPOSNEG = -1;
            }
          }
          indicators.direction = sDIRECTION;
          indicators.isPositive = sPOSNEG;
          indicators.text = `${sMESSAGE} ${sCHANGE} from previous Year`
          

          let calculatedValue;
          switch(vt){
            case 'c':
              if (ytdTotal > 1000000) {
                ytdTotal = ytdTotal/1000000;
                calculatedValue = `$${(ytdTotal).toString().formatNumber(2)}M`;
              } else {
                calculatedValue = `$${(ytdTotal).toString().formatNumber(2)}`; 
              }
              break;
            case 'n':
              if (ytdTotal > 1000000) {
                ytdTotal = ytdTotal/1000000;
                calculatedValue = `${ytdTotal.toString().formatNumber(2)}M`; 
              } else {
                calculatedValue = `${(ytdTotal).toString().formatNumber()}`;
              }
              break;
            case 'p': calculatedValue = `${(ytdTotal*100).toFixed(1)}%`; break;
          }
          calculatedValue += ` <br /> <small>${caption}</small>`
          
          if(period == 'year'){
            labels = [...new Set(years)];
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})
            datasets.push({ label: m, data, sum:null , backgroundColor:'#E64A19'});

            return {
              id:`panel-${ndx}`,
              label: `${id} - ${m}`,
              caption: indicators.text,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: indicators,
              rawData: res,
              data:{
                 calculatedValue,
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
              caption: indicators.text,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: indicators,
              rawData: res,
              data:{
                 calculatedValue,
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
              caption: indicators.text,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: indicators,
              rawData: res,
              data:{
                 calculatedValue,
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
              label: `${id} - ${m}`,
              caption: indicators.text,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: indicators,
              rawData: measure,
              data:{
                 calculatedValue,
                 labels,
                 datasets
              }
            }
          }
          
        })
      })
    }
}