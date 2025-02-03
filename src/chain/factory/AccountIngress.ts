import { Contract, Signer } from 'ethers';
import AccountIngressAbi from '../abis/AccountIngress.json';
import { AccountIngress } from '../@types/AccountIngress';
import { Config } from '../../util/configLoader';

let instance: AccountIngress | null = null;

export const accountIngressFactory = async (config: Config, signer: Signer) => {
  if (instance) return instance;

  instance = (new Contract(config.accountIngressAddress, AccountIngressAbi.abi, signer.provider) as unknown) as AccountIngress;
  return instance;
};
