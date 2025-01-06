import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AccountRulesV2Impl, AccountRulesV2 } from '../chain/@types/AccountRulesV2Impl';
import { accountRulesV2Factory } from '../chain/contracts/AccountRulesV2';
import { useNetwork } from './network';
import { Contract, utils } from 'ethers';

type ContextType =
  | {
      accountList: AccountRulesV2.AccountDataStruct[];
      setAccountList: React.Dispatch<React.SetStateAction<AccountRulesV2.AccountDataStruct[]>>;
      accountReadOnly?: boolean;
      setAccountReadOnly: React.Dispatch<React.SetStateAction<boolean | undefined>>;
      accountRulesContract?: AccountRulesV2Impl;
      setAccountRulesContract: React.Dispatch<React.SetStateAction<AccountRulesV2Impl | undefined>>;
    }
  | undefined;

const AccountDataContext = createContext<ContextType>(undefined);

const loadAccountData = (
  accountRulesContract: AccountRulesV2Impl | undefined,
  setAccountList: (account: AccountRulesV2.AccountDataStruct[]) => void,
  setAccountReadOnly: (readOnly?: boolean) => void
) => {

  if (accountRulesContract === undefined) {
    setAccountList([]);
    setAccountReadOnly(undefined);
  } else {

    // Temporario
    accountRulesContract.getAccounts()
      .then((result: AccountRulesV2.AccountDataStruct[]) =>{
        setAccountList(result)
    })
    return;
  }
};

/**
 * Provider for the data context that contains the account list
 * @param {Object} props Props given to the AccountDataProvider
 * @return The provider with the following value:
 *  - accountList: list of permitted accounts from Account Rules contract
 *  - setAccountList: setter for the allowlist state
 */
export const AccountDataProvider: React.FC<{}> = props => {
  const [accountList, setAccountList] = useState<AccountRulesV2.AccountDataStruct[]>([]);
  const [accountReadOnly, setAccountReadOnly] = useState<boolean | undefined>(undefined);
  const [accountRulesContract, setAccountRulesContract] = useState<AccountRulesV2Impl | undefined>(undefined);

  const value = useMemo(
    () => ({
      accountList: accountList,
      setAccountList: setAccountList,
      accountReadOnly,
      setAccountReadOnly,
      accountRulesContract,
      setAccountRulesContract,

    }),
    [accountList, setAccountList, accountReadOnly, setAccountReadOnly, accountRulesContract, setAccountRulesContract]
  );
  const { accountIngressContract } = useNetwork();

  useEffect(() => {
    if (accountIngressContract === undefined) {

      setAccountRulesContract(undefined);
    } else {
      
      accountRulesV2Factory(accountIngressContract).then(contract => {
        setAccountRulesContract(contract);
        return;
        contract.removeAllListeners('AccountAdded');
        contract.removeAllListeners('AccountRemoved');
        contract.on('AccountAdded', (success: boolean, account: any, event: any) => {
          if (success) {
            loadAccountData(contract, setAccountList, setAccountReadOnly);
          }
        });
        contract.on('AccountRemoved', (success: boolean, account: any, event: any) => {
          if (success) {
            loadAccountData(contract, setAccountList, setAccountReadOnly);
          }
        });
      });

    }
  }, [accountIngressContract, setAccountList, setAccountReadOnly]);
  return <AccountDataContext.Provider value={value} {...props} />;
};

/**
 * Fetch the appropriate account data on chain and synchronize with it
 * @return {Object} Contains data of interest:
 *  - dataReady: true if isReadOnly and account allowlist are correctly fetched,
 *  false otherwise
 *  - userAddress: Address of the user
 *  - isReadOnly: Account contract is lock or unlock,
 *  - allowlist: list of permitted accounts from Account contract,
 */
export const useAccountData = () => {
  const context = useContext(AccountDataContext);
  
  if (!context) {
    throw new Error('useAccountData must be used within an AccountDataProvider.');
  }

  const { accountList, setAccountList, accountReadOnly, setAccountReadOnly, accountRulesContract } = context;

  useEffect(() => {
    loadAccountData(accountRulesContract, setAccountList, setAccountReadOnly);
  }, [accountRulesContract, setAccountList, setAccountReadOnly]);

  const formattedAccountList = useMemo(() => {
    return accountList
  }, [accountList]);

  const dataReady = useMemo(() => {
    return accountRulesContract !== undefined ;
  }, [accountRulesContract, accountReadOnly, accountList]);
  console.log(formattedAccountList)
  return {
    dataReady,
    allowlist: formattedAccountList,
    isReadOnly: accountReadOnly,
    accountRulesContract
  };
};
