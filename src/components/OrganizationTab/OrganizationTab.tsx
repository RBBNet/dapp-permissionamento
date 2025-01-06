import React, { Fragment } from 'react';
import OrganizationTable from './Table';
type OrganizationTab = {
    list: any[];
    isOpen: boolean
}

const OrganizationTab: React.FC<OrganizationTab> = ({
    isOpen,
    list
}) => (
    <Fragment>
      {isOpen && (
        <Fragment>
          <OrganizationTable
            list={list}
          />
        </Fragment>
      )}
    </Fragment>
);

export default OrganizationTab;