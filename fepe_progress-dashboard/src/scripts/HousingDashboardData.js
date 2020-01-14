
class HousingDashboardData{
    constructor(){
      this.fuse = '';
      this.chartColours = ['#E6DA19'];
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


    analysis(compVal1,compVal2,variance, isPercent = true, dd){

      console.log( compVal1,compVal2,variance, isPercent, dd )
      let sCHANGE = isPercent?(compVal1 - compVal2) * 100:(compVal1/compVal2-1) * 100;
          sCHANGE = Math.abs(sCHANGE.toFixed(2)) + "%";

      let sPOSNEG;
      if (Math.abs(compVal1 - compVal2) <= Math.abs(compVal2 * (1+parseFloat(variance)) - compVal2)) {
        sPOSNEG = 0;
        sDIRECTION = "none";
        sMESSAGE = 'Stable from'
      } else {

        if ( compVal1 > compVal2 ) {
          sDIRECTION = "up";
          sMESSAGE = 'Increase of'
        } else {
          sDIRECTION = "down";
          sMESSAGE = 'Decrease of'
        }

        if ( compVal1 > compVal2 && dd=="Up" ) {
          sPOSNEG = 1;
        } else if (compVal1 < compVal2 && dd=="Down") {
          sPOSNEG = 1;
        } else {
          sPOSNEG = -1;
        }
      }

      return {
        direction:sDIRECTION,
        isPositive:sPOSNEG,
        text:`${sMESSAGE} ${sCHANGE} from previous Year`
      }
    }

    
    getHousingData(period='year'){
      let URI = '/*@echo DATA_SRC*/';
      return fetch(URI).then(res=>{return res.json()}).then(res=>{

        
        res.map(results=>{
          results.data.datasets.forEach(dataset=>{
            let dataTemp = [];

            dataset.data.forEach(d=>{
              dataTemp.push({
                x: moment(d.x),
                y: d.y
              })
            })

            return dataset.data = dataTemp;
          })
        })
        

        console.log('getHousingData',res)
        return res;

      }).then(res=>{
        /*
         Set indicators & do anaylsis
        */
       return res.map((indicator,ndx)=>{
          let ytd = indicator.custom.yearToDate;
          let it = indicator.custom.indicatorType;
          let indicatorConfig = {};
          let ytdTotal, ytdTotalPrevious = 0;
          let mTotal, mTotalPrevious = 0;
          let subTitle;
          let LastYear, ThisYear;
          let valueBegin,valueEnd;
          let isStable;
          let timeRangeLabel,timeRangeFullLabel;
          let data = indicator.data;

          indicator.data.datasets.forEach(dataset=>{
            dataset.backgroundColor = this.chartColours[0];
          });
         
          switch(ytd){
            case 'True':
                ThisYear = data.filter(v=>v.x.format('YYYY') == moment().format('YYYY'))
                LastYear = data.filter(v=>v.x.format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length)

                valueBegin = LastYear[LastYear.length-1].y;
                valueEnd = ThisYear[ThisYear.length-1].y;

                ytdTotal = ThisYear.reduce((a,b)=>({y: a.y + b.y})).y;
                ytdTotalPrevious = LastYear.reduce((a,b)=>({y: a.y + b.y})).y;

                mTotal = ThisYear[ThisYear.length-1].y;
                mTotalPrevious = ThisYear[ThisYear.length-2].y;

                subTitle = `${ThisYear[ThisYear.length-1].x.format('YYYY MMM')} Year-To-Date`;
                timeRangeLabel = 'Year';
                timeRangeFullLabel = ThisYear[ThisYear.length-1].x.format('YYYY MMMM');


                indicator.custom['trendAnalysis'] = [{
                  'Trend': 'Current Year-to-Date vs. Previous Year',
                  'Current Value': `${timeRangeFullLabel} YTD: ${ytdTotal.toString().formatNumber()}`,
                  'Comparison Value': `Previous ${timeRangeLabel} : ${ytdTotalPrevious.toString().formatNumber()}`,
                  '% Changed':`${((ytdTotal/ytdTotalPrevious-1) * 100).toString().formatNumber(2)}%`,
                  'Analysis':this.analysis(ytdTotal,ytdTotalPrevious,indicator.custom.variance,indicator.custom.valueType=='percent',dd)
                },{
                  'Trend': 'Current Period vs. Last Year At This Time',
                  'Current Value': `${timeRangeFullLabel} : ${valueEnd.toString().formatNumber()}`,
                  'Comparison Value': `Previous ${timeRangeLabel} : ${valueBegin.toString().formatNumber()}`,
                  '% Changed':`${((valueEnd/valueBegin-1) * 100).toString().formatNumber(2)}%`,
                  'Analysis':this.analysis(valueEnd,valueBegin,indicator.custom.variance,indicator.custom.valueType=='percent',dd)
                },{
                  'Trend': 'Current Period vs. Last Period',
                  'Current Value': `${timeRangeFullLabel} : ${mTotal.toString().formatNumber()}`,
                  'Comparison Value': `Previous Month : ${mTotalPrevious.toString().formatNumber()} `,
                  '% Changed': `${((mTotal/mTotalPrevious-1) * 100).toString().formatNumber(2)}%`,
                  'Analysis':this.analysis(mTotal,mTotalPrevious,indicator.custom.variance,indicator.custom.valueType=='percent',indicator.custom.desiredDirection)
                }]
              break;
              
            case 'False':
              //ThisYear.forEach(val=>{ ytdTotal+= val.y });
              switch(it){
                case 'monthly':
                    //Compare previous Year
                    ThisYear = data.datasets[0].data.filter(v=>moment(v.x).format('YYYY') == moment().format('YYYY'));
                    //LastYear = data.datasets[0].data.filter(v=>moment(v.x).format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length);
                    LastYear = data.datasets[0].data.filter(v=>moment(v.x).format('YYYY') == moment().format('YYYY')).slice(0,ThisYear.length);
                    
                  if( ThisYear.length && LastYear.length){
                    
                    ytdTotal = ThisYear[ThisYear.length-1].y;
                    ytdTotalPrevious = LastYear[ThisYear.length-1].y;

                    valueBegin = LastYear[LastYear.length-1].y;
                    valueEnd =  ThisYear[ThisYear.length-1].y;                
                    subTitle = `${moment(ThisYear[ThisYear.length-1].x).format('YYYY MMM')}`;
                    
                    timeRangeLabel = 'Month';
                    timeRangeFullLabel = moment(ThisYear[ThisYear.length-1].x).format('YYYY MMMM');
                  }

                  indicator.config = { 
                    unit: 'month',
                    format: 'MMM YYYY'
                  };
                  indicator.data.labels = indicator.data.labels.map(label=>{
                    return parseInt(moment().month(label).format('X'));
                  })

                  break;
                case 'quarter':
                    //Compare previous Quarter
                    // ThisYear = data[data.length-1]; 
                    // LastYear = data[data.length-2];

                    // ytdTotal = ThisYear.y
                    // ytdTotalPrevious = LastYear.y

                    // valueBegin = LastYear.y
                    // valueEnd = ThisYear.y
                    
                    // subTitle = `${ThisYear.x.format('YYYY [Q]Q')}`
                    // timeRangeLabel = 'Quarter';
                    // timeRangeFullLabel = ThisYear.x.format('YYYY [Q]Q');

                    indicator.config = { 
                      unit: 'quarter',
                      format: '[Q]Q - YYYY'
                    };
                    indicator.data.labels = indicator.data.labels.map(label=>{
                      return parseInt( moment().quarter( parseInt(label.replace(/(Quarter\s)/gi, '')) ).format('x') );
                    })
                  break;
                // case 'seasonaly':
                //     //Compare previous Season
                //     ThisYear = data[data.length-1];
                //     LastYear = data[data.length-2];

                //     ytdTotal = ThisYear.y
                //     ytdTotalPrevious = LastYear.y

                //     valueBegin = LastYear.y
                //     valueEnd = ThisYear.y
                    
                //     let seasonly;
                //     for(var s in this.getDateRange('season')){
                //       if(this.getDateRange('season')[s].includes( ThisYear.x.format('MMMM'))){
                //         seasonly = `${s[0].toUpperCase()}${s.slice(1)} `
                //       }
                //     }

                //     subTitle = `${seasonly}`
                //     timeRangeLabel = 'Season';
                //     timeRangeFullLabel = seasonly;
                //   break;
                // case 'semi-annually':
                //     //Compare previous Season
                //     ThisYear = data[data.length-1];
                //     LastYear = data[data.length-2];

                //     ytdTotal = ThisYear.y
                //     ytdTotalPrevious = LastYear.y

                //     valueBegin = LastYear.y
                //     valueEnd = ThisYear.y
                    
                //     let season;
                //     for(var s in this.getDateRange('semi-annually')){
                //       if(this.getDateRange('semi-annually')[s].includes( ThisYear.x.format('MMMM'))){
                //         season = `${s[0].toUpperCase()}${s.slice(1)} `
                //       }
                //     }

                //     subTitle = `${season}`
                //     timeRangeLabel = 'Season';
                //     timeRangeFullLabel = season;
                //   break;
                case 'annual':
                    //Compare previous Year
                    // ThisYear = data[data.length-1];
                    // LastYear = data[data.length-2];

                    // ytdTotal = ThisYear.y;
                    // ytdTotalPrevious = LastYear.y

                    // valueBegin = ThisYear.y
                    // valueEnd = LastYear.y

                    // subTitle = `${ThisYear.x.format('YYYY')}`
                    // timeRangeLabel = 'Year';
                    // timeRangeFullLabel = ThisYear.x.format('YYYY');

                    indicator.config = { 
                      unit: 'year',
                      format: 'YYYY'
                    };
                    indicator.data.labels = indicator.data.labels.map(label=>{
                      return parseInt( moment().year( label ).format('x'));
                    })
                  break;
                case 'daily':
                    //Compare previous Year
                    // ThisYear = data[data.length-1];
                    // LastYear = data[data.length-2];

                    // ytdTotal = ThisYear.y;
                    // ytdTotalPrevious = LastYear.y

                    // valueBegin = ThisYear.y
                    // valueEnd = LastYear.y

                    // subTitle = `${ThisYear.x.format('YYYY')}`
                    // timeRangeLabel = 'Year';
                    // timeRangeFullLabel = ThisYear.x.format('YYYY');

                    indicator.config = { 
                      unit: 'day',
                      format: 'MM-DD'
                    };
                    indicator.data.labels = indicator.data.labels.map(label=>{
                      return parseInt( moment().day( label ).format('x') );
                    })
                  break;
                // case 'weekly':
                //     //Compare previous Year
                //     ThisYear = data[data.length-1];
                //     LastYear = data[data.length-2];

                //     ytdTotal = ThisYear.y;
                //     ytdTotalPrevious = LastYear.y

                //     valueBegin = ThisYear.y
                //     valueEnd = LastYear.y

                //     subTitle = `${ThisYear.x.format('YYYY')}`
                //     timeRangeLabel = 'Year';
                //     timeRangeFullLabel = ThisYear.x.format('YYYY');
                //   break;

                indicator.config = { 
                  unit: 'week',
                  format: 'DD'
                };
                indicator.data.labels = indicator.data.labels.map(label=>{
                  return parseInt( moment().day( label ).format('x') );
                })
              }

              let calculatedValue;
              
              if(!ytdTotal){
                ytdTotal = 0;
              }
              switch(indicator.custom.valueType){
                case 'count':
                  if (ytdTotal > 1000000) {
                    ytdTotal = ytdTotal/1000000;
                    calculatedValue = `$${(ytdTotal).toString().formatNumber(2)} M`;
                  } else {
                    calculatedValue = `$${(ytdTotal).toString().formatNumber(2)}`; 
                  }
                  break;
                case 'number':
                  if (ytdTotal > 1000000) {
                    ytdTotal = ytdTotal/1000000;
                    calculatedValue = `${ytdTotal.toString().formatNumber(2)} M`; 
                  } else {
                    calculatedValue = `${(ytdTotal).toString().formatNumber()}`;
                  }
                  break;
                case 'percent': calculatedValue = `${(ytdTotal*100).toFixed(2)}%`; break;
              }
              indicator.custom['calculatedValue'] = calculatedValue
              console.log('ytdTotal',calculatedValue )

              
              let change = `${((valueEnd/valueBegin-1) * 100).toString().formatNumber(3)}%`;
              indicator.custom['trendAnalysis'] = [{
                'Trend': 'Current Period vs. Last Year At This Time',
                'Current Value': `${subTitle} : ${ytdTotal}`,
                'Comparison Value': `Previous Year : ${ytdTotalPrevious} `,
                '% Changed':change,
                'Analysis':this.analysis(ytdTotal,ytdTotalPrevious,indicator.custom.variance,indicator.custom.valueType==='percent',indicator.custom.desiredDirection)
              },{
                'Trend': 'Current Period vs. Last Period',
                'Current Value': `${subTitle} : ${ytdTotal}`,
                'Comparison Value': `Previous Month : ${mTotal} `,
                '% Changed':change,
                'Analysis':this.analysis(mTotal,mTotalPrevious,indicator.custom.variance,indicator.custom.valueType==='percent',indicator.custom.desiredDirection)
              }]

              break;
          }

          //delete indicator.data.labels
          indicator.options['scales'] = {
            xAxes : [{
                type: 'time', 
                distribution: 'series',
                time:{
                  unit: indicator.config.unit,
                  tooltipFormat: indicator.config.format
                }
              }] 
            }
          console.log('Indicator',it, indicator.config )
          
          return indicator;
       })
          
      })
    }

    progressPortal__getHousingData(period='year'){
      let URI = 'https://www.toronto.ca/app_content/tpp_measures/'; //'/*@echo DATA_SRC*/';
      let narratives
      
      


      let analysis = this.analysis;
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        const getNarratives = async ()=>{
          const narrativesJSON = await fetch(`https://www.toronto.ca/app_content/tpp_narratives/`);
          const text = await narrativesJSON.json();
          narratives = text
          return text;
        };
        res['narratives'] = getNarratives().then(res=>{ console.log(res)});
        console.log('A', narratives)

        return res;
      }).then(({measures, narratives}=res)=>{
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

          let ytdTotal, ytdTotalPrevious = 0;
          let mTotal, mTotalPrevious = 0;
          let subTitle;
          let LastYear, ThisYear;
          let valueBegin,valueEnd;
          let isStable;
          let timeRangeLabel,timeRangeFullLabel;

          switch(ytd){
            case 'True':
                ThisYear = data.filter(v=>v.x.format('YYYY') == moment().format('YYYY'))
                LastYear = data.filter(v=>v.x.format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length)

                valueBegin = LastYear[LastYear.length-1].y;
                valueEnd = ThisYear[ThisYear.length-1].y;

                ytdTotal = ThisYear.reduce((a,b)=>({y: a.y + b.y})).y;
                ytdTotalPrevious = LastYear.reduce((a,b)=>({y: a.y + b.y})).y;

                mTotal = ThisYear[ThisYear.length-1].y;
                mTotalPrevious = ThisYear[ThisYear.length-2].y;

                subTitle = `${ThisYear[ThisYear.length-1].x.format('YYYY MMM')} Year-To-Date`;
                timeRangeLabel = 'Year';
                timeRangeFullLabel = ThisYear[ThisYear.length-1].x.format('YYYY MMMM');
              break;
              
            case 'False':
              //ThisYear.forEach(val=>{ ytdTotal+= val.y });
              switch(it){
                case 'm':
                    ThisYear = data.filter(v=>v.x.format('YYYY') == moment().format('YYYY'));
                    LastYear = data.filter(v=>v.x.format('YYYY') == moment().subtract(1,'year').format('YYYY')).slice(0,ThisYear.length);
                    
                    ytdTotal = ThisYear[ThisYear.length-1].y
                    ytdTotalPrevious = LastYear[ThisYear.length-1].y

                    valueBegin = LastYear[LastYear.length-1].y
                    valueEnd =  ThisYear[ThisYear.length-1].y                 
                    subTitle = `${ThisYear[ThisYear.length-1].x.format('YYYY MMM')}`
                    
                    timeRangeLabel = 'Month';
                    timeRangeFullLabel = ThisYear[ThisYear.length-1].x.format('YYYY MMMM');
                  break;
                case 'q':
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = ThisYear.y
                    ytdTotalPrevious = LastYear.y

                    valueBegin = LastYear.y
                    valueEnd = ThisYear.y
                    
                    subTitle = `${ThisYear.x.format('YYYY [Q]Q')}`
                    timeRangeLabel = 'Quarter';
                    timeRangeFullLabel = ThisYear.x.format('YYYY [Q]Q');
                  break;
                case 's':
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = ThisYear.y
                    ytdTotalPrevious = LastYear.y

                    valueBegin = LastYear.y
                    valueEnd = ThisYear.y
                    
                    let season;
                    for(var s in this.getDateRange('season')){
                      if(this.getDateRange('season')[s].includes( ThisYear.x.format('MMMM'))){
                        season = `${s[0].toUpperCase()}${s.slice(1)} `
                      }
                    }

                    subTitle = `${season}`
                    timeRangeLabel = 'Season';
                    timeRangeFullLabel = season;
                  break;
                case 'y':
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = ThisYear.y;
                    ytdTotalPrevious = LastYear.y

                    valueBegin = ThisYear.y
                    valueEnd = LastYear.y

                    subTitle = `${ThisYear.x.format('YYYY')}`
                    timeRangeLabel = 'Year';
                    timeRangeFullLabel = ThisYear.x.format('YYYY');
                  break;
              }
              break;
          }
             

          let calculatedValue;
          switch(vt){
            case 'c':
              if (ytdTotal > 1000000) {
                ytdTotal = ytdTotal/1000000;
                calculatedValue = `$${(ytdTotal).toString().formatNumber(2)} M`;
              } else {
                calculatedValue = `$${(ytdTotal).toString().formatNumber(2)}`; 
              }
              break;
            case 'n':
              if (ytdTotal > 1000000) {
                ytdTotal = ytdTotal/1000000;
                calculatedValue = `${ytdTotal.toString().formatNumber(2)} M`; 
              } else {
                calculatedValue = `${(ytdTotal).toString().formatNumber()}`;
              }
              break;
            case 'p': calculatedValue = `${(ytdTotal*100).toFixed(2)}%`; break;
          }


          let trendAnalysis;
          if(ytd=='True'){
            trendAnalysis = [{
              'Trend': 'Current Year-to-Date vs. Previous Year',
              'Current Value': `${timeRangeFullLabel} YTD: ${ytdTotal.toString().formatNumber()}`,
              'Comparison Value': `Previous ${timeRangeLabel} : ${ytdTotalPrevious.toString().formatNumber()}`,
              '% Changed':`${((ytdTotal/ytdTotalPrevious-1) * 100).toString().formatNumber(2)}%`,
              'Analysis':analysis(ytdTotal,ytdTotalPrevious,v,vt=='p',dd)
            },{
              'Trend': 'Current Period vs. Last Year At This Time',
              'Current Value': `${timeRangeFullLabel} : ${valueEnd.toString().formatNumber()}`,
              'Comparison Value': `Previous ${timeRangeLabel} : ${valueBegin.toString().formatNumber()}`,
              '% Changed':`${((valueEnd/valueBegin-1) * 100).toString().formatNumber(2)}%`,
              'Analysis':analysis(valueEnd,valueBegin,v,vt=='p',dd)
            },{
              'Trend': 'Current Period vs. Last Period',
              'Current Value': `${timeRangeFullLabel} : ${mTotal.toString().formatNumber()}`,
              'Comparison Value': `Previous Month : ${mTotalPrevious.toString().formatNumber()} `,
              '% Changed': `${((mTotal/mTotalPrevious-1) * 100).toString().formatNumber(2)}%`,
              'Analysis':analysis(mTotal,mTotalPrevious,v,vt=='p',dd)
            }]
          }


          /*TODO: FIX PREVIOUS MONTH*/

          if(ytd=='False'){
            let change = `${((valueEnd/valueBegin-1) * 100).toString().formatNumber(3)}%`;
            trendAnalysis = [{
              'Trend': 'Current Period vs. Last Year At This Time',
              'Current Value': `${subTitle} : ${ytdTotal}`,
              'Comparison Value': `Previous Year : ${ytdTotalPrevious} `,
              '% Changed':change,
              'Analysis':analysis(ytdTotal,ytdTotalPrevious,v,vt=='p',dd)
            },{
              'Trend': 'Current Period vs. Last Period',
              'Current Value': `${subTitle} : ${ytdTotal}`,
              'Comparison Value': `Previous Month : ${mTotal} `,
              '% Changed':change,
              'Analysis':analysis(mTotal,mTotalPrevious,v,vt=='p',dd)
            }]
          }

          
          let caption = trendAnalysis[0].Analysis.direction=='none'?'':trendAnalysis[0].Analysis.text;
          res['trendAnalysis'] = trendAnalysis;

          if(period == 'year'){
            labels = [...new Set(years)];
            target = Array(labels.length).fill(data[0].y*0.3+data[0].y,0,labels.length+1);
            datasets.push({ label: 'Target', data:target, type:'line', borderColor:'#E6DA19', sum:null , backgroundColor:'#E6DA19'})
            datasets.push({ label: m, data, sum:null , backgroundColor:'#E64A19'});

            return {
              id:`panel-${ndx}`,
              label: `${id} - ${m}`,
              caption,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: trendAnalysis[0].Analysis,
              rawData: res,
              data:{
                 calculatedValue: `${calculatedValue} <br /> <small>${subTitle} Result</small>`,
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
              caption,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: trendAnalysis[0].Analysis,
              rawData: res,
              data:{
                 calculatedValue: `${calculatedValue} <br /> <small>${subTitle} Result</small>`,
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
              caption,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: trendAnalysis[0].Analysis,
              rawData: res,
              data:{
                 calculatedValue: `${calculatedValue} <br /> <small>${subTitle} Result</small>`,
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
              caption,
              description: ds,
              body:`<h2>Notes:</h2><p>${narratives[id]}</p>`,
              category: c,
              keywords: kw.split(','),
              options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Month',
                yAxis:'Total Bankruptcies'
              },
              direction: trendAnalysis[0].Analysis,
              rawData: measure,
              data:{
                 calculatedValue: `${calculatedValue} <br /> <small>${subTitle} Result</small>`,
                 labels,
                 datasets
              }
            }
          }
          
        })
      })
    }
}