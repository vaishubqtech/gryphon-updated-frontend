const axios = require("axios");
// import axios from "axios"

const getHolderCount = async (tokenAddress) => {
  const API_KEY = "UQ8J9JCCS651KGQVFBYI8UAMB1AGQHUBJM";
  const url = `https://api-testnet.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${tokenAddress}&page=1&offset=1&apikey=${API_KEY}`;

  const response = await axios.get(url);
  const totalHolders = response.data.result;
  console.log("Token Holder Count (approx.):", totalHolders);
};

getHolderCount("0x2170Ed0880ac9A755fd29B2688956BD959F933F8");