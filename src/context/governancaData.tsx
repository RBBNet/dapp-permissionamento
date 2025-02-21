// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { governanceFactory } from '../chain/factory/GovernanceFactory';
import { useNetwork } from './network';

// Utils

import { configPromise } from '../util/configLoader';
import { Bytes } from 'web3';
import { Governance } from '../chain/@types';

export enum ProposalStatus{
    Undefined = 0,
    Active = 1,
    Cancelled = 2,
    Finished = 3,
    Executed = 4
}

export enum ProposalResult{
    Undefined = 0,
    Approved = 1,
    Rejected = 2
}

type Proposal = {
    id: number;
    creator: string;
    targets: Bytes[];
    blocksDuration: number;
    description: string;
    creationBlock: number;
    status: ProposalStatus;
    result: ProposalResult;
    organizations: number[];
    cancelationReason: string;
}

type ContextType =
  | {
      governanceContract?: Governance;
      setGovernanceContract: React.Dispatch<React.SetStateAction<Governance | undefined>>;

      onUpdate: number;
      setOnUpdate: React.Dispatch<React.SetStateAction<number>>;
    }
  | undefined;

const DataContext = createContext<ContextType>(undefined);

const loadNodeData = (
  governanceContract: Governance | undefined,
//   setGovernanceContract: (account: Governance.NodeDataStructOutput[]) => void
) => {
  if (governanceContract === undefined) {
    // setNodeList([]);
  } else {
    // nodeRulesContract.getNodes(1, 100).then(result => setNodeList(result))
  }
};


export const GovernanceProvider: React.FC<{children:any}> = props => {
  const [governanceContract, setGovernanceContract] = useState<Governance | undefined>(undefined);
  const [onUpdate, setOnUpdate] = useState<number>(0);

  const value = useMemo(
    () => ({governanceContract, setGovernanceContract, onUpdate, setOnUpdate}),
    [governanceContract, setGovernanceContract, onUpdate, setOnUpdate]
  );

  const { signer } = useNetwork();
  const config = configPromise

  useEffect(() => {
    if (signer === undefined) {
        setGovernanceContract(undefined);
    } else {
        config.then(config =>{
            governanceFactory(config, signer).then(contract => {
                setGovernanceContract(contract);

                contract.on(contract.filters.ProposalCreated(), ()=>{
                  setOnUpdate(value => value + 1)
                })
                contract.on(contract.filters.ProposalCanceled(), ()=>{
                  setOnUpdate(value => value + 1)
                })
                contract.on(contract.filters.ProposalExecuted(), ()=>{
                  setOnUpdate(value => value + 1)
                })
                contract.on(contract.filters.ProposalFinished(), ()=>{
                  setOnUpdate(value => value + 1)
                })
                contract.on(contract.filters.ProposalRejected(), ()=>{
                  setOnUpdate(value => value + 1)
                })
                contract.on(contract.filters.OrganizationVoted(), ()=>{
                  setOnUpdate(value => value + 1)
                })
            });

        })
    }
  }, [signer]);

  return <DataContext.Provider value={value} {...props} />;
};


export const useGovernanceData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { governanceContract, setGovernanceContract, onUpdate } = context;

  useEffect(() => {
    loadNodeData(governanceContract);
  }, [governanceContract, setGovernanceContract]);


  const dataReady = useMemo(() => {
    return governanceContract !== undefined
  }, [governanceContract, setGovernanceContract]);

  return {
    dataReady,
    governanceContract,
    onUpdate
  };
};
