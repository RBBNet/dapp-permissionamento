import React, { createContext, ReactNode, useContext } from 'react';
import { Config } from '../util/configLoader';

type Props = {
  children: ReactNode;
  config: Config;
}

type ContextType =
  | {
      config: Config;
    }
  | undefined;

const ConfigDataContext = createContext<ContextType>(undefined);

export const ConfigDataProvider: React.FC<Props> = props => {
  return <ConfigDataContext.Provider value={{ config: props.config }} {...props} />;
};

export const useConfig = () => {
  const context = useContext(ConfigDataContext);

  if (!context) {
    throw new Error('useConfig must be used within a ConfigDataProvider');
  }

  return context.config;
};
