import { Button, Col, Layout, Menu, MenuProps, Row } from 'antd';
import DepartmentSalaryChart from "../../components/DepartmentSalaryChart.tsx";
import DepartmentHeadcountChart from "../../components/DepartmentHeadcountChart.tsx";
import Attendance from '../../components/Attendance.tsx';
import React, { useEffect, useState, useMemo } from 'react';
import {
    ContainerOutlined,
    DesktopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
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

const WorkBoardPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    // 监听 localStorage 变化
    useEffect(() => {
        const checkUserRole = () => {
            const currentRole = localStorage.getItem('userRole');
            if (currentRole !== userRole) {
                setUserRole(currentRole);
            }
        };
        // 监听 storage 事件，以应对跨标签页修改
        window.addEventListener('storage', checkUserRole);
        return () => window.removeEventListener('storage', checkUserRole);
    }, [userRole]);

    // 动态生成菜单项
    const items: MenuItem[] = useMemo(() => {
        const baseItems: MenuItem[] = [
            { key: '1', icon: <PieChartOutlined />, label: '图形数据' },
            { key: '2', icon: <DesktopOutlined />, label: '员工信息' },
            { key: '3', icon: <ContainerOutlined />, label: '请假审批' },
            { key: '4', icon: <ContainerOutlined />, label: '打卡情况' },

        ];
        return userRole === 'admin'
            ? baseItems.filter(item => item?.key === '1' || item?.key === '2' || item?.key === '3')
            : baseItems.filter(item => item?.key === '3' || item?.key === '4');
    }, [userRole]);

    const [selectedKey, setSelectedKey] = useState(() => {
        const savedKey = localStorage.getItem('selectedMenuKey');
        return userRole === 'admin' ? savedKey || '1' : '3';
    });

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setSelectedKey(e.key);
        localStorage.setItem('selectedMenuKey', e.key);
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
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <EmployeeTable />
            </div>
        ),
        '3': (<div>hello world</div>),
        '4':(
            <div>
                <Attendance />
            </div>
        )

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