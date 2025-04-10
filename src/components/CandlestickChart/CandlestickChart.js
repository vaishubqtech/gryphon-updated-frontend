import React, { useEffect, useRef, useState } from 'react';
import "./candleChart.css"
import { createChart } from 'lightweight-charts';
import Web3 from 'web3';

const CandlestickChart = (agentID) => {

    const chartContainerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transformedData, setTransformedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.gryphon.finance/ai/api/v1/agents/${agentID.agentID}/ohlcv`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("chart data", data.data)

     
                const tradeData = data?.data?.map((kline) => ({
                    time: kline.startTimeMilliseconds/ 1000,
                    open: parseFloat(kline.openPrice)*1000,
                    high: parseFloat(kline.highestPrice)*1000,
                    low: parseFloat(kline.lowestPrice)*1000,
                    close: parseFloat(kline.closePrice)*1000,
                    volume:Number(Web3.utils.fromWei(kline.tradingVolume,"ether"))
                })).sort((a, b) => a.time - b.time);

                
                // const tradeData= [
                //     { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
                //     { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
                //     { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
                //     { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
                //     { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
                //     { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
                //     { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
                //     { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
                //     { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
                //     { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
                // ]
                


                console.log("transformed", tradeData)
                setTransformedData(tradeData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#ffffff',
            },
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            priceScale: {
                borderColor: '#cccccc',
            },
            timeScale: {
                borderColor: '#cccccc',
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: true, // Enable borders for better visibility
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

  

        candlestickSeries.setData(transformedData);
        chart.timeScale().fitContent();
        // if (transformedData.length > 0) {

        // } else {
        //     const now = Math.floor(Date.now() / 1000);
        //     candlestickSeries.setData([
        //         {
        //             time: now,
        //             open: 0,
        //             high: 0,
        //             low: 0,
        //             close: 0,
        //         },
        //     ]);
        // }


        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [transformedData]);



    return <div className='chart-container' ref={chartContainerRef}></div>;
};

export default CandlestickChart;