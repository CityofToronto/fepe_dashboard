class AffordableHousingData{
    constructor(){}

    getHousingNowData(){
        return Promise.resolve({
            chartOptions:{
                showCount: true
            },
            chartData:{
                labels:['Estimated Affordable Units', 'Est. No. of Units'],
                datasets:[
                    {
                        label:'Est. No. of Units',
                        data:[254,254],
                        backgroundColor:['#83988E']
                    }
                ]
            }
        })        
    }

    getCityOpenDoorIncentiveData(){
        const IncentiveTotal = 481046105.70;
        const CapitalFunding = 109931150.90;

        return Promise.resolve({
            chartData:{
                labels:['Open Door Incentive','Capital Funding'],
                datasets:[
                    {
                        label:'City Funding Contributions',
                        data:[210000,0],
                        backgroundColor:['#9DC9AC','#FF9D2E']
                    }
                ]
            }
        })
    }

    getHousingProjectData(){
        return Promise.resolve({
            chartData:{
                labels:['2019','2020','2021','2022','2023','2024','2025','2026'],
                datasets:[
                    {
                        label:'Housing Now Iniative (Owned Units)',
                        data:[0,0,0,0,0,254+412+90+771,233+331+465+419,35+603+95],
                        backgroundColor:['#13747D']
                    },{
                        label:'Open Door Affordable Housing Program (Homes)',
                        data:[0,0,32+159+30,106+63,24,0,0,0],
                        backgroundColor:['#929073']
                    },{
                        label:'Open Door Affordable Housing Program (Rental Units)',
                        data:[6+16+20+82+2+33+24,22+33+47+120+50+127+4+17,32+159+30+35+36+186+26+150+120+423+50+12+100+20,24+12+50+33+257+106+76+85+215+150+63,24+65+64+100+21+390,0,0,0],
                        backgroundColor:['#8F4D65']
                    }
                ]
            }
        })
    }
    

    getHousingProjectByUnitData(){
        return Promise.resolve({
            chartData:{
                labels:['Housing Now Iniative (Owned Units)','Open Door Affordable Housing Program (Homes)','Open Door Affordable Housing Program (Rental Units)'],
                datasets:[
                    {
                        label:'Housing Now Iniative (Owned Units)',
                        data:[254+412+90+771+233+331+465+419+35+603+95, 32+159+30+106+63+24, 6+16+20+82+2+33+24+22+33+47+120+50+127+4+17+32+159+30+35+36+186+26+150+120+423+50+12+100+20+24+12+50+33+257+106+76+85+215+150+63+24+65+64+100+21+390],
                        backgroundColor:['#13747D','#929073','#8F4D65']
                    }
                ]
            }
        })
    }

    getHousingProjectByOwnershipData(){
        return Promise.resolve({
            chartData:{
                labels:['Owned Units','Rental Units'],
                datasets:[
                    {
                        label:'Est. Units By 2026',
                        data:[3708, 7730],
                        backgroundColor:['#A8A39D','#D8C8B8']
                    }
                ]
            }
        })
    }
}