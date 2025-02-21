import Web3 from "web3";

let instance: Web3 | null = null;

export const web3Factory = async () => {
  if (instance) return instance;


  instance = new Web3(window.ethereum)
  
  return instance;
};
