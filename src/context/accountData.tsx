import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode, SetStateAction, Dispatch } from 'react';
import { AccountRulesV2Impl, AccountRulesV2 } from '../chain/@types/AccountRulesV2Impl';
import { accountRulesV2Factory } from '../chain/factory/AccountRulesV2';
import { useNetwork } from './network';
import { configPromise } from '../util/configLoader';
import { Signer } from 'ethers';

type Props = {
  children: ReactNode
}

type ContextType =
  | {
      onUpdate: number;
      setOnUpdate: React.Dispatch<React.SetStateAction<number>>;

      operatorData: AccountRulesV2.AccountDataStructOutput | null | undefined;
      setOperatorData: React.Dispatch<React.SetStateAction<AccountRulesV2.AccountDataStructOutput | null | undefined>>;

      operatorAddress: string;
      setOperatorAddress: React.Dispatch<React.SetStateAction<string>>;

      accountRulesContract?: AccountRulesV2Impl;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRulesV2Impl | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRulesV2Impl | undefined,
  setOperatorData: React.Dispatch<React.SetStateAction<AccountRulesV2.AccountDataStructOutput | null | undefined>>,
  operatorAddress: string
) => {

  if(operatorAddress == undefined){
    console.log("Signer é nulo")
    return
  }


  accountRulesContract?.getAccount(operatorAddress)
    .then(account => setOperatorData(account))
    .catch(err => { 
      setOperatorData(undefined)
      console.error(err)
    })
  return;
};

export const AccountDataProvider: React.FC<Props> = props => {
  const [operatorData, setOperatorData] = useState<AccountRulesV2.AccountDataStructOutput | null>();
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRulesV2Impl | undefined>(undefined);
  const [operatorAddress, setOperatorAddress] = useState<string | undefined>(undefined);
  const [onUpdate, setOnUpdate] = useState<number>(0);
  const value = useMemo(
    () => ({
      onUpdate,
      setOnUpdate,
      operatorData,
      setOperatorData,
      accountRulesContract,
      setAccountRulesContract,
      operatorAddress,
      setOperatorAddress
    }),
    [onUpdate, setOnUpdate, operatorData, setOperatorData, accountRulesContract, setAccountRulesContract, operatorAddress, setOperatorAddress]
  );
  const { signer } = useNetwork();
  const config = configPromise;
  // console.log(signer)
  useEffect(() => {
    if (signer === undefined) {

      setAccountRulesContract(undefined);
    } else {
      window.ethereum?.removeAllListeners("accountsChanged");
      window.ethereum?.on("accountsChanged", (accounts: any[]) =>{
        setOperatorAddress(accounts[0]);
      })
      signer.getAddress().then(address => {
        setOperatorAddress(address)
        config.then(config =>{
          accountRulesV2Factory(config, signer).then(contract => {
            setAccountRulesContract(contract);

            contract.removeAllListeners(contract.filters.AccountAdded);
            contract.removeAllListeners(contract.filters.AccountUpdated);
            contract.removeAllListeners(contract.filters.AccountDeleted);
            contract.removeAllListeners(contract.filters.AccountStatusUpdated);

            contract.on(contract.filters.AccountAdded(), (event) => {
              loadAccountData(contract, setOperatorData, address)
              setOnUpdate(value => value + 1)

            });
            contract.on(contract.filters.AccountUpdated(), (event) => {
              loadAccountData(contract, setOperatorData, address)
              setOnUpdate(value => value + 1)
            });
            contract.on(contract.filters.AccountStatusUpdated(), (event) => {
              loadAccountData(contract, setOperatorData, address)
              setOnUpdate(value => value + 1)
            });
            contract.on(contract.filters.AccountDeleted(), (event) => {
              loadAccountData(contract, setOperatorData, address)
              setOnUpdate(value => value + 1)
            });

          });
          })
        }
      ) 

    }
  }, [signer]);
  return <AccountDataContext.Provider value={value} {...props} />;
};

export const useAccountData = () => {
  const context = useContext(AccountDataContext);
  
  if (!context) {
    throw new Error('useAccountData must be used within an AccountDataProvider.');
  }

  const { operatorData, operatorAddress, setOperatorData, accountRulesContract, onUpdate } = context;

  useEffect(() => {
    loadAccountData(accountRulesContract, setOperatorData, operatorAddress);
  }, [accountRulesContract, operatorAddress]);


  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined ;
  }, [accountRulesContract]);

  return {
    onUpdate,
    dataReady,
    accountRulesContract,
    operatorData,
    operatorAddress
  };
};
