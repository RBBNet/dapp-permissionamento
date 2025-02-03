// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRulesV2Impl } from '../chain/@types/NodeRulesV2Impl';
import { nodeRulesFactory } from '../chain/factory/NodeRules';
import { useNetwork } from './network';

// Utils

import { configPromise } from '../util/configLoader';

enum EnodeType{
  Boot = 0,
  Validator = 1,
  Writer = 2,
  WriterPartner = 3,
  ObserverBoot = 4,
  Observer = 5,
  Other
}

type Enode = {
  enodeHigh: string;
  enodeLow : string;
  nodeType: EnodeType;
  name : string;
  orgId: number;
  active: boolean
}

type ContextType =
  | {
      nodeList: Enode[];
      setNodeList: React.Dispatch<React.SetStateAction<Enode[]>>;
      nodeRulesContract?: NodeRulesV2Impl;
      setNodeRulesContract: React.Dispatch<React.SetStateAction<NodeRulesV2Impl | undefined>>;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);

const loadNodeData = (
  nodeRulesContract: NodeRulesV2Impl | undefined,
  setNodeList: (account: Enode[]) => void
) => {
  if (nodeRulesContract === undefined) {
    setNodeList([]);
  } else {
   
  }
};


export const NodeDataProvider: React.FC<{}> = props => {
  const [nodeList, setNodeList] = useState<any[]>([]);
  const [nodeRulesContract, setNodeRulesContract] = useState<NodeRulesV2Impl | undefined>(undefined);

  const value = useMemo(
    () => ({ nodeList, setNodeList,  nodeRulesContract, setNodeRulesContract }),
    [nodeList, setNodeList, nodeRulesContract, setNodeRulesContract]
  );

  const { signer } = useNetwork();
  const config = configPromise

  useEffect(() => {
    if (signer === undefined) {
      setNodeRulesContract(undefined);
    } else {
        config.then(config =>{
            nodeRulesFactory(config, signer).then(contract => {
              setNodeRulesContract(contract);
              contract.getNodes(1, 5).then(result => setNodeList(result))
            });

        })
    }
  }, [signer]);

  return <DataContext.Provider value={value} {...props} />;
};


export const useNodeData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { nodeList, setNodeList, nodeRulesContract } = context;

  useEffect(() => {
    loadNodeData(nodeRulesContract, setNodeList);
  }, [nodeRulesContract, setNodeList]);


  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeList !== undefined;
  }, [nodeRulesContract, nodeList]);

  return {
    dataReady,
    nodeList: nodeList,
    nodeRulesContract
  };
};
