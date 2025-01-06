
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Table, Box } from 'rimble-ui';

import styles from './styles.module.scss';
import TableHeader from './TableHeader';
import OrganizationRow from './Row';
import EmptyRow from './EmptyRow';

type OrganizationTable = {
  list: { id: Number; name: string; canVote:boolean }[];
};


const OrganizationTable: React.FC<OrganizationTable> = ({ list }) => 
(
    <Box mt={5}>
      <TableHeader
        number={list.length}
      />
      <Table mt={4}>
        <thead>
          <tr>
            <th className={styles.headerCell}>ID</th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Can Vote</th>
          </tr>
        </thead>
        <tbody>
          {list.map((org) => (
            <OrganizationRow
              key={org.id.toString()}
              id={org.id}
              name={org.name}
              canVote={org.canVote}
            />
          ))}
          {list.length === 0 && <EmptyRow />}
        </tbody>
      </Table>
    </Box>
  )


export default OrganizationTable;