import { Col, MenuProps, Row } from 'antd';
import { Layout } from 'antd';
import DepartmentSalaryChart from "../../components/DepartmentSalaryChart.tsx";
import DepartmentHeadcountChart from "../../components/DepartmentHeadcountChart.tsx";
import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import EmployeeTable from "../../components/EmployeeTable.tsx";

const { Header, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#da2505',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: 'white',
    fontSize: 24,
    borderBottomStyle: 'solid',
};

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: 'black',
    backgroundColor: '#fff',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: 'black',
    backgroundColor: '#fff',
};

const layoutStyle = {
    borderRadius: 8,
};

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '1', icon: <PieChartOutlined />, label: '图形数据' },
    { key: '2', icon: <DesktopOutlined />, label: '员工信息' },
    { key: '3', icon: <ContainerOutlined />, label: '部门信息' },
];

const WorkBoardPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('1');

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKey(e.key);
    };

    const menuKeyComponentMap: Record<string, React.ReactNode> = {
        '1': (
            <Row>
                <Col span={12}>
                    <DepartmentSalaryChart />
                </Col>
                <Col span={12}>
                    <DepartmentHeadcountChart />
                </Col>
            </Row>
        ),
        '2': (
            <div style={{maxWidth: 1200, margin: '0 auto'}}>
                {/*<h2 style={{marginBottom: 24}}>员工信息管理</h2>*/}
                <EmployeeTable/>
            </div>
        )
        ,
        '3': <div>部门信息管理（待实现）</div>
    };

    return (
        <Layout style={layoutStyle}>
            <Sider width="10%" style={siderStyle}>
                <div>
                    <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                    <Menu
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        theme="light"
                        inlineCollapsed={collapsed}
                        items={items}
                        selectedKeys={[selectedKey]}
                        onClick={handleMenuClick}
                    />
                </div>
            </Sider>
            <Layout>
                <Header style={headerStyle}>Enterprise Management System</Header>
                <Content style={contentStyle}>
                    {menuKeyComponentMap[selectedKey]}
                </Content>
            </Layout>
        </Layout>
    );
};

export default WorkBoardPage;