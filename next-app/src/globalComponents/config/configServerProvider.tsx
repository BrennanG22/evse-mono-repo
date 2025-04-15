import { ReactNode } from 'react';
import { ConfigProvider, AppConfig, AppConfigSchema } from '@/globalComponents/config/configContext';
import readConfig from '@/globalComponents/config/configManager';
import { redirect } from 'next/navigation';

export default async function ServerSideConfigProvider({ children }: { children: ReactNode }) {
  const configData = await readConfig();
  if (configData === null) {
    redirect('/')
  }
  const config = mapData(configData);
  readConfig();
  return (
    <ConfigProvider config={config}>
      {children}
    </ConfigProvider>
  );
}

function mapData(configData: Map<string, string>): AppConfig {
  try {
    // AppConfigSchema.forEach((key) => {
    //   const value = configData.get(key);
    //   if (value === undefined){
    //     //Got to error page with no context
    //     // redirect('/');
    //     console.log(key);
    //   }
    // // });
    const config: AppConfig = {
      MODBUS_SERVER: configData.get('MODBUS_SERVER')??'',
      SECC_SERVER: configData.get('SECC_SERVER')??'',
      WEBSOCKET_URL: configData.get('WEBSOCKET_URL')??'',
      CONFIG_PATH: configData.get('CONFIG_PATH')??'',
      API_CONFIG_PATH: configData.get('API_CONFIG_PATH')??''
    }
    
    return config;
  }
  catch (e) {
    // redirect('/')
    console.log(e);
    const config: AppConfig = {
      MODBUS_SERVER: configData.get('MODBUS_SERVER')??'',
      SECC_SERVER: configData.get('SECC_SERVER')??'',
      WEBSOCKET_URL: configData.get('WEBSOCKET_URL')??'',
      CONFIG_PATH: configData.get('CONFIG_PATH')??'',
      API_CONFIG_PATH: configData.get('API_CONFIG_DATA')??''
    }
    return config;
  }
}
