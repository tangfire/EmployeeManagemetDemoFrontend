// src/components/EmployeeTable.tsx
import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Button } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import service from '../utils/request';

interface Employee {
    emp_id: number;
    username: string;
    position: string;
    dep_id: number;
    gender: string;
    email: string;
    phone: string;
    salary: number;
    status: string;
}

const EmployeeTable = () => {
    const [data, setData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');

    const columns: ColumnsType<Employee> = [
        {
            title: '工号',
            dataIndex: 'emp_id',
            sorter: true,
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'username',
            filterDropdown: ({ setSelectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="搜索姓名"
                        onChange={e => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm();
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                </div>
            ),
            filterIcon: <SearchOutlined />,
        },
        {
            title: '部门',
            dataIndex: 'dep_id',
            render: depId => `部门 ${depId}`, // 实际项目需关联部门名称
            filters: [
                { text: '技术部', value: 1 },
                { text: '市场部', value: 2 },
            ],
        },
        {
            title: '职位',
            dataIndex: 'position',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            filters: [
                { text: '男', value: '男' },
                { text: '女', value: '女' },
                { text: '其他', value: '其他' },
            ],
        },
        {
            title: '薪资',
            dataIndex: 'salary',
            sorter: true,
            render: value => `¥${value.toLocaleString()}`,
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
                { text: '在职', value: '在职' },
                { text: '离职', value: '离职' },
            ],
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="link">查看</Button>
                    <Button type="link">编辑</Button>
                </Space>
            ),
        },
    ];

    const fetchData = async (params: any = {}) => {
        setLoading(true);
        try {
            const response = await service.get('/admin/employees', {
                params: {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    search: searchText,
                    ...params,
                },
            });

            setData(response.data.data);
            setPagination({
                ...pagination,
                total: response.data.total,
            });
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.current, searchText]);

    const handleTableChange: TableProps<Employee>['onChange'] = (
        newPagination,
        filters,
        sorter
    ) => {
        const params: any = {
            ...filters,
            sortField: (sorter as any).field,
            sortOrder: (sorter as any).order,
        };

        setPagination({
            ...pagination,
            ...newPagination,
        });

        fetchData(params);
    };

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <div style={{ marginBottom: 16 }}>
                <Input.Search
                    placeholder="输入姓名/职位/电话搜索"
                    onSearch={value => setSearchText(value)}
                    style={{ width: 400 }}
                    enterButton
                />
            </div>

            <Table
                columns={columns}
                rowKey="emp_id"
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 1300 }}
            />
        </div>
    );
};

export default EmployeeTable;