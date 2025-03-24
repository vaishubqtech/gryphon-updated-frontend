import React, { useState } from "react";
import "./agentList.css";
import Avatar from "../../assets/images/Frame 1394.png";
import Gold from "../../assets/images/Gold.png";
import Silver from "../../assets/images/silver.png";
import Bronze from "../../assets/images/bronze.png";
import { IconContext } from "react-icons";
import { BiSolidWalletAlt } from "react-icons/bi";

const data = [
  {
    avatar: Avatar,
    name: "Prefrontal Cortex $CONVO",
    wallet: "0x7a5c...8f92",
    marketCap: "$99.9b",
    tvl: "$12.0m",
    volume: "$1.5m",
    change: "+16.4%",
    ranking: Gold,
  },
  {
    avatar: Avatar,
    name: "Trade Master AI $TADS",
    wallet: "0x7a5c...8f92",
    marketCap: "$99.9b",
    tvl: "$12.0m",
    volume: "$1.5m",
    change: "+16.4%",
    ranking: Silver,
  },
  {
    avatar: Avatar,
    name: "ScamURwallet AI $SUWL",
    wallet: "0x7a5c...8f92",
    marketCap: "$99.9b",
    tvl: "$12.0m",
    volume: "$1.5m",
    change: "+16.4%",
    ranking: Bronze,
  },
  {
    avatar: Avatar,
    name: "Bukkake AI $BLAST",
    wallet: "0x7a5c...8f92",
    marketCap: "$99.9b",
    tvl: "$12.0m",
    volume: "$1.5m",
    change: "+16.4%",
    ranking: "4th",
  },
];

const AgentList = () => {
  const [activeSortTab, setActiveSortTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (index, wallet) => {
    navigator.clipboard.writeText(wallet);
    setCopiedIndex(index); // Store copied row index

    setTimeout(() => {
      setCopiedIndex(null); // Hide after 1.5 seconds
    }, 1500);
  };
  return (
    <div className="agent-list-sec">
      <div className="agent-top-flex">
        <div className="agent-flex-head">Top AI Agent</div>
        <div className="agent-tab">
          <div
            className={activeSortTab === 0 ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab(0)}
          >
            Performance
          </div>
          <div
            className={activeSortTab === 1 ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab(1)}
          >
            New
          </div>
          <div
            className={activeSortTab === 2 ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab(2)}
          >
            Popular
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>AI Agent</th>
              <th>Wallet</th>
              <th>Market Cap</th>
              <th>TVL</th>
              <th>24h Volume</th>
              <th>24h Change</th>
              <th>Ranking</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="agent-info">
                    <img src={item.avatar} alt="avatar" className="avatar" />
                    {item.name}
                  </div>
                </td>
                <td className="wallet">
                  {item.wallet}{" "}
                  <span className="copy-btn">
                    <IconContext.Provider
                      value={{
                        size: "1.2em",
                        color: "#8e9099",
                        className: "global-class-name",
                      }}
                    >
                      <div   onClick={() => handleCopy(index, item.wallet)}>
                      <BiSolidWalletAlt />
                      </div>
                    </IconContext.Provider>
                  </span>
                  {copiedIndex === index && (
                  <span className="copied-popup">Copied!</span>
                )}
                </td>
                <td>{item.marketCap}</td>
                <td>{item.tvl}</td>
                <td>{item.volume}</td>
                <td className="change">{item.change}</td>
                <td className={`ranking ${item.ranking.toLowerCase()}`}>
                  {typeof item.ranking === "string" && item.ranking.length <= 3
                    ? item.ranking
                    : <img src={item.ranking} alt="" className="ranking-img"/>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentList;
