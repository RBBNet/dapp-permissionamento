// Libs
import React, { useState } from 'react';
// Components
import Dashboard from '../../components/Dashboard/Dashboard';
// Constant
import { ACCOUNT_TAB, ORGANIZATION_TAB } from '../../constants/tabs';

const DashboardContainer: React.FC = () => {
  const [tab, setTab] = useState(ORGANIZATION_TAB);
  return <Dashboard tab={tab} setTab={setTab} />;
};

export default DashboardContainer;
