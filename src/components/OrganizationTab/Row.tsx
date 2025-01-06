// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Pill, Flex, Button } from 'rimble-ui';

// Styles
import styles from './styles.module.scss';

type OrganizationRow = {
  id: Number;
  name: string;
  canVote:boolean;
};

const OrganizationRow: React.FC<OrganizationRow> = ({ id, name, canVote}) => (
  
  <tr className={styles.row}>
    <td>
      <Flex alignItems="center" className={styles.tooltipFix}>
        {id}
      </Flex>
    </td>
    <td>
      <Flex justifyContent="space-between" alignItems="center">
        {name}
      </Flex>
    </td>
    <td>
      <Flex justifyContent="space-between" alignItems="center">
        {canVote ? 
        <Pill color="#018002" className={styles.pill}>
          Yes
        </Pill> 
      : <Pill color="#FF1C1E" className={styles.pill}>
          No
        </Pill>}
      </Flex>
    </td>
  </tr>
);

OrganizationRow.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    canVote: PropTypes.bool.isRequired
};

export default OrganizationRow;
