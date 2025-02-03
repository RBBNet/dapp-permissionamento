import { ethers, Signer, BrowserProvider } from 'ethers';
import Web3 from 'web3';

let provider:  ethers.JsonRpcSigner | Promise<ethers.JsonRpcSigner> | undefined = undefined;
let web3: Web3 | undefined = undefined;
declare let window: any;

const web3Factory = async () =>{
    if(web3) return web3;

    if(window.ethereum){
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }else {
        throw new Error('MetaMask ou provedor Web3 não encontrado');
    }

    web3 = new Web3(Web3.givenProvider);
    return web3;
}

export const providerFactory = async () => {
    if (provider) return provider;
    const web3 = await web3Factory();

    provider = new BrowserProvider(window.ethereum).getSigner()

    return provider;
  };
  