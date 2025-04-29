// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { NodeRulesV2, NodeRulesV2Impl } from '../chain/@types/NodeRulesV2Impl';
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

type ContextType =
  | {
      onUpdate: number;
      setOnUpdate: React.Dispatch<React.SetStateAction<number>>;

      nodeList: NodeRulesV2.NodeDataStructOutput[];
      setNodeList: React.Dispatch<React.SetStateAction<NodeRulesV2.NodeDataStructOutput[]>>;
      nodeRulesContract?: NodeRulesV2Impl;
      setNodeRulesContract: React.Dispatch<React.SetStateAction<NodeRulesV2Impl | undefined>>;

      nodesCount: number;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);


export const NodeDataProvider: React.FC<{children:any}> = props => {
  const [nodeList, setNodeList] = useState<any[]>([]);
  const [nodeRulesContract, setNodeRulesContract] = useState<NodeRulesV2Impl | undefined>(undefined);
  const [nodesCount, setNodesCount] = useState(0);
  const [onUpdate, setOnUpdate] = useState<number>(0);
  const value = useMemo(
    () => ({ nodeList, setNodeList,  nodeRulesContract, setNodeRulesContract, nodesCount,onUpdate, setOnUpdate  }),
    [nodeList, setNodeList, nodeRulesContract, setNodeRulesContract, nodesCount]
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
              contract.removeAllListeners(contract.filters.NodeAdded);
              contract.removeAllListeners(contract.filters.NodeUpdated);
              contract.removeAllListeners(contract.filters.NodeDeleted);
              contract.removeAllListeners(contract.filters.NodeStatusUpdated);

              contract.getNumberOfNodes().then(nodes => {
                setNodesCount(Number(nodes))
              })

              contract.on(contract.filters.NodeAdded(), ()=>{
                setOnUpdate(value => value + 1)
                contract.getNumberOfNodes().then(nodes => {
                  setNodesCount(Number(nodes))
                })
              })
              contract.on(contract.filters.NodeUpdated(), ()=>{
                setOnUpdate(value => value + 1)
              })

              contract.on(contract.filters.NodeDeleted(), ()=>{
                setOnUpdate(value => value + 1)
                contract.getNumberOfNodes().then(nodes => {
                  setNodesCount(Number(nodes))
                })
              })

              contract.on(contract.filters.NodeStatusUpdated(), ()=>{
                setOnUpdate(value => value + 1)
              })
            });

        })
    }
  }, [signer]);

  return <DataContext.Provider value={value} {...props} />;
};

export const PAGE_SIZE = 10;

const getPage = (page: number, accountContract: NodeRulesV2Impl | undefined): Promise<NodeRulesV2.NodeDataStruct[] | undefined>=>{

  if(!accountContract) return new Promise(resolve => resolve(undefined))

  return new Promise(resolve => accountContract.getNodes(page, PAGE_SIZE).then(response => resolve(response)).catch(ex => {console.log(ex); resolve(undefined)}))
}

export const useNodeData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { nodeList, setNodeList, nodeRulesContract, nodesCount, onUpdate } = context;

  useEffect(() => {
    // loadNodeData(nodeRulesContract, setNodeList);
  }, [nodeRulesContract, setNodeList]);


  const dataReady = useMemo(() => {
    return nodeRulesContract !== undefined && nodeList !== undefined;
  }, [nodeRulesContract, nodeList]);

  return {
    dataReady,
    nodeRulesContract,
    nodesCount,
    onUpdate,
    getPage: (page: number) => getPage(page, nodeRulesContract,)
  };
};
