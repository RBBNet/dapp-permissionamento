import { Contract } from 'ethers';
import { AccountIngress } from '../@types/AccountIngress';
import { AccountRulesV2Impl, AccountRulesV2 } from '../@types/AccountRulesV2Impl';

import AccountRulesV2Abi from "../../chain/abis/AccountRulesV2Impl.json"
import { randomHex } from 'web3-utils';

let instance: AccountRulesV2Impl | null = null;

export const accountRulesV2Factory = async (ingressInstance: AccountIngress) => {
  if (instance) return instance;

  const ruleContractName = await ingressInstance.RULES_CONTRACT();
  const accountRulesAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";//await ingressInstance.getContractAddress(ruleContractName);

  instance = (new Contract(
    accountRulesAddress,
    AccountRulesV2Abi.abi,
    ingressInstance.signer
  )) as AccountRulesV2Impl;
  
  // Temporario
  function getRandomInt(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  const list: AccountRulesV2.AccountDataStruct[] = Array.from({ length: 10 }, (_, i) => {
    return {
      orgId: getRandomInt(1, 8),
      account: "ENDEREÇO_AQUI_" + randomHex(2),
      roleId: "HASH_AQUI",
      dataHash: "HASH_AQUI",
      active: i % 3 == 0 ? true : false,
    }
  });
  console.log(list)
  instance.getAccounts = async () =>{
    return list
  }

  return instance;
};
