import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { AccountRulesV2Impl, AccountRulesV2 } from '../chain/@types/AccountRulesV2Impl';
import { accountRulesV2Factory } from '../chain/factory/AccountRulesV2';
import { useNetwork } from './network';
import { configPromise } from '../util/configLoader';

type Props = {
  children: ReactNode
}

type ContextType =
  | {
      operatorAddress: string;
      setOperatorAddress: React.Dispatch<React.SetStateAction<string>>;

      accountList: AccountRulesV2.AccountDataStruct[];
      setAccountList: React.Dispatch<React.SetStateAction<AccountRulesV2.AccountDataStruct[]>>;

      accountRulesContract?: AccountRulesV2Impl;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRulesV2Impl | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRulesV2Impl | undefined,
  setAccountList: (account: AccountRulesV2.AccountDataStruct[]) => void,
) => {

  if (accountRulesContract === undefined) {
    setAccountList([]);
  } else {
    // Temporario
    accountRulesContract.getAccounts(1, 20)
      .then((result) =>{
        setAccountList(result)
    })
    return;
  }
};

export const AccountDataProvider: React.FC<Props> = props => {
  const [accountList, setAccountList] = useState<AccountRulesV2.AccountDataStruct[]>([]);
  const [operatorAddress, setOperatorAddress] = useState<string>('')
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRulesV2Impl | undefined>(undefined);

  const value = useMemo(
    () => ({
      accountList: accountList,
      setAccountList: setAccountList,
      accountRulesContract,
      setAccountRulesContract,
      operatorAddress,
      setOperatorAddress
    }),
    [operatorAddress, setOperatorAddress, accountList, setAccountList, accountRulesContract, setAccountRulesContract]
  );
  const { signer } = useNetwork();
  const config = configPromise;

  useEffect(() => {
    if (signer === undefined) {

      setAccountRulesContract(undefined);
    } else {
      signer.getAddress().then(address => setOperatorAddress(address))
      window.ethereum?.on("accountsChanged", (accounts: any[]) =>{
        setOperatorAddress(accounts[0])
      })
      config.then(config =>{
          accountRulesV2Factory(config, signer).then(contract => {
            setAccountRulesContract(contract);
            contract.removeAllListeners(contract.filters.AccountAdded);
            contract.removeAllListeners(contract.filters.AccountDeleted);
            contract.removeAllListeners(contract.filters.AccountUpdated);
            contract.on(contract.filters.AccountAdded(), () => {
              console.log("Nova conta detectada")
                loadAccountData(contract, setAccountList);
            });
            contract.on(contract.filters.AccountUpdated(), () => {
              console.log("Conta atualizada")
                loadAccountData(contract, setAccountList);
            });
            contract.on(contract.filters.AccountDeleted(), () => {
              console.log("Conta removida")
              loadAccountData(contract, setAccountList);
            
            });
          });
      })

    }
  }, [signer]);
  return <AccountDataContext.Provider value={value} {...props} />;
};

export const useAccountData = () => {
  const context = useContext(AccountDataContext);
  
  if (!context) {
    throw new Error('useAccountData must be used within an AccountDataProvider.');
  }

  const { operatorAddress, accountList, setAccountList, accountRulesContract } = context;

  useEffect(() => {
    loadAccountData(accountRulesContract, setAccountList);
  }, [accountRulesContract, setAccountList]);

  const formattedAccountList = useMemo(() => {
    return accountList
  }, [accountList]);

  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined ;
  }, [accountRulesContract, accountList]);

  return {
    dataReady,
    accountList: formattedAccountList,
    accountRulesContract,
    operatorAddress:operatorAddress
  };
};
