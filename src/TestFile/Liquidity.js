import React, { useEffect, useState } from "react";
import Web3 from "web3";
import FERC20_ABI from "../abi-v2/fun/FERC20.json"; // Gryphon Token ABI
import BUSD_ABI from "./BUSDAbi.json"; // Token B ABI
import ROUTER_ABI from "../abi-v2/pancake/pancakeRouter.json"


const Liquidity = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);

    const tokenA = "0x0715FBE5F99b72F6eF13FCC48297B42a7E286c05"; // Gryphon
    const tokenB = "0x6CD090b9A04863062050c27364c7f2612ea1f30E"; // Token B
    const to = "0x7B840480898Ee07E987572b38677c2B7E7C38c02";
    const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // PancakeSwap Router

    const amountADesired = Web3.utils.toWei("100", "ether");  // 100 tokens
    const amountBDesired = Web3.utils.toWei("200", "ether");  // 200 tokens
    const amountAMin = "0";
    const amountBMin = "0";
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
            } else {
                alert("MetaMask not found. Please install it to continue.");
            }
        };

        initWeb3();
    }, []);

    const approveToken = async (tokenAddress, label) => {
        try {
            let abi;

            if (tokenAddress.toLowerCase() === tokenA.toLowerCase()) {
                abi = FERC20_ABI.abi;
            } else if (tokenAddress.toLowerCase() === tokenB.toLowerCase()) {
                abi = BUSD_ABI;
            } else {
                throw new Error("Unsupported token address");
            }

            const tokenContract = new web3.eth.Contract(FERC20_ABI.abi, "0x0715FBE5F99b72F6eF13FCC48297B42a7E286c05");
            const txBalance = await tokenContract.methods.balanceOf("0x03c4cbD7FC4b1d5e2E3EA1286abB9C3EEF95C9Ea").call();
            console.log("txBalance", txBalance);
            const totalSupply = await tokenContract.methods.totalSupply().call()
            console.log("totalSupply", totalSupply);
            console.log("totalSupply", Web3.utils.fromWei(totalSupply,"ether"));

            //   const tx = await tokenContract.methods
            //     .approve(routerAddress, Web3.utils.toWei("1000", "ether"))
            //     .send({ from: account });

            //   console.log(`✅ Approved ${label}:`, tx);
            alert(`Approved ${label} successfully!`);
        } catch (error) {
            console.error(`❌ Approval failed for ${label}:`, error);
            alert(`Approval failed for ${label}`);
        }
    };



    const addLiquidity = async () => {
        try {
            const router = new web3.eth.Contract(ROUTER_ABI, routerAddress);

            const tx = await router.methods
                .addLiquidity(
                    tokenA,
                    tokenB,
                    amountADesired,
                    amountBDesired,
                    amountAMin,
                    amountBMin,
                    to,
                    deadline
                )
                .send({ from: account });

            console.log("✅ Liquidity added:", tx);
            alert("Liquidity pool created successfully!");
        } catch (error) {
            console.error("❌ Error adding liquidity:", error);
            alert("Failed to add liquidity.");
        }
    };

    return (
        <div style={{ padding: 20, minHeight: "70vh" }}>
            <h2>🧪 PancakeSwap Testnet – Add Liquidity</h2>
            {account ? (
                <>
                    <p>🔗 Connected Wallet: <b>{account}</b></p>

                    <button onClick={() => approveToken(tokenA, "Token A (Gryphon)")}>
                        Approve Token A (Gryphon)
                    </button>
                    <br /><br />

                    <button onClick={() => approveToken(tokenB, "Token B")}>
                        Approve Token B
                    </button>
                    <br /><br />

                    <button onClick={addLiquidity}>💧 Add Liquidity</button>
                </>
            ) : (
                <p>🦊 Waiting for MetaMask connection...</p>
            )}
        </div>
    );
};

export default Liquidity;

