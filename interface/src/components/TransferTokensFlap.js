
import { useEffect, useState } from 'react';
import { useAccount, useBalance, useWalletClient, usePublicClient } from 'wagmi'
import { chainsDetails, supportBridgeTokens, tokenDetails } from '../constants';
import { ethers } from "ethers";
import { useAlert, positions } from 'react-alert';
import gasABI from "./../gasABI.json";
import { QRCode } from "react-qr-code";
import { Circle, CircleEnvironments, PaymentIntentCreationRequest } from "@circle-fin/circle-sdk";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TransferTokensFlap({toChain, chain}) {

    const {address} = useAccount()
    const { data: signer } = useWalletClient();
    const provider = usePublicClient();

    const [tokenBalance, setTokenBalance] = useState(100000)
    const [tokenBalanceLoading, setTokenBalanceLoading] = useState(false)
    const [showLeftToken, setShowLeftToken] = useState(false)
    const [showRightToken, setShowRightToken] = useState(false)
    const [selectedToken, setSelectedToken] = useState("USDC")
    const [inputAmount, setInputAmount] = useState(0);
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [loading, setloading] = useState(false);
    const [initiateButtonLoading, setInitiateButtonLoading] = useState(false)
    const alert = useAlert()
    const notifyPaymentNotReceived = () => toast.info('Payment not received yet!', {
        position: toast.POSITION.BOTTOM_LEFT
    });
    const notifyPaymentReceived = () => toast.success('Payment received!', {
        position: toast.POSITION.BOTTOM_LEFT
    });

    useEffect(() => {
        setTokenBalanceLoading(true)

        if(chainsDetails[chain.id].isCollateralChain) {

        } else {

        }

        // chainsDetails[chain.id].tokens[selectedToken].token

        setTokenBalanceLoading(false)
    }, [selectedToken])

    useEffect(() => {
        setTokenBalanceLoading(true)
        if(chainsDetails[chain.id].isCollateralChain) {

        } else {

        }
        setTokenBalanceLoading(false)
    }, [])

    const { data } = useBalance({
        address:address
    })

    const estimateAmount = async (val) => {
        if(val > 0) {
            setloading(true)
            setInputAmount(val)
            setloading(false)
        } else {
            setInputAmount(0)
        }
    }

    const initiate = async () => {
        setInitiateButtonLoading(true)
        if(inputAmount > 0) {
            const _provider = new ethers.JsonRpcProvider(chainsDetails[toChain].rpc);
            let contractBalance = ethers.formatEther(await _provider.getBalance(chainsDetails[toChain].contract));
            
            if(contractBalance >= receiveAmount) {
                try {
                    // const gasContract = new ethers.Contract(chainsDetails[chain.id].contract, gasABI, provider);
                    // const signedContract = gasContract.connect(signer)

                    // const gasFee = await provider.getGasPrice(); 
                    // const gasFeeFormatted = ethers.formatEther(Number(gasFee) * 100000);
                    // console.log(ethers.parseUnits((Number(inputAmount) + Number(gasFeeFormatted)).toString(), "ether"))
                    // const txnReceipt = await signedContract.bridgeGas(chainsDetails[toChain].destDomainIdentifier, chainsDetails[toChain].contract, {value: ethers.parseUnits(Number(payAmount).toString(), "ether")});
                    // await delay(3000);
                    // console.log(txnReceipt.hash);
                    // alert.success(
                    //     <div>
                    //         <div>transaction sent</div>
                    //         <button className='text-xs' onClick={()=> window.open("https://explorer.hyperlane.xyz/message/" + txnReceipt.hash, "_blank")}>View on explorer</button>
                    //     </div>, {
                    //     timeout: 6000,
                    //     position: positions.BOTTOM_RIGHT
                    // });
                } catch(e) {
                    alert.error(<div>something went wrong</div>, {
                        timeout: 6000,
                        position: positions.BOTTOM_RIGHT
                    });
                }
            } else {
                alert.error(<div>insufficient liquidity on destination chain</div>, {
                    timeout: 6000,
                    position: positions.BOTTOM_RIGHT
                });
            }
        }
        setInitiateButtonLoading(false)
    }

    // Create promise that gets resolved in time milliseconds
    function delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return (
        toChain !== "" ? 
        <div className='flex justify-center'>
            <div className='flex-col justify-between rounded bg-white border text-black p-4 space-y-4 w-full'>
                <div className='rounded-lg bg-gray-100 py-4 px-4 space-y-4'> 
                    <div className='flex items-center justify-center space-x-4'>
                        <div className='flex-none'>
                            <div className='flex items-center space-x-2'>
                                <img className='w-8 h-8' src={chainsDetails[chain.id].image}/>
                                <div className='font-semibold'>{chainsDetails[chain.id].name}</div>
                            </div>
                        </div>
                        <div className='grow flex items-center justify-between space-x-4'>
                            <div className='outline-dashed w-full'></div>
                            <div className='flex justify-center items-center space-x-2 w-[160px]'>
                                <img className='rounded p-1 bg-gray-900 w-10 h-10' src="https://www.hyperlane.xyz/_next/static/media/logo-image.57d67522.svg"/>
                            </div>
                            <div className='outline-dashed w-full'></div>
                        </div>
                        <div className='flex-none'>
                            <div className='flex items-center space-x-2'>
                                <img className='w-8 h-8' src={chainsDetails[toChain].image}/>
                                <div className='font-semibold'>{chainsDetails[toChain].name}</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <button onClick={() => setShowLeftToken(!showLeftToken)} className='flex justify-center space-x-2 items-center rounded-lg bg-[#2362C0] text-white w-28 py-2'>
                            <div>{selectedToken}</div>
                            <div className='w-1/12'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></div>
                            <div className={` ${showLeftToken ? "" : "hidden"} overflow-y-auto fixed rounded-lg w-36 h-44 border bg-white mt-56`}>
                                {supportBridgeTokens.filter(tokenId => tokenId !== selectedToken).map(tokenId => {
                                    let tokenDetail = chainsDetails[chain.id].tokens[tokenId]
                                    return (
                                        <div onClick={() => {setSelectedToken(tokenId); setShowLeftToken(false); setShowRightToken(false);}} className='flex justify-between text-black cursor-pointer hover:bg-gray-100 w-full h-14 items-center px-2'>
                                            <img className='w-8 h-8' src={tokenDetails[tokenId].img} />
                                            <div className='flex justify-start w-20'>
                                                <div className='text-sm font-semibold'>{tokenId}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </button>
                        <button onClick={() => setShowRightToken(!showRightToken)} className='flex justify-center space-x-2 items-center rounded-lg bg-[#2362C0] text-white w-28 py-2'>
                            <div className=''>{selectedToken}</div>
                            <div className='w-1/12'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></div>
                            <div className={` ${showRightToken ? "" : "hidden"} overflow-y-auto fixed rounded-lg w-36 h-44 border bg-white mt-56`}>
                                {supportBridgeTokens.filter(tokenId => tokenId !== selectedToken).map(tokenId => {
                                    let tokenDetail = chainsDetails[chain.id].tokens[tokenId]
                                    return (
                                        <div onClick={() => {setSelectedToken(tokenId); setShowRightToken(false); setShowLeftToken(false);}} className='flex justify-between text-black cursor-pointer hover:bg-gray-100 w-full h-14 items-center px-2'>
                                            <img className='w-8 h-8' src={tokenDetails[tokenId].img} />
                                            <div className='flex justify-start w-20'>
                                                <div className='text-sm font-semibold'>{tokenId}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </button>
                    </div>
                </div>
                <div>
                    <div className='flex w-full justify-end text-gray-400 text-sm'> Your {selectedToken} balance: {+parseFloat(tokenBalance).toFixed(4)}</div>
                    <div>
                        <input key="inputBox" onChange={(e) => {estimateAmount(e.target.value)}} type="number" className='w-full px-4 py-[18px] rounded-[8px] bg-gray-100 border-slate-300 text-md shadow-sm focux:bg-white focus:outline-none focus:border-2 focus:border-blue-600 focus:ring-1 focus:ring-sky-500' />
                    </div>
                </div>
                <div className='flex w-full justify-center space-x-24'>
                    <button onClick={() => initiate()} className='text-white flex flex-col items-center rounded-lg p-4 px-8 bg-[#2362C0] font-semibold w-[180px]'>
                        {
                            initiateButtonLoading ?
                            <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            :<div> Initiate </div>
                        }
                        
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div> : ""
    )
}

export default TransferTokensFlap;