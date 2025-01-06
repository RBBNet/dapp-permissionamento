// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { isAddress } from 'web3-utils';
import idx from 'idx';
// Context
import { useAccountData } from '../../context/accountData';
import { useAdminData } from '../../context/adminData';
// Utils
import useTab from './useTab';
import { errorToast } from '../../util/tabTools';
// Components
import AccountTab from '../../components/AccountTab/AccountTab';
import LoadingPage from '../../components/LoadingPage/LoadingPage';
import NoContract from '../../components/Flashes/NoContract';
// Constants
import {
  PENDING_ADDITION,
  FAIL_ADDITION,
  PENDING_REMOVAL,
  FAIL_REMOVAL,
  SUCCESS,
  FAIL
} from '../../constants/transactions';
import { Contract, Signer } from 'ethers';
import { AccountRulesV2 } from '../../chain/@types/AccountRulesV2Impl';
type AccountTabContainerProps = {
  isOpen: boolean;
};





const AccountTabContainer: React.FC<AccountTabContainerProps> = ({ isOpen }) => {
  const { isAdmin, dataReady: adminDataReady } = useAdminData();
  const { allowlist, isReadOnly, dataReady, accountRulesContract } = useAccountData(); // <-- Puxa os dados na blockchain 
  
  const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
    allowlist,
    (identifier: string) => ({ address: identifier })
  );

  if (!!accountRulesContract) {
    const handleAdd = async (value: string) => {
      
    };

    const handleRemove = async (value: string) => {
      
    };

    const isValidAccount = (address: string) => {
      let isValidAddress = isAddress(address);
      if (!isValidAddress) {
        return {
          valid: false
        };
      }

      let isDuplicateAccount =
        list.filter((item: AccountRulesV2.AccountDataStruct) => address.toLowerCase() === item.account.toLowerCase()).length > 0;
      if (isDuplicateAccount) {
        return {
          valid: false,
          msg: 'Account address is already added.'
        };
      }

      return {
        valid: true
      };
    };
    const allDataReady: boolean = dataReady;

    if (isOpen && allDataReady) {
      return (
        <AccountTab
          list={allowlist}
          modals={modals}
          toggleModal={toggleModal}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          isAdmin={isAdmin}
          deleteTransaction={deleteTransaction}
          isValid={isValidAccount}
          isOpen={isOpen}
        />
      );
    } else if (isOpen && !allDataReady) {
      return <LoadingPage />;
    } else {
      return <div />;
    }
  } else if (isOpen && !accountRulesContract) {
    return <NoContract tabName="Account Rules" />;
  } else {
    return <div />;
  }
};

AccountTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default AccountTabContainer;
