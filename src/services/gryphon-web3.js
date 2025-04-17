import Web3 from "web3";
import config from "../config";
import TokenABI from "../contract-abi/gryphon-token.abi.json"
import BondingABI from "../contract-abi/gryphon-bonding.abi.json"
import RouterABI from "../contract-abi/gryphon-router.abi.json"


//version2 ABI

import ERC20ABI from "../abi-v2/fun/FERC20.json";
import BondingV2ABI from "../abi-v2/fun/Bonding.json"
import RouterV2ABI from "../abi-v2/fun/FRouter.json"


export const requiredGryphonAmount = async () => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingABI, config.bonding_contract_address);
        let result = await contract.methods.requiredGryphonAmount().call();
        console.log("requiredGryphonAmount", result);
        return result;
    } catch (e) {
        console.log("error in requiredGryphonAmount", e)
        return;
    }
}

export const approveFactory = async (gryphonAmountInWei, walletAddress) => {
    console.log("---", gryphonAmountInWei, walletAddress)
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, config.gryphon_token_address);
        let result = await contract.methods.approve(config.bonding_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveFactory", e)
        return;
    }
}

export const LaunchAgent = async (name, ticker, cores, desc, img, twitter, telegram, youtube, website, purchaseAmt, walletAddress) => {
    try {
        let urls = [twitter, telegram, youtube, website]
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.launch(name, ticker, cores, desc, img, urls, purchaseAmt).send({ from: walletAddress });
        console.log("createAgent", result);
        return result;
    } catch (e) {
        console.log("error in createAgent", e)
        return;
    }
}

// tw.te.y,w =>SL


export const amountOutValue = async (agentERC20Addr, GryphonAddrOrZerothAddr, tradeAmtInwei, walletAddress) => {
    try {
        console.log("Calling getAmountsOut with:", {
            agentERC20Addr,
            GryphonAddrOrZerothAddr,
            tradeAmtInwei,
        });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(RouterV2ABI.abi, config.routing_contract_address);
        let result = await contract.methods.getAmountsOut(agentERC20Addr, GryphonAddrOrZerothAddr, tradeAmtInwei).call();
        console.log("amountOutValue", result);
        return result;
    } catch (e) {
        console.log("error in amountOutValue", e)
        return;
    }
}

//approve [bonding,gry cont addr] => foramt of gryp

export const buyApprove = async (gryphonAmountInWei, walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, config.gryphon_token_address);
        let result = await contract.methods.approve(config.routing_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveTrade", e)
        return;
    }
}

export const buyTrade = async (buyAmtInwei, agentERC20Addr, walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.buy(buyAmtInwei, agentERC20Addr).send({ from: walletAddress });
        console.log("buyTrade", result);
        return result;
    } catch (e) {
        console.log("error in buyTrade", e)
        return;
    }
}

// //approve [bonding,agent token addr] => foramt of gryp

export const sellApprove = async (gryphonAmountInWei,agentERC20Addr ,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, agentERC20Addr);
        let result = await contract.methods.approve(config.routing_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveFactory", e)
        return;
    }
}
export const sellTrade = async (sellAmtInwei,agentERC20Addr ,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.sell(sellAmtInwei,agentERC20Addr).send({ from: walletAddress });
        console.log("sellTrade", result);
        return result;
    } catch (e) {
        console.log("error in sellTrade", e)
        return;
    }
}


export const getTokenBalance = async (
    walletAddress
) => {
    try {

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, config.gryphon_token_address);
        let result = await contract.methods.balanceOf(walletAddress).call();
        // console.log("getBalance", result);
        return result;

    } catch (error) {
        console.log("Error in web3-utils | getTokenBalance", error);
        return;
    }
};
export const getAgentTokenBalance = async (
    agentERC20Addr,
    walletAddress
) => {
    try {

        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi,agentERC20Addr);
        let result = await contract.methods.balanceOf(walletAddress).call();
        // console.log("getBalance", result);
        return result;

    } catch (error) {
        console.log("Error in web3-utils | getTokenBalance", error);
        return;
    }
};

export const tokenInfo = async (erc20Addr ) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.tokenInfo(erc20Addr).call();
        console.log("smart contract tokenInfo", result);
        return result;
    } catch (e) {
        console.log("error in tokenInfo", e)
        return;
    }
}
export const userTokenList = async (walletAddress ) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.getUserTokens(walletAddress).call();
        console.log("walletAddress", result);
        return result;
    } catch (e) {
        console.log("error in walletAddress", e)
        return;
    }
}



export const getTokenTransferAmount = async (txHash, targetAddress) => {
    try {
        const web3 = new Web3(window.ethereum);

      const receipt = await web3.eth.getTransactionReceipt(txHash);
  
        console.log(" -------### getTokenTransferAmount receipt" , receipt.logs)

      const transferEventABI = ERC20ABI.abi.find(
        (item) => item.name === "Transfer" && item.type === "event"
      );
  
      if (!transferEventABI) {
        throw new Error("Transfer event ABI not found");
      }
  
      for (let log of receipt.logs) {
        const isTransferEvent =
          log.topics[0].toLowerCase() ===
          web3.eth.abi.encodeEventSignature(transferEventABI).toLowerCase();
  
        if (isTransferEvent) {
          const decodedLog = web3.eth.abi.decodeLog(
            transferEventABI.inputs,
            log.data,
            log.topics.slice(1)
          );
  
          if (
            decodedLog?.to?.toLowerCase() === targetAddress.toLowerCase()
          ) {
            const rawValue = decodedLog.value?.toString();
            if (!rawValue) {
              throw new Error("Decoded value is undefined or invalid");
            }
  
            const amount = web3.utils.fromWei(rawValue, "ether");
            console.log(`Token received: ${amount}`);
            return amount;
          }
        }
      }
  
      return "No matching transfer found.";
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  };
  
  