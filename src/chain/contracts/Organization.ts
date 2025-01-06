import { Contract } from 'ethers';
import { AccountIngress } from '../@types/AccountIngress';

import OrganizationAbi from "../../chain/abis/Organization.json"
import { Organization as OrganizationContract } from '../@types';
let instance: OrganizationContract | null = null;

export const organizationFactory = async (ingressInstance: AccountIngress) => {
  if (instance) return instance;

  instance = (new Contract(
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    OrganizationAbi.abi,
    ingressInstance.signer
  ) as unknown) as OrganizationContract
  
  return instance;
};
