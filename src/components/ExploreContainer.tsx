import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonSegment, IonSegmentButton, IonLabel, IonFooter, IonToolbar } from '@ionic/react';
import './ExploreContainer.css';
import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import * as md5 from "js-md5";
import * as web3Utils from "web3-utils";
import blocksData from "../blocksDetails";


declare const window: any;

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {

  // const [file, setFile] = useState("");
  // const [viewHash, setHash] = useState("");
  const [tokenContract, setTokenContract] = useState(blocksData.blocksAddress);
  const [bridgeContract, setBridgeContract] = useState(blocksData.ethToXdaiBridge);
  const [amount, setAmount] = useState(0);
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  // const onChange = async (e: any) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setViewFile(URL.createObjectURL(e.target.files[0]))
  //     setFile(e.target.files[0])
  //   }
  // }

  const onAmount = async (e: any) => {
    setAmount(e.target.value);
  }

  const onNetwork = async (e: any) => {
    setNetwork(e.detail.value);
    switch(e.target.value){
      case "ethereum":
        setTokenContract(blocksData.blocksAddress)
        setBridgeContract(blocksData.ethToXdaiBridge);
        break;
      case "xdai":
        setTokenContract(blocksData.blocksXdaiAddress);
        setBridgeContract(blocksData.xDaiToEthBridge);
        break;
    }
  }

  const addBlocksToMetamask = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
    }).then((res:any) =>{
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x8a6d4c8735371ebaf8874fbd518b56edd66024eb',
            symbol: 'BLOCKS',
            decimals: 18,
            image: 'https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=Blocks%20Etherscan%20Logo.png',
          },
        },
      })
      .then((success:any) => {
        if (success) {
          console.log('BLOCKS successfully added to wallet!')
        } else {
          throw new Error('Something went wrong.')
        }
      })
      .catch(console.error)
    });
  }

  const addBlocksToMetamaskXdai = async () => {    
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x64' }], // chainId must be in hexadecimal numbers
      }).then((res:any) =>{
        window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0x1a4ea432e58bff38873af87bf68c525eb402aa1d',
              symbol: 'BLOCKS',
              decimals: 18,
              image: "https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=Blocks%20Etherscan%20Logo.png"
            },
          },
        })
        .then((success:any) => {
          if (success) {
            console.log('BLOCKS successfully added to wallet!')
          } else {
            throw new Error('Something went wrong.')
          }
        })
        .catch(console.error)
      })
    } catch (error:any) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          const change = await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: "0x64",
              chainName: "xDAI Chain",
              rpcUrls: [
                  "https://rpc.xdaichain.com"
              ],
              iconUrls: [
                  "https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"
              ],
              nativeCurrency: {
                  "name": "xDAI",
                  "symbol": "xDAI",
                  "decimals": 18
              },
              blockExplorerUrls: [
                  "https://blockscout.com/xdai/mainnet/"
              ]
            }],
          });
          if(change){
            window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20',
                options: {
                  address: '0x1a4ea432e58bff38873af87bf68c525eb402aa1d',
                  symbol: 'BLOCKS',
                  decimals: 18,
                  image: "https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=Blocks%20Etherscan%20Logo.png",
                },
              },
            })
            .then((success:any) => {
              if (success) {
                console.log('BLOCKS successfully added to wallet!')
              } else {
                throw new Error('Something went wrong.')
              }
            })
            .catch(console.error)
          }
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  }

  const addxDaiToMetamask = async() => {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x64' }], // chainId must be in hexadecimal numbers
        });
      } catch (error:any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: "0x64",
                chainName: "xDAI Chain",
                rpcUrls: [
                    "https://rpc.xdaichain.com"
                ],
                iconUrls: [
                    "https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"
                ],
                nativeCurrency: {
                    "name": "xDAI",
                    "symbol": "xDAI",
                    "decimals": 18
                },
                blockExplorerUrls: [
                    "https://blockscout.com/xdai/mainnet/"
                ]
            }],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
  }

  const blocksBridgeTransaction = (fileData: any) => {

      //Connect to Ethereum through the Metamask Provider
      let provider: any;
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(bridgeContract)

      //Connect to the BLOCKS Smart Contract via the contract address, abi and provider
      const blocksContract = new ethers.Contract(tokenContract, network === 'ethereum' ? blocksData.omniBridgeAbi : blocksData.blocksOnXdaiAbi, provider);
      let contractSigner = blocksContract.connect(signer);

      const omnibridgeContract = new ethers.Contract(bridgeContract, network === 'ethereum' ? blocksData.omniBridgeAbi : blocksData.blocksOnXdaiAbi, provider);
      let omniContractSigner = omnibridgeContract.connect(signer);

      //You can send any amount of BLOCKS tokens with the transaction. BigNumber helps JavaScript deal with large numbers involving BLOCKS' 18 decimals. In this case we are sending 2 BLOCKS.
      //let amountAdjusted = Number(web3Utils.toWei(amount.toString(), "ether"))
      let amountAdjusted = new BigNumber(Number(web3Utils.toWei(amount.toString(), "ether")));
      console.log(amountAdjusted.toFixed())

      contractSigner.approve(tokenContract, amountAdjusted.toFixed()).then((tx: any)=>{
        if(tx){
          //View the transaction response and get the transaction hash
          console.log(tx)
          alert(tx.hash);
          if(network === 'ethereum'){
            omniContractSigner.relayTokens(bridgeContract, address, amountAdjusted.toFixed()).then((tx: any)=>{
              if(tx){
               //View the transaction response and get the transaction hash
                console.log(tx)
                alert(tx.hash);
              }
            }).catch((e: any) => {
              alert(e.message);
            });
          } else {
            contractSigner.transferAndCall(bridgeContract, amountAdjusted.toFixed(), 0x00).then((tx: any)=>{
              if(tx){
               //View the transaction response and get the transaction hash
                console.log(tx)
                alert(tx.hash);
              }
            }).catch((e: any) => {
              alert(e.message);
            });
          }
       }
      }).catch((e: any) => {
        alert(e.message);
      });
  }

  useEffect(() => {
    if (window.ethereum ) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((res:any) => {
        console.log(res[0]);
        setAddress(res[0])
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          alert('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
    }
  }, []);

  return (
    <>
      <div className="container">
        <strong>BLOCKS xDai Bridge</strong>
        <input type='number' placeholder="Amount to Send" onChange={onAmount}/>
        {amount > 0 &&
          <strong>
            {amount} BLOCKS
          </strong>
        }
        <IonSegment className="segment-bar" color="danger" value={network} onIonChange={e => onNetwork(e)}>
          <IonSegmentButton className="segment" color="danger" value="ethereum">
            <IonLabel>Send BLOCKS to xDAI</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className="segment" value="xdai">
            <IonLabel>Send BLOCKS to ETH</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonButton
          className="button-choose"
          color="danger"
          onClick={blocksBridgeTransaction}>Send to Bridge</IonButton>
      </div>   
      <div className="row">
        <IonButton
          className="button-choose"
          color="danger"
          fill="outline"
          onClick={addxDaiToMetamask}>Add xDai Network to Metamask</IonButton>
      </div>  
      <div className="container">
        <strong>BLOCKS Metamask Helpers</strong>
      </div>   
      <div className="row">
        <IonButton
          className="button-choose"
          color="danger"
          onClick={addBlocksToMetamask}>Add BLOCKS to Metamask (ETH)</IonButton>
          <IonButton
          className="button-choose"
          color="danger"
          onClick={addBlocksToMetamaskXdai}>Add BLOCKS to Metamask (xDAI)</IonButton>
      </div>
      <div className="footer">
      </div>
    </>  
  );
};

export default ExploreContainer;
