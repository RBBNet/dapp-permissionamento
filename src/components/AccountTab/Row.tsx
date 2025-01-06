// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Pill, Flex, Button } from 'rimble-ui';
// Constant
import { PENDING_ADDITION, PENDING_REMOVAL, FAIL_ADDITION, FAIL_REMOVAL } from '../../constants/transactions';
// Components
import TextWithTooltip from './TextWithTooltip';
// Styles
import styles from './styles.module.scss';
import { BigNumberish } from 'ethers';

type AccountRow = {
  orgID: BigNumberish;
  address: string;
  status: boolean;
  isAdmin: boolean;
  deleteTransaction: (address: string) => void;
  openRemoveModal: (address: string) => void;
};

const AccountRow: React.FC<AccountRow> = ({ orgID, address, status, isAdmin, deleteTransaction, openRemoveModal }) => (
  <tr className={styles.row}>
    <td>
      <Flex alignItems="center" justifyContent="space-between">
        {orgID}
      </Flex>
    </td>
    <td>
      <Flex alignItems="center" justifyContent="space-between">
        {address}
      </Flex>
    </td>
    <td>
      <Flex justifyContent="space-between" alignItems="center">
        {status? (
          <Pill color="#018002" className={styles.pill}>
            Active
          </Pill>
        ) : !status ? (
          <Pill color="#FF1C1E" className={styles.pill}>
            Inactive
          </Pill>
        ): (
          <div />
        )}
      </Flex>
    </td>
  </tr>
);

AccountRow.propTypes = {
  orgID: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  openRemoveModal: PropTypes.func.isRequired
};

export default AccountRow;
