// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Table, Box } from 'rimble-ui';
// Components
import AccountTableHeader from './TableHeader';
import AccountRow from './Row';
import EmptyRow from './EmptyRow';
// Styles
import styles from './styles.module.scss';
import { AccountRulesV2 } from '../../chain/@types/AccountRulesV2Impl';

type AccountTable = {
  list: AccountRulesV2.AccountDataStruct[];
  toggleModal: (name: 'add' | 'remove' | 'lock') => (value?: boolean | string) => void;
  deleteTransaction: (identifier: string) => void;
  isAdmin: boolean;
};

const AccountTable: React.FC<AccountTable> = ({ list, toggleModal, deleteTransaction, isAdmin}) => (
  <Box mt={5}>
    <AccountTableHeader
      number={list.length}
      openAddModal={() => toggleModal('add')(true)}
      disabledAdd={!isAdmin}
    />
    <Table mt={4}>
      <thead>
        <tr>
          <th className={styles.headerCell}>Organization ID</th>
          <th className={styles.headerCell}>Account Address</th>
          <th className={styles.headerCell}>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map((acc) => (
          <AccountRow
            key={acc.account}
            orgID={acc.orgId}
            address={acc.account}
            status={acc.active}
            isAdmin={isAdmin}
            deleteTransaction={deleteTransaction}
            openRemoveModal={toggleModal('remove')}
          />
        ))}
        {list.length === 0 && <EmptyRow />}
      </tbody>
    </Table>
  </Box>
);

AccountTable.propTypes = {
  list: PropTypes.array.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default AccountTable;
