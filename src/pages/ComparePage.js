import React,{useEffect, useState} from "react";
import Header from "../components/Common/Header";
import SelectCoins from "../components/Compare/SelectCoins";
import SelectDays from "../components/Coin/SelectDays"
import { getCoinPrices } from "../functions/getCoinPrices";
import { getCoinData } from "../functions/getCoinData";
import { convertObject } from "../functions/convertObject";
import List from "../components/Dashboard/List";
import CoinInfo from "../components/Coin/CoinInfo";
import { settingChartData } from "../functions/settingChartData";
import LineChart from "../components/Coin/LineChart";
import PriceType from "../components/Coin/PriceType";
const ComparePage=()=>{
    const [crypto1,setCrypto1]=useState("bitcoin")
    const [crypto2,setCrypto2]=useState("ethereum")
    const[crypto1Data,setCrypto1Data]=useState({})
    const[crypto2Data,setCrypto2Data]=useState({})
    const[priceType,setPriceType]=useState("prices")
    const [days,setDays]=useState(30);
    const [isLoading,setLoading]=useState(false)
    const [chartData,setChartData]=useState();

    useEffect(()=>{
        getData()
    },[])
    async function getData(){
        setLoading(true)
        const data1=await getCoinData("bitcoin");
        const data2=await getCoinData("ethereum");
        console.log("data1",data1)
        console.log("data2",data2)
        if(data1){
            convertObject(setCrypto1Data,data1)
            
            

        }
        if(data2){
            convertObject(setCrypto2Data,data2)
            
            

        }
        if(data1&&data2){
            console.log("crypto1",crypto1)
            console.log("crypto2",crypto2)
            const prices1=await getCoinPrices(crypto1,30,priceType);
            const prices2=await getCoinPrices(crypto2,30,priceType);
            
            if(prices1.length>0&&prices2.length>0){
           settingChartData(setChartData,prices1,prices2)
         
              setLoading(false)
            }
            

        }

    }

   async function handleDaysChange(event){
    setLoading(true)
        setDays(event.target.value)
        const prices1=await getCoinPrices(crypto1,event.target.value,priceType);
                const prices2=await getCoinPrices(crypto2,event.target.value,priceType);
                settingChartData(setChartData,prices1,prices2)
             setLoading(false)
    }
    const handleCoinChange= async(event, isCrypto2)=>{
        setLoading(true)
        if(isCrypto2){
            setCrypto2(event.target.value)
          
            const data=await getCoinData(event.target.value);
            if(data){
              
                convertObject(setCrypto2Data,data);
                const prices1=await getCoinPrices(crypto1,days,priceType);
                const prices2=await getCoinPrices(crypto2,days,priceType);
                settingChartData(setChartData,prices1,prices2)
             
              }
        }
        else{
            setCrypto1(event.target.value)
            const data=await getCoinData(event.target.value);
            if(data){
              
             convertObject(setCrypto1Data,data);
             const prices1=await getCoinPrices(crypto1,days,priceType);
                const prices2=await getCoinPrices(crypto2,days,priceType);
                settingChartData(setChartData,prices1,prices2)
             
            }
        }
       
    }


    const handlePriceTypeChange = async (event, newType) => {
        setLoading(true);
        setPriceType(newType);
  
        const prices1=await getCoinPrices(crypto1,days,newType);
                const prices2=await getCoinPrices(crypto2,days,newType);
                settingChartData(setChartData,prices1,prices2)
            }

    return(<div>
        <Header/>

        <div className="grey-wrapper"
    ><List coin={crypto1Data}/>
   
     </div>
     <div className="grey-wrapper"
    ><List coin={crypto2Data}/>
   
     </div>
        <div className="coins-days-flex">
        <SelectCoins crypto1={crypto1} crypto2={crypto2}
      handleCoinChange={handleCoinChange}/>
        <SelectDays days={days} handleDaysChange={handleDaysChange}/>
        </div>
        <PriceType priceType={priceType}
       handlePriceTypeChange={handlePriceTypeChange}/>
    <LineChart chartData={chartData} priceType={priceType} multiAxis={true}/>
        <CoinInfo heading={crypto1Data.name} 
    desc={crypto1Data.desc}/>
     <CoinInfo heading={crypto2Data.name} 
    desc={crypto2Data.desc}/>
    </div>)
}

export default ComparePage;