'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface AppConfig {
  MODBUS_SERVER: string,
  SECC_SERVER: string,
  WEBSOCKET_URL: string,
  CONFIG_PATH: string,
  API_CONFIG_PATH: string
}

export const AppConfigSchema =  [
  'MODBUS_SERVER',
  'SECC_SERVER',
  'WEBSOCKET_URL',
  'CONFIG_PATH',
  'API_CONFIG_PATH'
];

const ConfigContext = createContext<AppConfig | undefined>(undefined);

export const ConfigProvider = ({
  config,
  children,
}: {
  config: AppConfig;
  children: ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const getConfig = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within a ConfigProvider');
  return context;
};
