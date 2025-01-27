import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import { AppHeader } from '../components/AppHeader';

const { Content } = Layout;

interface AppLayoutProps {
  children?: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <AppHeader />
      <Content
        style={{
          marginTop: 64,
          overflow: 'hidden',
          height: 'calc(100vh - 64px)',
        }}>
        {children}
      </Content>
    </Layout>
  );
};
