// src/hooks/useBondingEstimation.js
import { useEffect, useState } from "react";
import Web3 from "web3";
import bondingAbi from "../abi-v2/fun/Bonding.json"
import factoryAbi from "../abi-v2/fun/FFactory.json"
import BN from 'bn.js';


export const useBondingEstimation = (bondingAddress, factoryAddress, rawAmountInWei) => {
    const [output, setOutput] = useState(null);

    useEffect(() => {
        if (!rawAmountInWei) return;

        const estimate = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const bonding = new web3.eth.Contract(bondingAbi.abi, bondingAddress);
                const factory = new web3.eth.Contract(factoryAbi.abi, factoryAddress);
                const [assetRate, K, initialSupply, buyTax] = await Promise.all([
                    bonding.methods.assetRate().call(),
                    bonding.methods.K().call(),
                    bonding.methods.initialSupply().call(),
                    factory.methods.buyTax().call(),
                ]);

                const tenPow18 = new BN(10).pow(new BN(18));
                const supply = new BN(initialSupply).mul(tenPow18);
                const reserveA = supply;
                // this is k = ((K*10000)/assetRate)
                const k = new BN(K).mul(new BN(10000)).div(new BN(assetRate));
                //this is liquidity = (((k*10000 ether)/supply) * 1ether)/10000;
                const liquidity = k
                    .mul(new BN(10000)).mul(tenPow18)
                    .div(supply)
                    .mul(tenPow18)
                    .div(new BN(10000));
                const reserveB = liquidity;

                //amountIn with buyTax
                const amountIn = new BN(rawAmountInWei);
                const tax = new BN(buyTax);
                const amountInNet = amountIn.sub(amountIn.mul(tax).div(new BN(100)));

                //  getAmountOut formula=>uniswap
                const amountOut = getAmountOut(amountInNet, reserveB, reserveA, web3);

                setOutput({
                    reserveA: reserveA.toString(),
                    reserveB: reserveB.toString(),
                    amountInNet: amountInNet.toString(),
                    estimatedOut: amountOut.toString(),
                });

            } catch (error) {
                console.error("Bonding estimation error:", error);
            }
        };

        estimate();
    }, [bondingAddress, factoryAddress, rawAmountInWei]);

    return output;
};

const getAmountOut = (amountIn, reserveIn, reserveOut) => {
    const amountInWithFee = amountIn.mul(new BN(997));
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(new BN(1000)).add(amountInWithFee);
    return numerator.div(denominator);
};

