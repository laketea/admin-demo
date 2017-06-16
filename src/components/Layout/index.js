import { Layout, Menu } from 'antd';
import { Link } from 'react-router';

const { Header, Content } = Layout;

export default function HLayout({ children }) {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Link to="/user/manage">用户管理</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/blacklist/manage">黑名单管理</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{children}</div>
      </Content>
    </Layout>
  );
}  