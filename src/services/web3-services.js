import Web3 from "web3";
import config from "../config";


export const createWeb3Object = async () => {
    try {
        const provider = new Web3.providers.HttpProvider(config.RPC_URL);
        const web3Obj = new Web3(provider);
        return web3Obj;
    } catch (error) {
        console.log("Error while creating web3 Object", error);
        return;
    }
};

export const createContractObject = async function (
    web3Obj,
    contractABI,
    contractAddress
  ) {
    try {
      if (web3Obj) {
        const contractObj = new web3Obj.eth.Contract(
          contractABI,
          contractAddress
        );
        return contractObj;
      }
    } catch (error) {
      console.log("Error in web3-utils | createContractObject", error);
      return;
    }
  };

export const getTokenBalance = async (
    contractABI,
    contractAddress,
    walletAddress
) => {
    try {
         if (typeof window !== "undefined" && window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            let result = await contract.methods.balanceOf(walletAddress).call();
            console.log("getBalance", result);
            return result;
        } else {
            throw new Error("Ethereum provider not found.");
        }
    } catch (error) {
        console.log("Error in web3-utils | getTokenBalance", error);
        return;
    }
};

export const convertEthToWei = async function (valueInEth) {
    try {
        let valueInWei = [];
        for (let i = 0; i < valueInEth.length; i++) {
            valueInWei.push(Web3.utils.toWei(valueInEth[i], "ether"));
        }
        return valueInWei;
    } catch (error) {
        console.log("Error in web3-utils | convertEthToWei", error);
        return;
    }
};

export const convertWeiToEth = async function (valueInWei) {
    try {
        let valueInEth = [];

        for (let i = 0; i < valueInWei.length; i++) {
            valueInEth.push(Web3.utils.fromWei(valueInWei[i], "ether"));
        }

        return valueInEth;
    } catch (error) {
        console.log("Error in web3-utils | convertWeiToEth", error);
        return;
    }
};
export const convertGweiToWei = async function (valueInGwei) {
    try {
        let valueInWei = [];
        for (let i = 0; i < valueInGwei.length; i++) {
            valueInWei.push(Web3.utils.toWei(valueInGwei[i], "gwei"));
        }
        return valueInWei;
    } catch (error) {
        console.log("Error in web3-utils | convertGweiToWei", error);
        return;
    }
};

export const convertToChecksum = async function (address) {
    try {
        return Web3.utils.toChecksumAddress(address);
    } catch (error) {
        console.log("Error in web3-utils | convertToChecksum", error);
        return;
    }
};