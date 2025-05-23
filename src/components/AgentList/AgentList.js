import React, { useEffect, useState } from "react";
import "./agentList.css";
import { FaSortDown } from "react-icons/fa6";
import { IconContext } from "react-icons";
import { BiSolidWalletAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getAgentsBySearch, getAllAgents } from "../../services/APIManager";
import Cookies from "js-cookie";
import moment from "moment";
import { getEllipsisTxt, truncateString } from '../../utils/formatter';
import Web3 from 'web3';


const AgentList = ({ searchQuery }) => {
  const navigate = useNavigate();
  const [activeSortTab, setActiveSortTab] = useState("new");
  const [activeListTab, setActiveListTab] = useState("prototype");
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
    const rounded = Number.isInteger(num) ? num : Number(num.toFixed(0));

    if (rounded >= 1_000_000_000) {
      return `$${(rounded / 1_000_000_000).toFixed(1)}B`;
    } else if (rounded >= 1_000_000) {
      return `$${(rounded / 1_000_000).toFixed(1)}M`;
    } else if (rounded >= 1_000) {
      return `$${(rounded / 1_000).toFixed(0)}K`;
    }

    return `$${rounded}`;
  }


  function getFormattedValue(rawValueInWei) {
    // Only convert if it's actually in Wei (big integer string)
    if (!rawValueInWei || isNaN(rawValueInWei)) return "$0";

    try {
      // If it's already a small number (e.g. < 1e18), just use it directly
      const value =
        Number(rawValueInWei) > 1e18
          ? Web3.utils.fromWei(rawValueInWei.toString(), "ether")
          : rawValueInWei;

      return formatNumberStr(value);
    } catch (err) {
      console.error("Error formatting value:", err);
      return "$0";
    }
  }



  const fetchAgents = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await getAllAgents(activeSortTab, token);
      console.log("fetchAgents response", response)
      if (response.success) {
        setAgents(response?.data);
      }
    } catch (err) {
      console.log("error in get All agents", err)
    } finally {
    }
  };


  useEffect(() => {
    if (searchQuery) {
      searchAgents()
    }
  }, [searchQuery])

  const searchAgents = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await getAgentsBySearch(searchQuery, token);
      console.log(" searchAgents response", response)
      setAgents(response.data.agents)
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
      <div className="agent-flex-head" style={{ marginBottom: 25 }}>Top AI Agent</div>

      <div className="agent-top-flex">
        <div className="agent-tab">
          <div
            className={activeListTab === "prototype" ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveListTab("prototype")}
          >
            Pre-bonded
          </div>
          <div
            className={activeListTab === "sentient" ? "sort-tab-active" : "sort-tab"}
            onClick={() => setActiveListTab("sentient")}
          >
            Bonded
          </div>

        </div>
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

      {activeListTab === "prototype" ?
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>AI Agent</th>
                <th>Address</th>
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>Market Cap</div> <div> {activeSortTab === "performance" && <IconContext.Provider
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
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>TVL</div> <div> {activeSortTab === "popular" && <IconContext.Provider
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
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>Created At</div> <div> {activeSortTab === "new" && <IconContext.Provider
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
                        <span style={{ textAlign: 'left' }} >{truncateString(item.name)} </span>
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

                    <td>{getFormattedValue(item?.stats?.marketCap)}</td>
                    <td>{getFormattedValue(item?.stats?.liquidity)}</td>
                    <td>{getFormattedValue(item?.stats?.volume24h)}</td>



                    <td
                      className={`change ${(item?.stats?.priceChange24h) > 0
                        ? 'text-green-500'
                        : (item?.stats?.priceChange24h) < 0
                          ? 'text-red-500'
                          : ''
                        }`}
                    >
                      {item?.stats?.priceChange24h
                        ? Number.isInteger((item.stats.priceChange24h))
                          ? parseInt(item.stats.priceChange24h)
                          : (item.stats.priceChange24h)
                        : 0}%
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

        :
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>AI Agent</th>
                <th>Address</th>
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>Market Cap</div> <div> {activeSortTab === "performance" && <IconContext.Provider
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
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>TVL</div> <div> {activeSortTab === "popular" && <IconContext.Provider
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
                <th><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div>Created At</div> <div> {activeSortTab === "new" && <IconContext.Provider
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

              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                  No agents found
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      }
    </div>
  );
};

export default AgentList;
