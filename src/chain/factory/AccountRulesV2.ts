import { Contract, Signer } from 'ethers';
import { AccountRulesV2Impl } from '../@types/AccountRulesV2Impl';
import AccountRulesV2Abi from "../../chain/abis/AccountRulesV2Impl.json"
import { Config } from '../../util/configLoader';

let instance: AccountRulesV2Impl | null = null;

export const accountRulesV2Factory = async (config: Config, signer:Signer) => {
  if (instance) return instance;

  //const ruleContractName = await ingressInstance.RULES_CONTRACT();
  
  instance = (new Contract(
    config.accountRulesAddress,
    AccountRulesV2Abi.abi,
    signer
  ) as unknown) as AccountRulesV2Impl;
  


  return instance;
};
