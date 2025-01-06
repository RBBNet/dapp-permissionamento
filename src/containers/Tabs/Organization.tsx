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
import OrganizationTab from '../../components/OrganizationTab/OrganizationTab';
import { useOrganizationData } from '../../context/organizationData';
type OrganizationContainerProps = {
  isOpen: boolean;
};

type Organization = {
  id: string;
  name: string;
};



const OrganizationTabContainer: React.FC<OrganizationContainerProps> = ({ isOpen }) => {
  const { orgList, dataReady, organizationContract } = useOrganizationData(); // <-- Puxa os dados na blockchain 
  
//   const { list, modals, toggleModal, addTransaction, updateTransaction, deleteTransaction, openToast } = useTab(
//     allowlist,
//     (identifier: string) => ({ address: identifier })
//   );

  if (!!organizationContract) {
    const allDataReady: boolean = dataReady;
    if (isOpen && allDataReady) {
      return (
        <OrganizationTab
          list={orgList}
          isOpen={isOpen}
        />
      );
    } else if (isOpen && !allDataReady) {
      return <LoadingPage />;
    } else {
      return <div />;
    }
  } else if (isOpen && !organizationContract) {
    return <NoContract tabName="Organization" />;
  } else {
    return <div />;
  }
};

OrganizationTabContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default OrganizationTabContainer;
