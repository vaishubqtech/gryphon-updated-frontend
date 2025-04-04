import React, { useEffect, useRef, useState } from 'react';
import "./candleChart.css"
import { createChart } from 'lightweight-charts';

const CandlestickChart = () => {
    const chartContainerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transformedData, setTransformedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch(
                //     'https://vp-api.virtuals.io/vp-api/klines?tokenAddress=0xFE86aBCD1ac5Bfcbf31c94d7437d548a529E4C76&granularity=60&start=1741176575000&end=1741781375000&limit=1000&chainID=0'
                // );

                // if (!response.ok) {
                //     throw new Error(`HTTP error! Status: ${response.status}`);
                // }

                // const data = await response.json();

                // Transform the API response
                // const transformed = data.data.Klines.map((kline) => ({
                //     time: kline.startInMilli / 1000, 
                //     open: parseFloat(kline.open),
                //     high: parseFloat(kline.high),
                //     low: parseFloat(kline.low),
                //     close: parseFloat(kline.close),
                // })).sort((a, b) => a.time - b.time); 

                const apiResponse = {
                    "success": true,
                    "data": {
                        "s": "ok",
                        "t": [
                            1742306908,
                            1741892469,
                            1742676960,
                            1741655932,
                            1742424036,
                            1742233538,
                            1742654173,
                            1742412506,
                            1742954842,
                            1742862053,
                            1741580889,
                            1742445589,
                            1742839314,
                            1742660200,
                            1742106380,
                            1741902284,
                            1742278651,
                            1741869495,
                            1741687108,
                            1742036315,
                            1742220013


                        ],
                        "o": [
                            "1000",
                            "10",
                            "100",
                            "50",
                            "150",
                            "150",
                            "950",
                            "1000",
                            "10",
                            "100",
                            "50",
                            "150",
                            "150",
                            "950",
                            "1000",
                            "10",
                            "100",
                            "50",
                            "150",
                            "150",
                            "950",
                        ],
                        "h": [
                            "1.5",
                            "180",
                            "190",
                            "170",
                            "150",
                            "150",
                            "150",
                            "1.5",
                            "180",
                            "190",
                            "170",
                            "150",
                            "150",
                            "150",
                            "1.5",
                            "180",
                            "190",
                            "170",
                            "150",
                            "150",
                            "150",
                        ],
                        "l": [
                            "0.005",
                            "150",
                            "100",
                            "150",
                            "190",
                            "150",
                            "185",
                            "0.005",
                            "150",
                            "100",
                            "150",
                            "190",
                            "150",
                            "185",
                            "0.005",
                            "150",
                            "100",
                            "150",
                            "190",
                            "150",
                            "185",
                        ],
                        "c": [
                            "150",
                            "100",
                            "1200",
                            "150",
                            "750",
                            "0.7",
                            "160",
                            "150",
                            "100",
                            "1200",
                            "150",
                            "750",
                            "0.7",
                            "160",
                            "150",
                            "100",
                            "1200",
                            "150",
                            "750",
                            "0.7",
                            "160",
                        ],
                        "v": [
                            "500",
                            "100",
                            "100",
                            "200",
                            "100",
                            "200",
                            "100",
                            "500",
                            "100",
                            "100",
                            "200",
                            "100",
                            "200",
                            "100",
                            "500",
                            "100",
                            "100",
                            "200",
                            "100",
                            "200",
                            "100",
                        ]
                    }
                };

                const transformed = apiResponse.data.t.map((timestamp, index) => ({
                    time: timestamp,
                    open: parseFloat(apiResponse.data.o[index]),
                    high: parseFloat(apiResponse.data.h[index]),
                    low: parseFloat(apiResponse.data.l[index]),
                    close: parseFloat(apiResponse.data.c[index])
                })).sort((a, b) => a.time - b.time);


                setTransformedData(transformed);
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
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
    
        // if (transformedData.length > 0) {
        //     // ✅ Show actual data if available
        //     candlestickSeries.setData(transformedData);
        //     chart.timeScale().fitContent();
        // } else {}
            const now = Math.floor(Date.now() / 1000);
            candlestickSeries.setData([
                {
                    time: now, 
                    open: 0,
                    high: 0,
                    low: 0,
                    close: 0,
                },
            ]);
    
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