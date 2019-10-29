class VisionZero{
    constructor(){}

    getAllData({from=2016,to=2019}){
      const MEASURES = encodeURIComponent(['Traffic Calming Installations','Red Light Cameras','Audible Pedestrian Signals','Leading Pedestrian Intervals','LED Blankout Signs','School Safety Zones','Senior Safety Zones','Pedestrian Safety Corridors'].map((val)=>{
        return "'"+val+"'";
      }).join(','));
      
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE%20AND%20SAFETY_PROGRAM_TYPE%20IN%20('+MEASURES+')&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        res.features.map(({properties}=feature)=>{
          label = 'Total Installations';
          //labels.push(properties.STREET);

          
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()+'-'+(parseInt(dt.getUTCMonth())+1)+'-'+dt.getUTCDay()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''))||1;
          } else {
            labels.push(date)
            dtObj[date] = parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''))||1;
          }           
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          var at = a.split('-');
          var bt = b.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartData:{
            labels,
            datasets
          }
        })
      })
    }

    getKSIData(from=2018,to=2019){
      const MEASURES = encodeURIComponent(['Traffic Calming Installations','Red Light Cameras','Audible Pedestrian Signals','Leading Pedestrian Intervals','LED Blankout Signs','School Safety Zones','Senior Safety Zones','Pedestrian Safety Corridors'].map((val)=>{
        return "'"+val+"'";
      }).join(','));

      const DATERANGE = {from,to}
      
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?where=ACCIDENT_DATE BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND INJURY IN (3)&outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        var dtK = [];
        var dtSI = [];
        var datasets = [];
      
        console.debug('getKSIData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        res.features.map(({properties}=feature)=>{
          label = 'Fatalities';
          var dt = new Date(properties.ACCIDENT_DATE);
          var date = moment(dt).format('YYYY-MM-DD');
          var category = {};
          
          if(!dtObj.hasOwnProperty(date)){
            labels.push(date);
            dtObj[date] = [];
          }


          dtObj[date].push({
            label: properties.INVOLVEMENT_TYPE,
            date: date,
            value: +1,
            properties:properties
          })

        });

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          });
        }
        
        labels.sort(function(a,b){
          var at = a.split('-');
          var bt = b.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2]);
          return dateA-dateB;
        });
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        

        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        console.log('KSI', dtK, dtSI)
        return Promise.resolve({
          chartData:{
            labels,
            datasets
          }
        })
      })
    }


    getModeOfTravelByYear({from=2016,to=parseInt(moment().format('YYYY')),INJURY_TYPE=null}){
      const labels = [];

      for(var i=from; i <= to; i++){ 
        labels.push(i)
      }
    
      const processResults = function (res){
        var data= new Array(labels.length).fill(null);
        var backgroundColor = [];
        var label = '';
        var categories = {}

        var tempData= {};       
        res.features.map(({properties}=feature)=>{
          var categoryLabel, color;
          switch(properties.INVOLVEMENT_TYPE){
            case "01":
            case "02":
            case "18":
            case "22":
              categoryLabel = 'Motorist';
              color = '#E17C05';
              break;
            case "03":
            case "17":
            case "19":
            case "20":
              categoryLabel = 'Pedestrian';
              color = '#1D6996';
              break;
            case "04":
            case "05":
            case "21":
              categoryLabel = 'Cyclist';
              color = '#38A6A5';
              break;
            case "06":
            case "07":
            case "08":
            case "09":
              categoryLabel = 'Motorcyclist';
              color = '#0F8554';
              break;
            default:
              categoryLabel = 'Other';
              color = '#D54B1A';
              break;
          }

          if(tempData.hasOwnProperty(properties.ACCIDENT_YEAR)){
            tempData[properties.ACCIDENT_YEAR]++;
          } else {
            tempData[properties.ACCIDENT_YEAR] = 1;
          }        
          
          type = properties.INJURY;
          label = categoryLabel;
          backgroundColor = color;
        })

        for(var year in tempData){ 
          labels.filter((v,i,a)=>{
            data[i] = tempData[v]||null;
          })
        }

        return { type, label, data,  backgroundColor}
      }


      const INVOLVEMENT_TYPE = {
        pedestrian_motorist:['01','02','18','22'],//#e6194b
        pedestrian:['03','17','19','20'],//#e6194b
        cyclist:['04','05','21'],//#3cb44b
        motorcyclist:['06','07','08','09'],//#ffe119
        //motorist:[]//#4363d8
      }
      
      const INJURY = (type)=>{
        switch(type){
          case 4:
            return { fatality: 4 };
            break;
          case 3:
            return { seriously_injured:3 };
            break;
          default:
            return {
              fatality:4,
              seriously_injured:3
            }
        }
      };

      
      const requests = [];
      const data = {};
      var lastModified = '';
      
      for(var injuryType in INJURY(INJURY_TYPE)){
        
        for(var type in INVOLVEMENT_TYPE){
          
          var INJURY_STR = INJURY(INJURY_TYPE)[injuryType];
          var INVOLVEMENT_TYPE_STR = INVOLVEMENT_TYPE[type].map(t=>{return t}).join(',')
          const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?where=ACCIDENT_DATE BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND%20INJURY%20IN%20(${INJURY_STR})%20AND%20INVOLVEMENT_TYPE%20IN%20(${INVOLVEMENT_TYPE_STR})&outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson`;
          requests.push(fetch(URI).then(res=>{return res.json()}).then(res=>{
            const totalResults = res.features.length;
            if(res.features[totalResults-1] ){
              lastModified = new Date(res.features[totalResults-1].properties.ACCIDENT_DATE) > lastModified?res.features[totalResults-1].properties.ACCIDENT_DATE:lastModified;
            }
              
            const results = processResults(res);
            console.debug('getModeOfTravelByYear')
            console.log('getModeOfTravelByYear:ResultsURI', URI)
            console.log('getModeOfTravelByYear:ResultsRaw', res)
            console.log('getModeOfTravelByYear:ResultsProcessed', results, lastModified)
            return Promise.resolve(results);
            })
          )
        }
      }

      const datasets = []
      return Promise.all(requests).then(data=>{
        console.log('getModeOfTravelByYear:Data', data)
        const mode = {}
        data.map((d)=>{
          if(d.label)
            if(mode.hasOwnProperty(d.label)){
              mode[d.label].data.push(d.data[0]);
              mode[d.label].backgroundColor = d.backgroundColor;
            } else {
              mode[d.label] = {
                data: d.data,
                backgroundColor: d.backgroundColor
              }
            }            
        })





        for(var label in mode){
          datasets.push({
            label,
            data:mode[label].data,
            backgroundColor: mode[label].backgroundColor
          })
        }

        

        return Promise.resolve({
          chartOptions:{
            showCount: true,
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })

      })
    }

    getModeOfTravelByMonth({from=2019,to=2019,INJURY_TYPE=null}){
      const DATERANGE = {from,to}
      
      const processResults = function (res){
        var data= new Array(12).fill(0,0,moment().month()+1);
        var backgroundColor = [];
        var label = '';
        var categories = {}
        var types = {}
        var colours = {};
        
        res.features.map(({properties}=feature)=>{
          let dt = new Date(properties.ACCIDENT_DATE);
    
          var categoryLabel, color;
          switch(properties.INVOLVEMENT_TYPE){
            case "01":
            case "02":
            case "18":
            case "22":
              categoryLabel = 'Motorist';
              color = '#E17C05';
              break;
            case "03":
            case "17":
            case "19":
            case "20":
              categoryLabel = 'Pedestrian';
              color = '#1D6996';
              break;
            case "04":
            case "05":
            case "21":
              categoryLabel = 'Cyclist';
              color = '#38A6A5';
              break;
            case "06":
            case "07":
            case "08":
            case "09":
              categoryLabel = 'Motorcyclist';
              color = '#0F8554';
              break;
            default:
              categoryLabel = 'Other';
              color = '#D54B1A';
              break;
          }

          
          

          // if(categories.hasOwnProperty(categoryLabel)){
          //   categories[categoryLabel]++;
          //   data[dt.getMonth()]++;
          // } else {
            categories[categoryLabel] += 1;
            colours[categoryLabel] = color;
            data[dt.getMonth()] += 1;
            if(properties.INJURY == 4)
            console.log( categoryLabel, properties,  dt, data)
          //}
          
          



          if(types.hasOwnProperty(properties.INJURY)){
            types[properties.INJURY].push(res)
          } else {
            types[properties.INJURY] = [res]
          }
          type = properties.INJURY;


          console.log(categoryLabel, categories[categoryLabel], type );
        })

        for(var category in categories){          
          label = category;
          //data.push(categories[category]);
          backgroundColor = colours[category]
        }
        
        return { type, label, data,  backgroundColor}
      }

      const INVOLVEMENT_TYPE = {
        pedestrian_motorist:['01','02','18','22'],//#e6194b
        pedestrian:['03','17','19','20'],//#e6194b
        cyclist:['04','05','21'],//#3cb44b
        motorcyclist:['06','07','08','09'],//#ffe119
        other:['99']//#4363d8
      }
      
      const INJURY = (type)=>{
        switch(type){
          case 4:
            return { fatality: 4 };
            break;
          case 3:
            return { seriously_injured:3 };
            break;
          default:
            return {
              fatality:4,
              seriously_injured:3
            }
        }
      };

      const labels = [];
      const requests = [];
      const data = {};
      var lastModified = '';
      var URI = ''
      
      for(var injuryType in INJURY(INJURY_TYPE)){
        var tmpLabel = '';
        if(injuryType === 'fatality') tmpLabel = 'Fatalities'
        if(injuryType === 'seriously_injured') tmpLabel = 'Seriously Injured'

        labels.push(tmpLabel)
        for(var type in INVOLVEMENT_TYPE){
          
          var INJURY_STR = INJURY(INJURY_TYPE)[injuryType];
          var INVOLVEMENT_TYPE_STR = INVOLVEMENT_TYPE[type].map(t=>{return t}).join(',')
          URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?where=ACCIDENT_DATE BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND%20INJURY%20IN%20(${INJURY_STR})%20AND%20INVOLVEMENT_TYPE%20IN%20(${INVOLVEMENT_TYPE_STR})&outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson`;

          requests.push(fetch(URI).then(res=>{return res.json()}).then(res=>{           
            const totalResults = res.features.length||0;
            console.debug('getModeOfTravelByMonth:Results',res, totalResults, INJURY_STR, INVOLVEMENT_TYPE_STR)
            if(totalResults>0) lastModified = new Date(res.features[totalResults-1].properties.ACCIDENT_DATE)||''
              const results = processResults(res);
              return Promise.resolve(results);
            })
          )
        }
      }

      const datasets = []
      return Promise.all(requests).then(data=>{
        console.log('getModeOfTravelByMonth:Data',data)
        const mode = {}
        data.map((d)=>{
          if(d.label != ''){
            if(mode.hasOwnProperty(d.label)){
              mode[d.label].data.push(d.data[0]);
              mode[d.label].backgroundColor = d.backgroundColor;
            } else {
              mode[d.label] = {
                data: d.data,
                backgroundColor: d.backgroundColor
              }
            } 
          }
                     
        })


        for(var label in mode){
          datasets.push({
            label,
            data:mode[label].data,
            backgroundColor: mode[label].backgroundColor
          })
        }

        return Promise.resolve({
          chartOptions:{
            showCount: true,
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels:['January','February','March','April','May','June','July','August','September','October','November','December'],
            datasets
          }
        })

      })
    }

    getModeOfTravel({from=2016,to=2019,INJURY_TYPE=null}){
      const DATERANGE = {from,to}
      
      const processResults = function (res){
        var data= [];
        var labels = [];
        var backgroundColor = [];
        var label = '';
        var dtObj = {};
        var categories = {}
        var types = {}

        var colours = {};
        
        res.features.map(({properties}=feature)=>{
          var categoryLabel, color;
          switch(properties.INVOLVEMENT_TYPE){
            case "01":
            case "02":
            case "18":
            case "22":
                categoryLabel = 'Motorist';
                color = '#E17C05';
                break;
            case "03":
            case "17":
            case "19":
            case "20":
              categoryLabel = 'Pedestrian';
              color = '#1D6996';
              break;
            case "04":
            case "05":
            case "21":
              categoryLabel = 'Cyclist';
              color = '#38A6A5';
              break;
            case "06":
            case "07":
            case "08":
            case "09":
              categoryLabel = 'Motorcyclist';
              color = '#0F8554';
              break;
          }

          
          if(categories.hasOwnProperty(categoryLabel)){
            categories[categoryLabel] += 1; 
          } else {
            categories[categoryLabel] = 1;
            colours[categoryLabel] = color;
          }

          if(types.hasOwnProperty(properties.INJURY)){
            types[properties.INJURY].push(res)
          } else {
            types[properties.INJURY] = [res]
          }
          type = properties.INJURY;
        })

        for(var category in categories){          
          label = category;
          data.push(categories[category]);
          backgroundColor = colours[category]
        }
        
        return { type, label, data,  backgroundColor}
      }


      const INVOLVEMENT_TYPE = {
        pedestrian_motorist:['01','02','18','22'],//#e6194b
        pedestrian:['03','17','19','20'],//#e6194b
        cyclist:['04','05','21'],//#3cb44b
        motorcyclist:['06','07','08','09'],//#ffe119
        //motorist:[]//#4363d8
      }
      
      const INJURY = (type)=>{
        switch(type){
          case 4:
            return { fatality: 4 };
            break;
          case 3:
            return { seriously_injured:3 };
            break;
          default:
            return {
              fatality:4,
              seriously_injured:3
            }
        }
      };

      const labels = [];
      const requests = [];
      const data = {};
      var lastModified = '';
      
      for(var injuryType in INJURY(INJURY_TYPE)){
        var tmpLabel = '';
        if(injuryType === 'fatality') tmpLabel = 'Fatalities'
        if(injuryType === 'seriously_injured') tmpLabel = 'Seriously Injured'

        labels.push(tmpLabel)
        for(var type in INVOLVEMENT_TYPE){
          var INJURY_STR = INJURY(INJURY_TYPE)[injuryType];
          var INVOLVEMENT_TYPE_STR = INVOLVEMENT_TYPE[type].map(t=>{return t}).join(',')
          const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson&where=ACCIDENT_YEAR%20BETWEEN%20${DATERANGE.from}%20AND%20${DATERANGE.to}%20AND%20INJURY%20IN%20(${INJURY_STR})%20AND%20INVOLVEMENT_TYPE%20IN%20(${INVOLVEMENT_TYPE_STR})`;

          requests.push(fetch(URI).then(res=>{return res.json()}).then(res=>{
            const totalResults = res.features.length;
            lastModified = new Date(res.features[totalResults-1].properties.ACCIDENT_DATE)
              const results = processResults(res);
              return Promise.resolve(results);
            })
          )
        }
      }

      const datasets = []
      return Promise.all(requests).then(data=>{
        console.debug('getModeOfTravel',URI,DATERANGE, data)
        const mode = {}
        data.map((d)=>{
          if(mode.hasOwnProperty(d.label)){
            mode[d.label].data.push(d.data[0]);
            mode[d.label].backgroundColor = d.backgroundColor;
          } else {
            mode[d.label] = {
              data: d.data,
              backgroundColor: d.backgroundColor
            }
          }            
        })

        for(var label in mode){
          datasets.push({
            label,
            data:mode[label].data,
            backgroundColor: mode[label].backgroundColor
          })
        }

        return Promise.resolve({
          chartOptions:{
            showCount: false,
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })

      })
     
    }
    
    getSeriouslyInjuredData({from=2016,to=2019,INJURY_TYPE=3}){  
      const DATERANGE = {from,to};
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?where=ACCIDENT_DATE%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND%20CURRENT_DATE AND%20INJURY%20IN%20(${INJURY_TYPE})%20&outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson`;      
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.ACCIDENT_DATE);
        console.debug('getSeriouslyInjuredData', URI,res)
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        res.features.map(({properties}=feature)=>{
          label = 'Fatalities';
          //labels.push(properties.STREET);
          var dt = new Date(properties.ACCIDENT_DATE)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date)
            dtObj[date] = 1;
          }           
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          // var at = a.split('-');
          // var bt = b.split('-');
          // var dateA = new Date(at[0],at[1],at[2]);
          // var dateB = new Date(bt[0],bt[1],bt[2])
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            showCount: false,
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }

    getFatalitiesData({from=2016,to=2019,INJURY_TYPE=4}){  
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_TMC_KSI/FeatureServer/0/query?where=ACCIDENT_DATE BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE%20AND%20INJURY%20IN%20(${INJURY_TYPE})%20&outSr=4326&outFields=*&orderByFields=ACCIDENT_DATE&inSr=4326&f=geojson`;
      const datasets = []
      let lastModified = '';
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getFatalitiesData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.ACCIDENT_DATE);

        res.features.map(({properties}=feature)=>{
          label = 'Fatalities';
          //labels.push(properties.STREET);
          var dt = new Date(properties.ACCIDENT_DATE)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date)
            dtObj[date] = 1;
          }           
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          console.log(a,b)
          // var at = a.split('-');
          // var bt = b.split('-');
          // var dateA = new Date(at[0],at[1],at[2]);
          // var dateB = new Date(bt[0],bt[1],bt[2])
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  

    getCyclingNetworkData(){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_LINE/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND SAFETY_PROGRAM_TYPE%20IN%20(%27Traffic%20Calming%27)&outSr=4326&outFields=*&orderByFields=DT&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getCyclingNetworkData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''));
          } else {
            labels.push(date)
            dtObj[date] = parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''));
          }           
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          /*
          var at = a.split('-');
          var bt = b.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
          */
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }

    getTrafficCalmingData(){
      const URI = 'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_LINE/FeatureServer/0/query?returnGeometry=true&where=year%20BETWEEN%202005%20AND%202019%20AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Traffic%20Calming%27)&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&geometry=%7B%22xmin%22%3A-79.453125%2C%22ymin%22%3A43.58039085560786%2C%22xmax%22%3A-79.1015625%2C%22ymax%22%3A43.83452678223684%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=geojson';
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};
        

        console.debug('getTrafficCalmingData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''));
          } else {
            labels.push(date)
            dtObj[date] = parseInt(properties.DETAILS.replace(/(Speed Humps: )/gi,''));
          }           
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          var at = a.split('-');
          var bt = b.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })

        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          }, 
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    getRedLightCameraData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND SAFETY_PROGRAM_TYPE IN ('Red Light Cameras')&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&returnGeometry=false&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getRedLightCameraData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          //console.log(properties)
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.SAFETY_MEASURE_NAME);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return at-bt
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    getAudiblePedestrianSignalData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Audible%20Pedestrian%20Signals%27)&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getAudiblePedestrianSignalData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    getLeadingPedestrianIntervalData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?returnGeometry=true&where=DT%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND CURRENT_DATE%20AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Leading%20Pedestrian%20Intervals%27)&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};
        
        console.debug('getLeadingPedestrianIntervalData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }

    getCommunitySafetyZoneData({from=2016,to=2019}={}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_LINE/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND SAFETY_PROGRAM_TYPE in ('Community Safety Zones')&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};
        
        console.debug('getCommunitySafetyZoneData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = "Community Safety Zones";
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()

          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
      
    }

/*
TODO: SPLIT into TWO DATASETS
*/


    getTrafficSignalData({from=2016,to=2019}){
      /*-- /* MERGED WITH PedstrianCrossover */
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE%20AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Traffic%20Signals%27%2C%27Pedestrian%20Crossovers%27)&outSr=4326&outFields=*&orderByFields=DT&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getTrafficSignalData', res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = 'Traffic Signals & Pedestrian Crossovers'||properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }

    getPedestrianCrossoversData(){
      
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?returnGeometry=true&where=DT%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND%20CURRENT_DATE%20AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Pedestrian%20Crossovers%27)&outSr=4326&outFields=*&orderByFields=DT&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getPedestrianCrossoversData', res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${lastModified.getUTCFullYear()}-${lastModified.getUTCMonth()+1}-${lastModified.getUTCDate()}`
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    getLEDBlankoutSignData({from=2016,to=2019}){
      //const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND%20CURRENT_DATE%20AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27LED%20Blankout%20Signs%27)&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/ArcGIS/rest/services/COTGEO_SAFETY_MEASURE_POINT/FeatureServer/0/query?where=DT+BETWEEN+date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'+AND+CURRENT_DATE+AND+SAFETY_PROGRAM_TYPE+IN+%28%27LED+Blankout+Signs%27%29&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=true&cacheHint=false&orderByFields=DT&groupByFieldsForStatistics=SAFETY_ZONE_ID%2CSAFETY_PROGRAM_TYPE%2CSAFETY_MEASURE_NAME%2C+LOC%2C+DT%2C+YEAR%2C+STREET%2C+INTERSECTION_FROM%2C+INTERSECTION_TO%2C+WARD_NUMBER&outStatistics=%5B%7B%22statisticType%22%3A%22count%22%2C%22onStatisticField%22%3A%22LOC%22%2C%22outStatisticFieldName%22%3A%22loc_count%22%7D%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=standard&f=geojson&token=`
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getLEDBlankoutSignData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data ,backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    getSeniorSafetyZoneData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POLYGON/FeatureServer/0/query?where=DT%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND%20CURRENT_DATE AND%20SAFETY_PROGRAM_TYPE%20IN%20(%27Senior%20Safety%20Zones%27)&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getSeniorSafetyZoneData',URI,res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data , backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
    

    getSchoolSafetyZoneData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POLYGON/FeatureServer/0/query?where=DT BETWEEN date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}' AND CURRENT_DATE AND SAFETY_PROGRAM_TYPE IN ('School Safety Zones')&outSr=4326&outFields=*&orderByFields=DT&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getSchoolSafetyZoneData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });
        
        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.STREET);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data , backgroundColor:"#165788"})

        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  
  
    getPedestrianSafetyCorridorsData({from=2016,to=2019}){
      const URI = `https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_SAFETY_MEASURE_POLYGON/FeatureServer/0/query?where=DT%20BETWEEN%20date'${moment(new Date(from,0,1)).format('YYYY-MM-DD')}'%20AND%20CURRENT_DATE%20SAFETY_PROGRAM_TYPE%20IN%20(%27Pedestrian%20Safety%20Corridors%27)&outSr=4326&outFields=*&orderByFields=YEAR&inSr=4326&f=geojson`;
      const datasets = []
  
      return fetch(URI).then(res=>{return res.json()}).then(res=>{
        var data= [];
        var labels = [];
        var label = '';
        var dtObj = {};

        console.debug('getPedestrianSafetyCorridorsData',res);
        if(res.features.length == 0) return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: N/A`,
          },
          chartData:{
            labels,
            datasets
          }
        });

        const totalResults = res.features.length;
        lastModified = new Date(res.features[totalResults-1].properties.DT);

        res.features.map(({properties}=feature)=>{
          label = properties.SAFETY_PROGRAM_TYPE;
          //labels.push(properties.LOC);
          var dt = new Date(properties.DT)
          var date = dt.getUTCFullYear()
          
          if(dtObj.hasOwnProperty(date)){
            dtObj[date] += 1;
          } else {
            labels.push(date);
            dtObj[date] = 1;
          }  
        })

        for(var date in dtObj){
          data.push({
            t:date,
            y:dtObj[date]
          })
        }
        
        labels.sort(function(a,b){
          return a-b
        })
        
        data.sort(function(a,b){
          var at = a.t.split('-');
          var bt = b.t.split('-');
          var dateA = new Date(at[0],at[1],at[2]);
          var dateB = new Date(bt[0],bt[1],bt[2])
          return dateA-dateB
        })
        
        datasets.push({ label, data , backgroundColor:"#165788"})
        
        return Promise.resolve({
          chartOptions:{
            caption: `Last Reported: ${moment(lastModified).format('YYYY-MM-DD')}`,
          },
          chartData:{
            labels,
            datasets
          }
        })
      })
    }
  }