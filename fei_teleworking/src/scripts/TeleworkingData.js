class TeleworkingData{
    constructor(){
      this.fuse = '';
      this.chartColours = ['#161f88'];
      this.Model = {}
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


    analysis(compVal1=0,compVal2=0,variance, isPercent = true, dd, unit){

      console.log( 'ytdTotal:analysis',Math.abs(compVal1-compVal2), Math.abs((compVal1 * 1.10) - compVal2),variance, isPercent, dd )
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

        if ( compVal1 > compVal2 && dd.toLowerCase()=="up" ) {
          sPOSNEG = 1;
        } else if (compVal1 < compVal2 && dd.toLowerCase()=="down") {
          sPOSNEG = 1;
        } else {
          sPOSNEG = -1;
        }
      }
      
      return {
        direction:sDIRECTION,
        isPositive:sPOSNEG,
        text:`${sMESSAGE} ${sCHANGE} from previous ${unit}`
      }
    }

    getXLSL({path, worksheet, type, title, colours, showLines, columns, axisLabels, filterby, featurelayer, confidenceInterval}={}){
      
      var url = path;
      var results = {}


      return new Promise(function(resolve, reject){

        /* set up async GET request */
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";

        req.onload = function(e) {
          var data = new Uint8Array(req.response);

          var workbook = XLSX.read(data, {type:"array",cellStyles:false});
          var json = XLSX.utils.sheet_to_json(workbook.Sheets[worksheet])
          var html = XLSX.utils.sheet_to_html(workbook.Sheets[worksheet])        

          var data = [];
          var labels = [];
          var dataLabels = []
          var dataSets = [];
          var dataNotes = []
          var errors = []
          var dataErrors = {}
          var filterLabels = []

          columns.forEach((column,column_index)=>{
            data[column_index] = [];
            dataLabels[column_index] = [];
            dataErrors[column_index] = {}
            dataNotes[column_index] = []
            labels.push(column)
          })

          json.forEach((row,ndx)=>{
            const lbl = Object.values( row )[0].trim()
            const dataColumn = workbook.Sheets[worksheet].B1.v.trim()

            dataLabels[ndx] = lbl;
            filterLabels[lbl] = row[dataColumn.replace(/$\*/g,'')]

            columns.forEach((column,_index)=>{
              dataErrors[_index][lbl] ={
                plus: parseFloat(row[`${column}[ErrorHigh]`]||row[`${column}[Errorhigh]`]),
                minus : parseFloat(row[`${column}[ErrorLow]`]||row[`${column}[Errorlow]`])
              }
              dataNotes[_index].push(row[`${column}[Tooltip]`]||row[`${column}[ToolTip]`]||'');
              data[_index].push( parseFloat(row[column]) )
              dataSets[_index] = []
            })
          })

/*
          var totalRows = json[json.length-1].__rowNum__
          for(var ndx = 0; ndx <= totalRows; ndx++){
            const row = json[ndx-1]|| '';
            const lbl = Object.values( row )[0]
            const dataColumn = workbook.Sheets[worksheet].B1.v.trim()

            dataLabels[ndx] = lbl;
            filterLabels[lbl] = row[dataColumn.replace(/$\/g,'')]

            columns.forEach((column,_index)=>{
              dataErrors[_index][lbl] ={
                plus: parseFloat(row[`${column}[ErrorHigh]`]),
                minus : parseFloat(row[`${column}[ErrorLow]`])
              }
              dataNotes[_index].push(row[`${column}[Tooltip]`]||'');
              data[_index].push( parseFloat(row[column]) )
              dataSets[_index] = []
            })
          }
 */



          const pointStyles = ['circle','triangle','star','cross','rectRounded','line','dash','crossRot','rect','rectRot']
          const borderDash = [ [0,0],[8,8],[8,1,8] ]
        
          labels.forEach((_label,ndx)=>{
            const hoverColours = colours.map((cur,ndx)=>{ 
              return `rgb(${Color(cur).values.rgb.map(c=>{return c}).join(',')})`
            })

            const defaultColours = colours.map((cur,ndx)=>{ 
              return `rgb(${Color(cur).lighten(0.3).desaturate(0.1).values.rgb.map(c=>{return c}).join(',')})`
            })
          

            backgroundColors = function(){
              if( type.match(/(bar)/gi)){
                if(labels.length == 1 && defaultColours.length > 1){
                  return defaultColours
                }
                
                return defaultColours[ndx]
              } else {
                return (defaultColours.length>1)?defaultColours:defaultColours[ndx]
              }
            }
            hoverBackgroundColors = function(){
              if( type.match(/(bar)/gi)){
                if(labels.length == 1 && hoverColours.length > 1){
                  return hoverColours
                }
                
                return hoverColours[ndx]
              } else {
                return (hoverColours.length>1)?hoverColours:hoverColours[ndx]
              }
            }

            dataSets[ndx] = {
              label: _label,
              data: data[ndx],
              xAxesID: (type==="horizontalBar")?axisLabels[1]:axisLabels[0],
              yAxesID: (type==="horizontalBar")?axisLabels[0]:axisLabels[1],
              errorBars: dataErrors[ndx],
              dataNotes: dataNotes[ndx],

              borderDash: borderDash[ndx],
              borderWidth: (type.toLowerCase().indexOf("bar") != -1)?0:1,
              //borderColor: (type!=="line")?defaultColour[ndx]:hoverColour[ndx],
              //backgroundColor: (type!=="line")?defaultColour[ndx]:hoverColour[ndx],
              backgroundColor: backgroundColors(),
              hoverBackgroundColor: hoverBackgroundColors(),

              pointStyle: pointStyles[ndx],
              pointBorderColor: colours[ndx],
              pointBorderWidth: 0,
              pointRadius:5,
              pointBackgroundColor: defaultColours[ndx],
              pointHoverBackgroundColor: hoverColours[ndx],

              showLines: showLines,
              lineTension: 0,
              fill: false
            }           

          })

          //@if DEBUG
            console.log(`<${type}>`)
            console.log('JSON', json)
            console.log('Labels', labels)
            console.log('Data Labels', dataLabels)
            console.log('Data', data)
            console.log('DataSets', dataSets)
            console.log('DataErrors', errors)
            console.log('Data Notes', dataNotes)
            console.log('Feature Layer Path', featurelayer)
            console.log(`</${type}>`)
            console.log(``)
          //@endif

          results = {
            featureLayer: featurelayer,
            filterID:  filterby === ''?workbook.Sheets[worksheet].A1.v.trim():filterby,
            filterLabels:  filterLabels,
            filterLabel: workbook.Sheets[worksheet].B1.v.trim().replace(/\*$/g,''),
            dataErrors: errors,
            labels: dataLabels,
            datasets: dataSets
          }

          resolve(results)
        }
        req.send();
    })
  
  }
  
    getData(period='year'){
      let URI = '/*@echo DATA_SRC*/';
      
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        console.log('getData',res)

        /*
        this.getXLSL({
          path:'/data/mydata.xlsx',
          worksheet:'Sheet1',
          columns:['Sample A'],
          colours:['#333'],
          axisLabels:['A','B'],
          type:'bar'
        }).then(res=>{
          console.log('getXLSL:results',res)
        })
        */




        res.map(results=>{
          console.log(results.datasource)

          // if(results.hasOwnProperty('datasource')){
          //   this.getXLSL({
          //     path:'/data/mydata.xlsx',
          //     worksheet:'Sheet1',
          //     columns:['Sample A'],
          //     colours:['#333'],
          //     axisLabels:['A','B'],
          //     type:'bar'
          //   }).then(res=>{
          //     results.data = res;
          //   })
          // }

          if(!results.hasOwnProperty('datasource') && results.data.hasOwnProperty('dataset'))
          results.data.datasets.forEach(dataset=>{
            let dataTemp = [];

            if(dataset.data[0].hasOwnProperty('x')){
              dataset.data.forEach(d=>{
                dataTemp.push({
                  x: moment(d.x),
                  y: d.y
                })
              })
              return dataset.data = dataTemp;
            } else {
              return dataset.data
            }
          })
        })
        

        console.log('getHousingData',res)
        return res;

      }).then(res=>{
        /*
         Set indicators & do anaylsis
        */
      

       return res.map((indicator,ndx)=>{

          // Check to see if the indicator has a drilldown chart
          if(!indicator.data.hasOwnProperty('datasets')) return indicator;

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

          // Generate Chart Labels With Time Based Data
          indicator.data.labels = [...new Set(indicator.data.datasets.map(dataset=>dataset.data).flat().map(data=>{
            if(data.hasOwnProperty('x')) return data.x
            return data
          }))] 

          // Apply chart background
          indicator.data.datasets.forEach((dataset,ndx)=>{
            if(!dataset.hasOwnProperty('backgroundColor'))
              dataset.backgroundColor = this.chartColours[0];
          });
          


          /* Unknown USECASE */
          if(indicator.id === 4.71) return
          if(indicator.id === 4.7) return
          if(indicator.id === 4.8) return

          switch(ytd.toLowerCase()){
            case 'true':

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
                  'Analysis':this.analysis(ytdTotal,ytdTotalPrevious,indicator.custom.variance,indicator.custom.valueType=='percent',dd,indicator.custom.indicatorType)
                },{
                  'Trend': 'Current Period vs. Last Year At This Time',
                  'Current Value': `${timeRangeFullLabel} : ${valueEnd.toString().formatNumber()}`,
                  'Comparison Value': `Previous ${timeRangeLabel} : ${valueBegin.toString().formatNumber()}`,
                  '% Changed':`${((valueEnd/valueBegin-1) * 100).toString().formatNumber(2)}%`,
                  'Analysis':this.analysis(valueEnd,valueBegin,indicator.custom.variance,indicator.custom.valueType=='percent',dd,indicator.custom.indicatorType)
                },{
                  'Trend': 'Current Period vs. Last Period',
                  'Current Value': `${timeRangeFullLabel} : ${mTotal.toString().formatNumber()}`,
                  'Comparison Value': `Previous Month : ${mTotalPrevious.toString().formatNumber()} `,
                  '% Changed': `${((mTotal/mTotalPrevious-1) * 100).toString().formatNumber(2)}%`,
                  'Analysis':this.analysis(mTotal,mTotalPrevious,indicator.custom.variance,indicator.custom.valueType=='percent',indicator.custom.desiredDirection,indicator.custom.indicatorType)
                }]
              break;
              
            case 'false':
              //ThisYear.forEach(val=>{ ytdTotal+= val.y });
              ytdTotal = indicator.data.datasets.map(dataset=>dataset.datasetType=='Actual'?dataset.data:[]).flat().map(data=>{
                console.log('ytd',data)
                if(data.hasOwnProperty('y')) return data.y
                return data
              }).reduce((p,v,ndx,arr)=>{
                return p+v
              })
              console.log('ytdTotal',indicator.id,ytdTotal)


              if(it != null)
              switch(it.toLowerCase()){
                default:
                  indicator.options['scales']={
                    xAxes: [{
                      type: it.toLowerCase(),
                      //labels: ['January', 'February', 'March', 'April', 'May', 'June']
                    }]
                  }
                  break;
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
                    let tempLabel = moment().month(label).format('X')
                      if( tempLabel === "Invalid date") return label;
                      return parseInt( tempLabel );

                  })

                  break;
                case 'quarterly':
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
                      let tempLabel = moment().quarter( parseInt(label.replace(/(Quarter\s)/gi, '')) ).format('x');
                      if( tempLabel  === "Invalid date") return label;
                      return  parseInt(tempLabel);


                      //return parseInt( moment().quarter( parseInt(label.replace(/(Quarter\s)/gi, '')) ).format('x') );
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
                      let tempLabel = moment().year(label).format('x')
                      if( tempLabel === "Invalid date") return label;
                      return parseInt( tempLabel );
                    })
                  break;
                case 'daily':
                    //Compare previous Year
                    
                    ytdTotal = data.datasets.map(dataset=>{
                      let dataLength = dataset.data.length;
                      return dataset.datasetType=='Actual'?dataset.data[dataLength-1].y:0
                    }).reduce((p,v)=>p+v);

                    ytdTotalPrevious = data.datasets.map(dataset=>{
                      let dataLength = dataset.data.length;
                      return dataset.datasetType=='Actual'?dataset.data[dataLength-2].y:0
                    }).reduce((p,v)=>p+v);
                    console.log('ytdTotal:Daily Totals',ytdTotal,ytdTotalPrevious);

                    valueBegin = ytdTotalPrevious;
                    valueEnd = ytdTotal;

                    console.log('ytdTotal:BeginEnd',valueBegin,valueEnd)
                    /*
                    ThisYear = data[data.length-1];
                    LastYear = data[data.length-2];

                    ytdTotal = ThisYear.y;
                    ytdTotalPrevious = LastYear.y

                    valueBegin = ThisYear.y
                    valueEnd = LastYear.y

                    subTitle = `${ThisYear.x.format('YYYY')}`
                    timeRangeLabel = 'Year';
                    timeRangeFullLabel = ThisYear.x.format('YYYY');
                    */
                    indicator.config = { 
                      unit: 'day',
                      format: 'MM-DD'
                    };
                    indicator.data.labels = indicator.data.labels.map(label=>{
                      let tempLabel = moment().day(label).format('x')
                      if( tempLabel === "Invalid date") return label;
                      return parseInt( tempLabel );
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
                  let tempLabel = moment().week( parseInt(label.replace(/(Week\s)/gi, '')) ).format('x');
                  if(tempLabel === "Invalid date") return label;
                  return parseInt(tempLabel);
                })
              }

              let calculatedValue;
              
              if(!ytdTotal){
                ytdTotal = '0';
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
                case 'currency':
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

              if(!indicator.data.hasOwnProperty('calculatedValue')){
                if(calculatedValue) indicator.data['calculatedValue'] = calculatedValue;
              }
              
              let change = `${((valueEnd/valueBegin-1) * 100).toString().formatNumber(3)}%`;
              indicator.custom['trendAnalysis'] = [{
                'Trend': 'Current Period vs. Last Year At This Time',
                'Current Value': `${subTitle} : ${ytdTotal}`,
                'Comparison Value': `Previous Year : ${ytdTotalPrevious} `,
                '% Changed':change,
                'Analysis':this.analysis(ytdTotal,ytdTotalPrevious,indicator.custom.variance,indicator.custom.valueType==='percent',indicator.custom.desiredDirection,indicator.config.unit)
              },{
                'Trend': 'Current Period vs. Last Period',
                'Current Value': `${subTitle} : ${ytdTotal}`,
                'Comparison Value': `Previous Month : ${mTotal} `,
                '% Changed':change,
                'Analysis':this.analysis(mTotal,mTotalPrevious,indicator.custom.variance,indicator.custom.valueType==='percent',indicator.custom.desiredDirection,indicator.config.unit)
              }]

              break;
          }

          //delete indicator.data.labels
          if(it)
            indicator.options['scales'] = {
              xAxes : [{
                  offset: true,
                  type: 'time', 
                  distribution: 'series',
                  time:{
                    unit: indicator.config.unit,
                    tooltipFormat: indicator.config.format
                  }
                }] 
              }
          
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