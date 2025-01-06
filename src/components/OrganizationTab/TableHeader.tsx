// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Flex, Box, Heading, Button } from 'rimble-ui';

type TableHeader = {
  number: Number;
};

const TableHeader: React.FC<TableHeader> = ({ number }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Heading.h2 fontWeight="700">Organizations ({number})</Heading.h2>
    </Box>

  </Flex>
);

export default TableHeader;