// Libs
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { governanceFactory } from '../chain/factory/GovernanceFactory';
import { useNetwork } from './network';

// Utils

import { configPromise } from '../util/configLoader';
import { Bytes } from 'web3';
import { Governance } from '../chain/@types';

export enum ProposalStatus{
    Active = 0,
    Cancelled = 1,
    Finished = 2,
    Executed = 3
}

export enum ProposalResult{
    Undefined = 0,
    Approved = 1,
    Rejected = 2
}

export enum ProposalVote{
  NotVoted = 0,
  Approval = 1,
  Rejection = 2
}

type Proposal = {
    id: number;
    creator: string;
    targets: Bytes[];
    calldatas: string;
    blocksDuration: number;
    description: string;
    creationBlock: number;
    status: ProposalStatus;
    result: ProposalResult;
    organizations: number[];
    votes: ProposalVote[];
    cancelationReason: string;
}

type ContextType =
  | {
      governanceContract?: Governance;
      setGovernanceContract: React.Dispatch<React.SetStateAction<Governance | undefined>>;

      onUpdate: number;
      setOnUpdate: React.Dispatch<React.SetStateAction<number>>;

      getPage: () => Proposal[]
      proposalsCount: number;
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
  const [onUpdate, setOnUpdate] = useState(0);
  const [proposalsCount, setProposalsCount] = useState(0);

  const value = useMemo(
    () => ({governanceContract, setGovernanceContract, onUpdate, setOnUpdate, proposalsCount}),
    [governanceContract, setGovernanceContract, onUpdate, setOnUpdate, proposalsCount]
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
                contract.getNumberOfProposals().then(proposals => {
                  setProposalsCount(Number(proposals))
                })
                contract.on(contract.filters.ProposalCreated(), ()=>{
                  setOnUpdate(value => value + 1)
                  contract.getNumberOfProposals().then(proposals => setProposalsCount(Number(proposals)))
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

export const PAGE_SIZE = 10;

const getPage = (page: number, governanceContract: Governance | undefined): Promise<Governance.ProposalDataStructOutput[] | undefined>=>{

  if(!governanceContract) return new Promise(resolve => resolve(undefined))

  return new Promise(resolve => governanceContract.getProposals(page, PAGE_SIZE).then(response => resolve(response)).catch(ex => {console.log(ex); resolve(undefined)}))
}


export const useGovernanceData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useNodeData must be used within a NodeDataProvider.');
  }

  const { governanceContract, setGovernanceContract, onUpdate, proposalsCount } = context;

  useEffect(() => {
    loadNodeData(governanceContract);
  }, [governanceContract, setGovernanceContract]);

  const dataReady = useMemo(() => {
    return governanceContract !== undefined
  }, [governanceContract, setGovernanceContract]);

  return {
    dataReady,
    governanceContract,
    onUpdate,
    getPage: (page:number) => getPage(page, governanceContract),
    proposalsCount
  };
};
