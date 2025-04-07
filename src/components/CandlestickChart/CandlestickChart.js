import React, { useEffect, useRef, useState } from 'react';
import "./candleChart.css"
import { createChart } from 'lightweight-charts';

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
                // Transform the API response
                const transformed = data?.data?.map((kline) => ({
                    time: kline.startTimeMilliseconds / 1000,
                    open: parseFloat(kline.openPrice),
                    high: parseFloat(kline.highestPrice),
                    low: parseFloat(kline.lowestPrice),
                    close: parseFloat(kline.closePrice),
                })).sort((a, b) => a.time - b.time);
                console.log("transformed", transformed)
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