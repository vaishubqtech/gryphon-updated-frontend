import React, { useEffect, useState } from "react";
import "./agentList.css";
import Avatar from "../../assets/images/Frame 1394.png";
import Gold from "../../assets/images/Gold.png";
import Silver from "../../assets/images/silver.png";
import Bronze from "../../assets/images/bronze.png";
import { IconContext } from "react-icons";
import { BiSolidWalletAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAllAgents } from "../../services/APIManager";
import Cookies from "js-cookie";
import moment from "moment";
import { getEllipsisTxt } from '../../utils/formatter';
import Web3 from 'web3';


const data = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  const navigate = useNavigate();
  const [activeSortTab, setActiveSortTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [agents, setAgents] = useState([]);

  const handleCopy = (index, wallet) => {
    navigator.clipboard.writeText(wallet);
    setCopiedIndex(index); // Store copied row index

    setTimeout(() => {
      setCopiedIndex(null); // Hide after 1.5 seconds
    }, 1500);
  };


  useEffect(() => {
    fetchAgents();
  }, [ ]);


  const fetchAgents = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await getAllAgents(token);
      console.log("response", response)
      if (response.success) {
        setAgents(response.data);
      }
    } catch (err) {
      console.log("error in get All agents", err)
    } finally {
    }
  };
  const convertTimestampToRelativeTime = (timestamp) => {
    return moment.unix(timestamp).fromNow();
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
              <th>Address</th>
              <th>Market Cap</th>
              <th>TVL</th>
              <th>24h Volume</th>
              <th>24h Change</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
          {agents?.length > 0 ? (agents?.map((item, index) => {
              const relativeTime = convertTimestampToRelativeTime(item?.createdTimestamp);
              return (
                <tr key={index} style={{ cursor: "pointer" }} onClick={() => navigate(`/detail-screen/${item._id}`)}>
                  <td>
                    <div className="agent-info">
                      <img src={item.profileImage? item.profileImage : "https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg" } alt="avatar" className="avatar-dash" />
                      {item.name}
                    </div>
                  </td>
                  <td className="wallet">
                    {item.erc20Address ? getEllipsisTxt (item.erc20Address,6) : 'Wallet Address'}{" "}
                    <span className="copy-btn">
                      <IconContext.Provider
                        value={{
                          size: "1.2em",
                          color: "#8e9099",
                          className: "global-class-name",
                        }}
                      >
                        <div onClick={() => handleCopy(index, item.erc20Address)}>
                          <BiSolidWalletAlt />
                        </div>
                      </IconContext.Provider>
                    </span>
                    {copiedIndex === index && (
                      <span className="copied-popup">Copied!</span>
                    )}
                  </td>
                  <td>{item.marketCap? parseFloat(Web3.utils.fromWei(item.marketCap, "ether"))  : 0}</td>
                  <td>{item.tvl ? parseFloat(Web3.utils.fromWei(item.tvl, "ether")) : 0}</td>
                  <td>{item.volume ?parseFloat(Web3.utils.fromWei(item.volume , "ether")) : 0}</td>
                  <td className="change">{item.change ?  parseFloat(Web3.utils.fromWei(item.change , "ether")) : 0}</td>
                  {/* <td className={`ranking ${item?.ranking.toLowerCase()}`}>
                  {typeof item.ranking === "string" && item.ranking.length <= 3
                    ? item.ranking
                    : <img src={item.ranking} alt="" className="ranking-img"/>}
                </td> */}
                  <td>
                    {relativeTime}
                  </td>
                </tr>
              )
            })  ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentList;
