import React, { useEffect, useState } from "react";
import "./agentList.css";
import { FaSortDown } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { BiSolidWalletAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAllAgents } from "../../services/APIManager";
import Cookies from "js-cookie";
import moment from "moment";
import { getEllipsisTxt, truncateString } from '../../utils/formatter';
import Web3 from 'web3';


const AgentList = () => {
  const navigate = useNavigate();
  const [activeSortTab, setActiveSortTab] = useState("performance");
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
  }, [activeSortTab]);

  function formatNumberStr(numStr) {
    const num = parseFloat(numStr);
    return Number.isInteger(num) ? num : Number(num.toFixed(3));
  }

  const fetchAgents = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await getAllAgents(activeSortTab, token);
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
            className={activeSortTab === "performance" ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab("performance")}
          >
            Performance
          </div>
          <div
            className={activeSortTab === "new" ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab("new")}
          >
            New
          </div>
          <div
            className={activeSortTab === "popular" ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveSortTab("popular")}
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
              <th><div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}> <div>Market Cap</div> <div> {activeSortTab === "performance" && <IconContext.Provider
                value={{
                  size: "0.8em",
                  color: "#fff",
                  className: "global-class-name",
                }}
              >
                <div style={{ marginLeft: 5 }}>
                  <FaSortDown />
                </div>
              </IconContext.Provider>} </div></div></th>
              <th><div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}> <div>TVL</div> <div> {activeSortTab === "popular" && <IconContext.Provider
                value={{
                  size: "0.8em",
                  color: "#fff",
                  className: "global-class-name",
                }}
              >
                <div style={{ marginLeft: 5 }}>
                  <FaSortDown />
                </div>
              </IconContext.Provider>} </div></div></th>
              <th>24h Volume</th>
              <th>24h Change</th>
              <th><div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}> <div>Created At</div> <div> {activeSortTab === "new" && <IconContext.Provider
                value={{
                  size: "0.8em",
                  color: "#fff",
                  className: "global-class-name",
                }}
              >
                <div style={{ marginLeft: 5 }}>
                  <FaSortDown />
                </div>
              </IconContext.Provider>} </div></div></th>
            </tr>
          </thead>
          <tbody>
            {agents?.length > 0 ? (agents?.map((item, index) => {
              const relativeTime = convertTimestampToRelativeTime(item?.createdTimestamp);
              return (
                <tr key={index} style={{ cursor: "pointer" }} onClick={() => navigate(`/detail-screen/${item.agentId}`)}>
                  <td>
                    <div className="agent-info">
                      <img src={item.profileImage ? item.profileImage : "https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg"} alt="avatar" className="avatar-dash" />
                     <span style={{textAlign:'left'}} >{ truncateString(item.name) } </span> 
                    </div>
                  </td>
                  <td className="wallet">
                    {item.erc20Address ? getEllipsisTxt(item.erc20Address, 6) : 'Wallet Address'}{" "}
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
                  <td>{item?.stats?.marketCap ? formatNumberStr(Web3.utils.fromWei(item?.stats?.marketCap, "ether")) : 0}</td>
                  <td>{item?.stats?.liquidity ? formatNumberStr(Web3.utils.fromWei(item?.stats?.liquidity, "ether")) : 0}</td>
                  <td>{item?.stats?.volume24h ? formatNumberStr(Web3.utils.fromWei(item?.stats?.volume24h, "ether")) : 0}</td>
                  <td
                    className={`change ${formatNumberStr(item?.stats?.priceChange24h) > 0
                      ? 'text-green-500'
                      : formatNumberStr(item?.stats?.priceChange24h) < 0
                        ? 'text-red-500'
                        : ''
                      }`}
                  >
                    {item?.stats?.priceChange24h
                      ? Number.isInteger(formatNumberStr(item.stats.priceChange24h))
                        ? parseInt(item.stats.priceChange24h)
                        : formatNumberStr(item.stats.priceChange24h)
                      : 0}
                  </td>
              
                  <td>
                    {relativeTime}
                  </td>
                </tr>
              )
            })) : (
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
