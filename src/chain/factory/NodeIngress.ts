import { Contract, Signer } from 'ethers';
import NodeIngressAbi from '../abis/NodeIngress.json';
import { NodeIngress } from '../@types/NodeIngress';
import { Config } from '../../util/configLoader';

let instance: NodeIngress | null = null;

export const nodeIngressFactory = async (config: Config, provider: Signer) => {
  if (instance) return instance;

  instance = (new Contract(config.nodeIngressAddress, NodeIngressAbi.abi, provider) as unknown) as NodeIngress;
  return instance;
};
