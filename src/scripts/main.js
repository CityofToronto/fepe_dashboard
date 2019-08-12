// The main javascript file for fepe_dashboard.


class PotholeData{
  constructor(){
    _self = this;
  }




  affordableRentalUnits(){}


  getData(dimension='ytd',year){
    const onClick = function(dimension,e,d,t){
      var p = new window.PotholeData();
      
      
      if(d.length > 0){
        document.getElementById('filter-button').style.display = null;
        let $potholeBar = document.getElementById('pothole-bar');
        //$potholeBar.data = p.getData(dimension, year);

        
        d.forEach(dta=>{
          //dta._chart.chart.options = p.getData(dimension).chartOptions;         
          dta._chart.chart.data = p.getData(dimension,dta._model.label).chartData;        
          dta._chart.chart.update({
            duration: 800,
            easing: 'easeOutBounce'
          });
        })
        
      }
      //$potholeBar.updateComponent();
    }


    // Return Monthly Data
    if(dimension == 'mth')
    return {
      chartOptions:{ 
        onClick:()=>{} 
      },
      chartData:{
        labels:['January','February','March','April','May','June','July','August','September','October','November','December'],
        datasets:[{
          label:'2019',
          data:[18000,1900,200000,98000,62000,100],
          backgroundColor: '#E64A19'
        },{
          label:'2018',
          data:[351,1935,19480,115,81688,241].reverse(),
          backgroundColor: '#FF5722'
        },{
          label:'2017',
          data:[31,1365,1540,11665,1688,2431],
          backgroundColor: '#FF8A65'
        },{
          label:'2016',
          data:[311,1963,15948,131,18688,431].reverse(),
          backgroundColor: '#FFCCBC'
        }].filter(set=>{
         
          if(set.label == year){
            return set;
          }

        })
      }
    }



    // Return Yearly Data
    if(dimension == 'ytd')
    return {
      chartOptions:{ 
        onClick:function(e,d,t){ onClick('mth',e,d,t);}
      },
      chartData:{
        
        labels:['January','February','March','April','May','June','July','August','September','October','November','December'],
        datasets:[{
          label:'2019',
          data:[64460,19340,28144,54847,74737,15067,40961,16394],
          backgroundColor: '#E64A19'
        },{
          label:'2018',
          data:[99709,13594,71937,96909,95436,26412,33484,38825,22803,70869,113,85823],
          backgroundColor: '#FF5722'
        },{
          label:'2017',
          data:[99045,89027,45638,75805,11863,50575,87555,76614,56320,17203,34553,35621],
          backgroundColor: '#FF8A65'
        },{
          label:'2016',
          data:[6117,94368,29616,23871,67665,9726,56983,68328,60851,83282,89432,1786],
          backgroundColor: '#FFCCBC'
        },{
          label:'2015',
          data:[43098,9985,9322,84755,58456,10795,53779,77941,5454,69801,3318,76210],
          backgroundColor: '#FBE9E7'
        }]
      }
    }
  }
}


