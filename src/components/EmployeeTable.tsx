// src/components/EmployeeTable.tsx
import React, {useEffect, useState} from 'react';
import {Table, Input, Space, Button, TablePaginationConfig} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {SearchOutlined} from '@ant-design/icons';
import service from '../utils/request';


const EmployeeTable = () => {
    const [data, setData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    // 修改分页配置类型
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,  // 新增分页控件配置
        showQuickJumper: true
    });
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
            filterDropdown: ({setSelectedKeys, confirm}) => (
                <div style={{padding: 8}}>
                    <Input
                        placeholder="搜索姓名"
                        onChange={e => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm();
                        }}
                        style={{width: 188, marginBottom: 8, display: 'block'}}
                    />
                </div>
            ),
            filterIcon: <SearchOutlined/>,
        },
        {
            title: '部门',
            dataIndex: 'dep_id',
            render: depId => `部门 ${depId}`, // 实际项目需关联部门名称
            filters: [
                {text: '技术部', value: 1},
                {text: '市场部', value: 2},
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
                {text: '男', value: '男'},
                {text: '女', value: '女'},
                {text: '其他', value: '其他'},
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
                {text: '在职', value: '在职'},
                {text: '离职', value: '离职'},
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
                    search: searchText,
                    ...params // 优先级高于组件状态
                }
            });

            setData(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 修改 EmployeeTable.tsx 的 useEffect
    useEffect(() => {
        // 新增页面初始化请求
        if (!searchText) fetchData({ page: 1, pageSize: 10 });
    }, [searchText]); // 保留原有依赖

    const handleTableChange: TableProps<Employee>['onChange'] = (
        newPagination,
        filters,
        sorter
    ) => {
        // 直接使用新分页参数
        const params = {
            page: newPagination.current,
            pageSize: newPagination.pageSize,
            sortField: (sorter as any).field,
            sortOrder: (sorter as any).order,
            ...filters
        };

        // 合并分页状态
        setPagination(prev => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize
        }));

        fetchData(params); // 立即用新参数请求
    };

    return (
        <div style={{padding: 24, background: '#fff'}}>
            <div style={{marginBottom: -48}}>
                <Input.Search
                    placeholder="输入姓名/职位/电话搜索"
                    onSearch={value => setSearchText(value)}
                    style={{width: 400}}
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
                scroll={{x: 1300}}
            />

        </div>
    );
};

export default EmployeeTable;