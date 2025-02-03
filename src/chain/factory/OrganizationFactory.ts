import { Contract } from 'ethers';
import { AccountIngress } from '../@types/AccountIngress';

import OrganizationAbi from "../abis/OrganizationImpl.json"
import { OrganizationImpl as OrganizationContract } from '../@types';
import { Signer } from 'ethers';
import { Config } from '../../util/configLoader';
let instance: OrganizationContract | null = null;

export const organizationFactory = async (config:Config, signer: Signer) => {
  if (instance) return instance;


  instance = (new Contract(
    config.organizationAddress,
    OrganizationAbi.abi,
    signer.provider
  ) as unknown) as OrganizationContract
  
  return instance;
};