class ChartData{
  constructor({options:chartOptions,data:chartData}={}){

    const defaultOptions={}
      
    return{
      chartOptions:{
        srcTitle: 'Neighbourhood',
        srcKey: 'AREA_SHORT_CODE'||'OBJECTID',
        srcLabel: 'AREA_NAME'||'HOODNUM',
        type: 'choropleth'||'leaflet',
        layer: 'City_Ward_2018',
        src: 'https://gis.toronto.ca/arcgis/rest/services/primary/cot_geospatial_mtm/MapServer/265'||'resources/cot_neighbourhoods.json',

        tooltipTemplate:{
          title:'<p><strong>{{TITLE}}</strong></p>',
          body:'<p>{{VALUE}} in {{LABEL}}</p>'
        },

        fontSize: 18,
        legend:{ 
          display: false,
        },
        layout: {
          padding: {
              left: -20,
              right: 0,
              top: 20,
              bottom: 0
          }
        },
        onClick(evt){ 
          console.log(evt)
         },
        //onHover(evt){  },
        onMouseOut(evt){ }
      },
      chartData:{
          //labels: ["Toronto","Agincourt North","Agincourt South-Malvern West","Alderwood","Annex","Banbury-Don Mills","Bathurst Manor","Bay Street Corridor","Bayview Village","Bayview Woods-Steeles","Bedford Park-Nortown","Beechborough-Greenbrook","Bendale","Birchcliffe-Cliffside","Black Creek","Blake-Jones","Briar Hill-Belgravia","Bridle Path-Sunnybrook-York Mills","Broadview North","Brookhaven-Amesbury","Cabbagetown-South St. James Town","Caledonia-Fairbank","Casa Loma","Centennial Scarborough","Church-Yonge Corridor","Clairlea-Birchmount","Clanton Park","Cliffcrest","Corso Italia-Davenport","Danforth","Danforth - East York","Don Valley Village","Dorset Park","Dovercourt-Wallace Emerson-Junction","Downsview-Roding-CFB","Dufferin Grove","East End-Danforth","Edenbridge-Humber Valley","Eglinton East","Elms-Old Rexdale","Englemount-Lawrence","Eringate-Centennial-West Deane","Etobicoke West Mall","Flemingdon Park","Forest Hill North","Forest Hill South","Glenfield-Jane Heights","Greenwood-Coxwell","Guildwood","Henry Farm","High Park North","High Park-Swansea","Highland Creek","Hillcrest Village","Humber Heights-Westmount","Humber Summit","Humbermede","Humewood-Cedarvale","Ionview","Islington-City Centre West","Junction Area","Keelesdale-Eglinton West","Kennedy Park","Kensington-Chinatown","Kingsview Village-The Westway","Kingsway South","Lambton Baby Point","L'Amoreaux","Lansing-Westgate","Lawrence Park North","Lawrence Park South","Leaside Bennington","Little Portugal","Long Branch","Malvern","Maple Leaf","Markland Wood","Milliken","Mimico","Morningside","Moss Park","Mount Dennis","Mount Olive-Silverstone-Jamestown","Mount Pleasant East","Mount Pleasant West","New Toronto","Newtonbrook East","Newtonbrook West","Niagara","North Riverdale","North St. James Town","Oakridge","Oakwood Village","O'Connor-Parkview","Old East York","Palmerston-Little Italy","Parkwoods Donalda","Pelmo Park-Humberlea","Playter Estates-Danforth","Pleasant View","Princess-Rosethorn","Regent Park","Rexdale-Kipling","Rockcliffe-Smythe","Roncesvalles","Rosedale-Moore Park","Rouge","Runnymede-Bloor West Village","Rustic","Scarborough Village","South Parkdale","South Riverdale","St. Andrew-Windfields","Steeles","Stonegate-Queensway","Tam O'Shanter-Sullivan","Taylor-Massey","The Beaches","Thistletown-Beaumond Heights","Thorncliffe Park","Trinity-Bellwoods","University","Victoria Village","Waterfront Communities-The Island","West Hill","West Humber-Clairville","Westminster-Branson","Weston","Weston-Pelham Park","Wexford-Maryvale","Willowdale East","Willowdale West","Willowridge-Martingrove-Richview","Woburn","Woodbine Corridor","Woodbine-Lumsden","Wychwood","Yonge-Eglinton","Yonge-St.Clair","York University Heights","Yorkdale-Glen Park"],
          srcKeys: ['129','128','020','095','042','034','076','052','049','039','112','127','122','024','069','108','041','057','030','071','109','096','133','075','120','033','123','092','061','059','066','047','126','093','026','083','062','009','138','005','032','011','013','044','102','101','025','065','140','053','088','087','134','048','008','021','022','106','125','014','090','110','124','078','006','015','114','117','038','105','103','056','084','019','132','029','012','130','017','135','073','115','002','099','104','018','050','036','082','068','074','121','107','054','058','080','045','023','067','046','010','072','004','111','086','098','131','089','028','139','085','070','040','116','016','118','063','003','055','081','079','043','077','136','001','035','113','091','119','051','037','007','137','064','060','094','100','097','027','031'],
          labels: ["Agincourt North","Agincourt South-Malvern West","Alderwood","Annex","Banbury-Don Mills","Bathurst Manor","Bay Street Corridor","Bayview Village","Bayview Woods-Steeles","Bedford Park-Nortown","Beechborough-Greenbrook","Bendale","Birchcliffe-Cliffside","Black Creek","Blake-Jones","Briar Hill-Belgravia","Bridle Path-Sunnybrook-York Mills","Broadview North","Brookhaven-Amesbury","Cabbagetown-South St. James Town","Caledonia-Fairbank","Casa Loma","Centennial Scarborough","Church-Yonge Corridor","Clairlea-Birchmount","Clanton Park","Cliffcrest","Corso Italia-Davenport","Danforth","Danforth - East York","Don Valley Village","Dorset Park","Dovercourt-Wallace Emerson-Junction","Downsview-Roding-CFB","Dufferin Grove","East End-Danforth","Edenbridge-Humber Valley","Eglinton East","Elms-Old Rexdale","Englemount-Lawrence","Eringate-Centennial-West Deane","Etobicoke West Mall","Flemingdon Park","Forest Hill North","Forest Hill South","Glenfield-Jane Heights","Greenwood-Coxwell","Guildwood","Henry Farm","High Park North","High Park-Swansea","Highland Creek","Hillcrest Village","Humber Heights-Westmount","Humber Summit","Humbermede","Humewood-Cedarvale","Ionview","Islington-City Centre West","Junction Area","Keelesdale-Eglinton West","Kennedy Park","Kensington-Chinatown","Kingsview Village-The Westway","Kingsway South","Lambton Baby Point","L'Amoreaux","Lansing-Westgate","Lawrence Park North","Lawrence Park South","Leaside Bennington","Little Portugal","Long Branch","Malvern","Maple Leaf","Markland Wood","Milliken","Mimico","Morningside","Moss Park","Mount Dennis","Mount Olive-Silverstone-Jamestown","Mount Pleasant East","Mount Pleasant West","New Toronto","Newtonbrook East","Newtonbrook West","Niagara","North Riverdale","North St. James Town","Oakridge","Oakwood Village","O'Connor-Parkview","Old East York","Palmerston-Little Italy","Parkwoods Donalda","Pelmo Park-Humberlea","Playter Estates-Danforth","Pleasant View","Princess-Rosethorn","Regent Park","Rexdale-Kipling","Rockcliffe-Smythe","Roncesvalles","Rosedale-Moore Park","Rouge","Runnymede-Bloor West Village","Rustic","Scarborough Village","South Parkdale","South Riverdale","St. Andrew-Windfields","Steeles","Stonegate-Queensway","Tam O'Shanter-Sullivan","Taylor-Massey","The Beaches","Thistletown-Beaumond Heights","Thorncliffe Park","Trinity-Bellwoods","University","Victoria Village","Waterfront Communities-The Island","West Hill","West Humber-Clairville","Westminster-Branson","Weston","Weston-Pelham Park","Wexford-Maryvale","Willowdale East","Willowdale West","Willowridge-Martingrove-Richview","Woburn","Woodbine Corridor","Woodbine-Lumsden","Wychwood","Yonge-Eglinton","Yonge-St.Clair","York University Heights","Yorkdale-Glen Park"],
          datasets: [{
            label:'2019',
            data:[11.8,11.3,9.9,5.3,7.7,9.7,5.9,6.9,8.3,6.4,14.2,13.5,9.4,14.8,8.8,11.2,5.6,9.1,13.4,7.5,11.7,5.7,11.0,7.6,12.5,10.3,10.9,10.2,8.9,9.1,9.3,14.5,10.5,12.6,9.3,8.7,8.1,15.5,13.1,10.5,9.3,10.4,12.9,7.2,5.1,14.3,9.2,9.5,10.1,6.0,5.9,14.5,8.8,9.9,14.8,13.9,8.1,13.8,9.3,9.4,12.8,14.4,8.6,12.4,5.4,7.5,12.0,7.4,5.1,4.9,5.4,10.1,8.5,16.8,12.0,8.1,11.2,8.3,15.2,9.0,13.1,15.1,6.0,7.1,9.7,8.3,9.4,7.6,6.8,11.6,14.7,10.8,10.7,8.9,7.4,10.3,12.1,6.8,9.7,7.7,13.2,12.4,12.4,8.2,4.6,15.8,7.2,13.8,15.1,11.4,9.0,6.7,10.4,7.3,11.3,12.6,5.0,13.0,13.3,9.4,6.4,12.1,6.8,13.9,14.1,10.6,12.9,12.1,12.1,6.8,8.0,11.0,14.9,8.4,9.1,8.9,5.5,5.1,12.1,11.7],
            fill:false,
            //backgroundColor:"#165D88"
            backgroundColor:['#08415C','#CC2936','#EBBAB9','#388697','#B5FFE1']
            //backgroundColor:['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
            //backgroundColor:["#165A88","#165D88","#166088","#166388","#166688","#166988","#166C88","#166F88","#167288","#167688","#177988","#177C88","#177F88","#178288","#178588","#178888","#178886","#178983","#178980","#17897D","#17897A","#178977","#178974","#178971","#17896E","#17896B","#178968","#178965","#178962","#178960","#17895D","#17895A","#188957","#188954","#188951","#18894E","#18894B","#188948","#188945","#188942","#18893F","#18893C","#188939","#188936","#188933","#188930","#18892D","#18892A","#188927","#188924","#188921","#188A1E","#188A1B","#188A18","#1C8A19","#1F8A19","#228A19","#258A19","#288A19","#2B8A19","#2E8A19","#318A19","#348A19","#378A19","#3A8A19","#3D8A19","#408A19","#438A19","#468A19","#498A19","#4C8A19","#4F8A19","#528A19","#558A19","#588A19","#5B8A19","#5E8A1A","#618A1A","#648A1A","#678A1A","#6A8A1A","#6D8A1A","#708A1A","#738A1A","#768A1A","#798A1A","#7C8B1A","#7F8B1A","#828B1A","#858B1A","#888B1A","#8B8A1A","#8B871A","#8B841A","#8B811A","#8B7E1A","#8B7B1A","#8B781B","#8B751B","#8B721B","#8B6F1B","#8B6D1B","#8B6A1B","#8B671B","#8B641B","#8B611B","#8B5E1B","#8B5B1B","#8B581B","#8B551B","#8B521B","#8B4F1B","#8B4C1B","#8B491B","#8B461B","#8B431B","#8B411B","#8B3E1B","#8B3B1B","#8B381C","#8B351C","#8C321C","#8C2F1C","#8C2C1C","#8C291C","#8C261C","#8C231C","#8C201C","#8C1E1C","#8C1C1D","#8C1C20","#8C1C23","#8C1C26","#8C1C29","#8C1C2C","#8C1C2F","#8C1C32","#8C1C35","#8C1C38","#8C1C3B","#8C1C3E"],
          }
          //,{
          //  label:'2010',
          //  data:[11.8,11.3,9.9,5.3,7.7,9.7,5.9,6.9,8.3,6.4,14.2,13.5,9.4,14.8,8.8,11.2,5.6,9.1,13.4,7.5,11.7,5.7,11.0,7.6,12.5,10.3,10.9,10.2,8.9,9.1,9.3,14.5,10.5,12.6,9.3,8.7,8.1,15.5,13.1,10.5,9.3,10.4,12.9,7.2,5.1,14.3,9.2,9.5,10.1,6.0,5.9,14.5,8.8,9.9,14.8,13.9,8.1,13.8,9.3,9.4,12.8,14.4,8.6,12.4,5.4,7.5,12.0,7.4,5.1,4.9,5.4,10.1,8.5,16.8,12.0,8.1,11.2,8.3,15.2,9.0,13.1,15.1,6.0,7.1,9.7,8.3,9.4,7.6,6.8,11.6,14.7,10.8,10.7,8.9,7.4,10.3,12.1,6.8,9.7,7.7,13.2,12.4,12.4,8.2,4.6,15.8,7.2,13.8,15.1,11.4,9.0,6.7,10.4,7.3,11.3,12.6,5.0,13.0,13.3,9.4,6.4,12.1,6.8,13.9,14.1,10.6,12.9,12.1,12.1,6.8,8.0,11.0,14.9,8.4,9.1,8.9,5.5,5.1,12.1,11.7].reverse(),
          //  backgroundColor:"#166088",
          //  fill:false,
            //backgroundColor:["#165A88","#165D88","#166088","#166388","#166688","#166988","#166C88","#166F88","#167288","#167688","#177988","#177C88","#177F88","#178288","#178588","#178888","#178886","#178983","#178980","#17897D","#17897A","#178977","#178974","#178971","#17896E","#17896B","#178968","#178965","#178962","#178960","#17895D","#17895A","#188957","#188954","#188951","#18894E","#18894B","#188948","#188945","#188942","#18893F","#18893C","#188939","#188936","#188933","#188930","#18892D","#18892A","#188927","#188924","#188921","#188A1E","#188A1B","#188A18","#1C8A19","#1F8A19","#228A19","#258A19","#288A19","#2B8A19","#2E8A19","#318A19","#348A19","#378A19","#3A8A19","#3D8A19","#408A19","#438A19","#468A19","#498A19","#4C8A19","#4F8A19","#528A19","#558A19","#588A19","#5B8A19","#5E8A1A","#618A1A","#648A1A","#678A1A","#6A8A1A","#6D8A1A","#708A1A","#738A1A","#768A1A","#798A1A","#7C8B1A","#7F8B1A","#828B1A","#858B1A","#888B1A","#8B8A1A","#8B871A","#8B841A","#8B811A","#8B7E1A","#8B7B1A","#8B781B","#8B751B","#8B721B","#8B6F1B","#8B6D1B","#8B6A1B","#8B671B","#8B641B","#8B611B","#8B5E1B","#8B5B1B","#8B581B","#8B551B","#8B521B","#8B4F1B","#8B4C1B","#8B491B","#8B461B","#8B431B","#8B411B","#8B3E1B","#8B3B1B","#8B381C","#8B351C","#8C321C","#8C2F1C","#8C2C1C","#8C291C","#8C261C","#8C231C","#8C201C","#8C1E1C","#8C1C1D","#8C1C20","#8C1C23","#8C1C26","#8C1C29","#8C1C2C","#8C1C2F","#8C1C32","#8C1C35","#8C1C38","#8C1C3B","#8C1C3E"],
          //}
          ]
        }
      }
    

  }
}



$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax

  //create a new application object:
  let app = new SampleApp('fepe_dashboard');

  //@if !IS_EMBEDDED
  app.setBreadcrumb([ //only standalone apps set their own breadcrumb
    {"name": "fepe_dashboard", "link": "#"}
  ]);
  //@endif

  app.render(); //render the application
  let $potholeBar;
  let phdata;

  phdata = new PotholeData();
  for(var i =1; i<6; i++ ){
    document.getElementById(`pothole-bar${i}`).data = phdata.getData('ytd');
  }

  document.getElementById(`pothole-bar6`).data = new ChartData();
});
