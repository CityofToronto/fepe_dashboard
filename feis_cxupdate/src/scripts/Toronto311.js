class Toronto311{
    constructor(){}

    getGeneralInquiriesData(){
        return Promise.resolve({
            chartOptions:{},
            chartData:{
                labels:['2019 Q1','2019 Q2','2019 Q3'],
                datasets:[
                    {
                        id:'A',
                        label:'General Information Requests',
                        data:[190437,220729,170993],
                        backgroundColor:['#83988E']
                    },
                    {
                        id:'B',
                        label:'Service Requests (include Facilities booking)',
                        data:[130743,129706,47579],
                        backgroundColor:['#BCDEA5']
                    },
                    {
                        id:'C',
                        label:'General Information Requests',
                        data:[190437,220729,170993],
                        backgroundColor:['#83988E']
                    },
                    {
                        id:'C',
                        label:'Service Requests (include Facilities booking)',
                        data:[130743,129706,47579],
                        backgroundColor:['#BCDEA5']
                    }
                ]
            }
        })
    }

    getGeneralInquiriesData(){
        return Promise.resolve({
            chartData:{
                labels:['2019 Q1','2019 Q2','2019 Q3'],
                datasets:[
                    {
                        label:'General Information Requests',
                        data:[190437,220729,170993],
                        backgroundColor:['#83988E']
                    },{
                        label:'Service Requests (include Facilities booking)',
                        data:[130743,129706,47579],
                        backgroundColor:['#BCDEA5']
                    }
                ]
            }
        })
    }

    getServiceRequestsData(){
        return Promise.resolve({
            chartData:{
                labels:['2019 Q1','2019 Q2','2019 Q3'],
                datasets:[
                    {
                        label:'General Information Requests',
                        data:[190437,220729,170993],
                        backgroundColor:['#13747D']
                    },{
                        label:'Service Requests (include Facilities booking)',
                        data:[130743,129706,47579],
                        backgroundColor:['#0ABFBC']
                    }
                ]
            }
        })
    }


    getContactCentreData(){
        return Promise.resolve({
            chartData:{
                labels:['2019 Q1','2019 Q2','2019 Q3'],
                datasets:[
                    {
                        label:'General Information Requests',
                        data:[190437,220729,170993],
                        backgroundColor:['#5D4157']
                    },{
                        label:'Service Requests (include Facilities booking)',
                        data:[130743,129706,47579],
                        backgroundColor:['#A8CABA']
                    }
                ]
            }
        })
    }

    getOnlineData(setName){
        console.log('GET ONLINE DATA', setName);

        let dataset =[
            {
                chartOptions:{
                    showCount: true,
                },
                chartData:{
                    labels:['2019 Q1','2019 Q2','2019 Q3'],
                    datasets:[
                        {
                            label:'Public Online Knowledge Base Views',
                            data:[495769,686112,515148],
                            backgroundColor:['#452632','#91204D','#E4844A']
                        }
                    ]
                }
            },{
                chartOptions:{
                    showCount: true,
                },
                chartData:{
                    labels:['2019 Q1','2019 Q2','2019 Q3'],
                    datasets:[
                        {
                            label:'Service Requests',
                            data:[12425,13261,9077],
                            backgroundColor:['#452632','#91204D','#E4844A']//backgroundColor:['#605951','#61A6AB','#ACCEC0']
                        }
                    ]
                }
            }
        ]
        if(setName == 'setOne') return Promise.resolve(dataset[0]);
        if(setName == 'setTwo') return Promise.resolve(dataset[1]);
    }
}