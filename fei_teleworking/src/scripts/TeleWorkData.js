class TeleworkData{
    constructor(){
        this.data = []
    }

    getData(){
        return $.ajax('/app_content/telework_dashboard/');

        return new Promise((resolve,reject)=>{
            
            resolve([{
                id:'panel-0001',
                label: 'VPN sessions',
                caption: 'Current VPN capacity of concurrent sessions',
                description:`
                    <ul>
                        <li>While the capacity is 3000 concurrent users, we have not reached the capacity as bandwidth is an issues. People establishing new connections are experiencing a time lapse. Examples of slow performance are that downloads are slow and email clicks are taking a long time to open.</li>
                        <li>Some users are unable to connect, they are getting the message that anti-virus is not updated. This is not the real issue. The actual reason is that while establishing a use session, the connection needs to go to Symantec for anti-virus signature update and it is unable to do so.</li>
                        <li>Active scan needs to run once a week, ISD team updates patches every month.</li>
                        <li>Service Desk is getting a large no of requests on having issues logging in and configuration of notebooks.</li>
                    </ul>
                `,
                body:``,
                category:['Telework'],
                keywords:[],
                "custom": {
                    "theme": ['Telework'],
                    "desiredDirection": "up",
                    "variance": 0.02,
                    "yearVariance": 0.02,
                    "indicatorType": "daily",
                    "valueType": "number",
                    "divisor": 1000,
                    "decimalAccuracy": null,
                    "yearToDate": "false",
                    "dataSource": "",
                    "hasTarget": "False",
                    "cityPerspective": "",
                    "contact": "",
                    trendAnalysis:[{
                        Analysis:()=>{
                            return{
                                direction:'up',
                                isPositive: true
                            }
                        }
                    }]
                },
                config:{
                    unit:'daily'
                },
                options:{
                  title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                  xAxis:'Average Users',
                  yAxis:'Date',
                  scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    
                  },
                },
                direction: '-',
                data:{
                   calculatedValue: '2,510',
                   labels:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
                   datasets:[
                        //{ label:'Average peak for snow/vacation days ', "datasetType": "Target", data:[1000,1000,1000,1000], type:"line", sum:null },
                        //{ label:'Previous Normal Daily Peak', "datasetType": "Target",  data:[600,600,600,600], type:"line", sum:null },
                        { 
                            label:'Useage', "datasetType": "Actual",  
                            data:[1170,1644,2051], 
                        },
                   ]
                }
            },{
                id:'panel-0002',
                label: 'RSA hard tokens and soft tokens (for non-city issued devices',
                caption: 'Total available devices + tokens to enable telework',
                description:`
                <p>Sole source procurement executed today for 1600 Licenses and 2300 RSA tokens. Delivery date: April 10</p>
                <p><strong>Existing Laptops</strong>
                <ul>
                    <li>770 have arrived and are with the Vendor (200 are being held for TPH),leaving 579 available</li>
                    <li>275 more are scheduled to arrive this week.</li>
                    <li>An order for 1000 more laptops have been placed. Delivery date: TBD</li>
                </ul>
                <p><strong>Purchase of iPads: 100</strong></p>
                <ul>
                <li>The vendor does not have any available at this time</li>
                <li>No capacity issues connecting through the cellular network. AirWatch is able to add another 3000 devices to current infrastructure</li>
                </ul>  
                `,
                body:``,
                category:['Telework'],
                keywords:[],
                "custom": {
                    "theme": ['Telework'],
                    "desiredDirection": "up",
                    "variance": 0.02,
                    "yearVariance": 0.02,
                    "indicatorType": "daily",
                    "valueType": "number",
                    "divisor": 1000,
                    "decimalAccuracy": null,
                    "yearToDate": "false",
                    "dataSource": "",
                    "hasTarget": "False",
                    "cityPerspective": "",
                    "contact": ""
                },
                config:{
                    unit:'daily'
                },
                options:{
                  title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                  xAxis:'Average Users',
                  yAxis:'Date',
                  scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    
                  },
                },
                direction: '-',
                data:{
                   calculatedValue: '11,833',
                   labels:["City issued devices","hard tokens","soft tokens",],
                   datasets:[
                        { 
                            label:'Availability', "datasetType": "Actual",  
                            data:[8600,2039,1775], 
                        },
                   ]
                }
            },{
                id:'panel-0003',
                label: 'Cisco WebEx',
                caption: 'Current Useage',
                description:`
                    <ul>
                        <li>Current Usage: 500 hosts (calls)</li>
                        <li>Capacity available: 6000* Cisco has given us unlimited surplus usage waiver till May 31</li>
                        <li>Global system is seeing busy signals</li>
                        <li>Cisco has done solution capacity increase for us</li>
                    </ul>
                `,
                body:``,
                category:['Telework'],
                keywords:['cisco'],
                "custom": {
                    "theme": ['Telework'],
                    "desiredDirection": "up",
                    "variance": 0.02,
                    "yearVariance": 0.02,
                    "indicatorType": "daily",
                    "valueType": "number",
                    "divisor": 1000,
                    "decimalAccuracy": null,
                    "yearToDate": "false",
                    "dataSource": "",
                    "hasTarget": "False",
                    "cityPerspective": "",
                    "contact": ""
                },
                config:{
                    unit:'daily'
                },
                options:{
                title: 'Monthly (Year-To-Date) Values for Number of Personal Bankruptcies - (Ontario)',
                xAxis:'Average Users',
                yAxis:'Date',
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    
                },
                },
                direction: '-',
                data:{
                calculatedValue: 500,
                labels:["Capacity"],
                datasets:[
                    { 
                        label:'Current Useage', "datasetType": "Actual",  
                        data:[500], 
                    },{ 
                        label:'Available', "datasetType": "Actual",  
                        data:[6000-500], 
                    },
                ]
                }
            }])
        });
    }
}

//{ label:'Average peak for snow/vacation days ', "datasetType": "Target", data:[1000,1000,1000,1000], type:"line", sum:null },
//{ label:'Previous Normal Daily Peak', "datasetType": "Target",  data:[600,600,600,600], type:"line", sum:null },