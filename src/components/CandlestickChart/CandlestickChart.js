import React, { useEffect, useRef, useState } from "react";
import "./candleChart.css";
import { createChart } from "lightweight-charts";
import Web3 from "web3";
// import tradeData from "../../utils/ohlcv_data.json"

const CandlestickChart = (agentID) => {
  const chartContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.gryphon.finance/ai/api/v1/agents/${agentID.agentID}/ohlcv?granularity=1m`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("chart data", data.data);
        const tradeData = data?.data
          ?.map((kline) => ({
            time: kline.startTimeMilliseconds / 1000,
            open: parseFloat(kline.openPrice),
            high: parseFloat(kline.highestPrice),
            low: parseFloat(kline.lowestPrice),
            close: parseFloat(kline.closePrice),
            volume: Number(Web3.utils.fromWei(kline.tradingVolume, "ether")),
          }))
          .sort((a, b) => a.time - b.time);
        console.log("transformed", tradeData);
        setTransformedData(tradeData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [agentID]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#aaa",
      },
      grid: {
        vertLines: {
          color: "#2a2e39",
          visible: true,
        },
        horzLines: {
          color: "#2a2e39",
          visible: true,
        },
      },
      rightPriceScale: {
        autoScale: true,
        visible: true,
        borderColor: "#cccccc",
        borderVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        textColor: "#aaa",
        mode: 0,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: "#cccccc",
        visible: true,
      },
      localization: {
        priceFormatter: (price) => Number(price).toFixed(9),
      },
    });
    chart.priceScale("right").applyOptions({
      visible: true,
      borderVisible: true,
      entireTextOnly: false,
      drawTicks: true,
      ticksVisible: true,
      tickMarkFormatter: (price) => {
        if (price < 0.00001) {
          return price.toFixed(9);
        }
        return price.toFixed(5);
      },
      // Try to force more price levels to appear
      minMove: 0.000000001,
    });
    chart.applyOptions({
      priceScale: {
        autoScale: true,
        mode: 0,
        alignLabels: true,
        borderVisible: true,
        ticksVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });
    // Create the candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    // candlestickSeries.applyOptions({
    //     priceScale: {
    //         scaleMargins: {
    //             top: 0.1,
    //             bottom: 0.3,
    //         },
    //     },
    // });

    // Set data for candlestick chart
    candlestickSeries.setData(transformedData);

    // chart.timeScale().fitContent();

    // Resize handler for responsiveness
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [transformedData]);

  return <div className="chart-container" ref={chartContainerRef}></div>;
};

export default CandlestickChart;
