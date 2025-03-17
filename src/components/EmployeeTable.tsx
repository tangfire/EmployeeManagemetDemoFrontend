// src/components/EmployeeTable.tsx
import React, {useEffect, useState} from 'react';
import {Button, Input, message, Space, Table, TablePaginationConfig, Upload} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
// 在EmployeeTable.tsx中添加导出按钮和逻辑
import {FileExcelOutlined, SearchOutlined} from '@ant-design/icons';
import service from '../utils/request';
import {saveAs} from 'file-saver';


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

    const [departments, setDepartments] = useState<{ dep_id: number; depart: string }[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    const importSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '导入成功',
        });
    };

    const importError = () => {
        messageApi.open({
            type: 'error',
            content: '导入失败',
        });
    };

    const exportSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '导出成功',
        });
    };

    const exportError = () => {
        messageApi.open({
            type: 'error',
            content: '导出失败',
        });
    };

    useEffect(() => {
        service.get('/departments').then(res => {
            setDepartments(res.data);
        });
    }, []);

    // 导出方法
    const exportEmployees = async () => {
        try {
            const response = await service.get('/admin/employees/export', {
                responseType: 'blob' // 关键：接收二进制流
            });
            saveAs(new Blob([response]), `员工信息_${new Date().toISOString()}.xlsx`);
            exportSuccess()
        } catch (error) {
            exportError()
        }
    };


    const customRequest = async ({file}) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await service.post('/admin/employees/import', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            importSuccess()
            fetchData(); // 刷新表格
        } catch (error) {
            importError()
        }

    };


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

            dataIndex: 'dep_id', // 显示部门ID
            render: depId => departments.find(d => d.dep_id === depId)?.depart || '未知', // 手动映射名称
            // render: depId => `部门 ${depId}`,
            // filters: [
            //     {text: '技术部', value: 1}, // value 对应 dep_id
            //     {text: '市场部', value: 2},
            //     {text: '财务部', value: 3}
            // ],
            filters: departments.map(d => ({
                text: d.depart,  // 使用部门名称
                value: d.dep_id   // 使用部门ID
            })),
            // 新增筛选参数映射
            filterMultiple: false, // 单选模式
            onFilter: (value, record) => record.dep_id === value, // 映射筛选关系
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
                    // 合并搜索参数（优先级高于其他参数）
                    search: searchText,
                    ...params
                }
            });

            setData(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total,
                current: params.page || 1 // 同步页码
            }));
        } catch (error) {
            console.error('获取数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 添加防抖处理（300ms延迟）
        const handler = setTimeout(() => {
            fetchData({
                page: 1, // 搜索时重置到第一页
                pageSize: pagination.pageSize,
                search: searchText
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [searchText]); // 保持依赖

    const handleTableChange: TableProps<Employee>['onChange'] = (
        newPagination,
        filters,
        sorter
    ) => {

        // 转换部门筛选参数名
        const processedFilters = {
            ...filters,
            dep_id: filters.dep_name // 将 dep_name 筛选参数映射到 dep_id
        };
        delete processedFilters.dep_name; // 移除冗余参数

        // 直接使用新分页参数
        const params = {
            page: newPagination.current,
            pageSize: newPagination.pageSize,
            sortField: (sorter as any).field,
            sortOrder: (sorter as any).order,
            ...processedFilters
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

            <div style={{
                marginBottom: 24, // 调整底部间距
                display: 'flex',
                justifyContent: 'space-between', // 左右两端对齐
                alignItems: 'center' // 垂直居中
            }}>
                {contextHolder}
                <Input.Search
                    placeholder="输入姓名/职位/电话搜索"
                    onSearch={value => {
                        setSearchText(value);
                        // 立即触发搜索（不等待防抖）
                        fetchData({ page: 1, pageSize: pagination.pageSize });
                    }}
                    style={{ width: 400 }}
                    enterButton
                />
                <Button
                    type="primary"
                    icon={<FileExcelOutlined/>}
                    onClick={exportEmployees}
                    style={{marginLeft: 560,}}
                >
                    导出Excel
                </Button>

                <Upload
                    customRequest={customRequest}
                    accept=".xlsx"
                    showUploadList={false}

                >
                    <Button
                        style={{marginLeft: 8,backgroundColor:"#da2505",color: 'white'}}
                    >
                        导入Excel
                    </Button>
                </Upload>
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