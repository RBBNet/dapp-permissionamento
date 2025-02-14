import { Contract } from 'ethers';
import NodeRulesAbi from '../abis/NodeRulesV2Impl.json';
import { NodeRulesV2Impl } from '../@types/NodeRulesV2Impl';
import { Config } from '../../util/configLoader';
import { Signer } from 'ethers';

let instance: NodeRulesV2Impl | null = null;

export const nodeRulesFactory = async (config: Config, signer: Signer) => {
  if (instance) return instance;

  

  instance = (new Contract(config.nodeRulesAddress, NodeRulesAbi.abi, signer) as unknown) as NodeRulesV2Impl;
  return instance;
};
