import { Contract } from 'ethers';
import { AccountIngress } from '../@types/AccountIngress';

import AccountRulesV2Abi from "../../chain/abis/AccountRulesV2Impl.json"

let instance: Contract | null = null;

export const accountRulesV2Factory = async (ingressInstance: AccountIngress) => {
  if (instance) return instance;

  const ruleContractName = await ingressInstance.RULES_CONTRACT();
  const accountRulesAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"//await ingressInstance.getContractAddress(ruleContractName);

  instance = new Contract(
    accountRulesAddress,
    AccountRulesV2Abi.abi,
    ingressInstance.signer
  )
  
  return instance;
};
