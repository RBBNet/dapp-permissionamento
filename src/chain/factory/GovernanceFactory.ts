import { Contract, Signer } from 'ethers';
import Governanca from "../abis/Governance.json"
import { Config } from '../../util/configLoader';
import { Governance } from '../@types';

let instance: Governance | null = null;

export const governanceFactory = async (config: Config, signer:Signer) => {
  if (instance) return instance;

  //const ruleContractName = await ingressInstance.RULES_CONTRACT();
  
  instance = (new Contract(
    config.governancaAddress,
    Governanca.abi,
    signer
  ) as unknown) as Governance;
  
  

  return instance;
};
