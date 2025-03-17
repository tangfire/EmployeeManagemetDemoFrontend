import { Button, DatePicker, Table, message, Card } from 'antd';
import { useState, useEffect } from 'react';

import service from '../utils/request';
import type { ColumnsType } from 'antd/es/table';

import moment from 'moment';  // 新增核心库导入
import type { Moment } from 'moment';  // 保留类型导入


interface AttendanceRecord {
    date: string;
    sign_in_time: string;
    sign_out_time: string;
    status: string;
}

const Attendance: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<'已签到' | '未签到'>('未签到');
    const [selectedMonth, setSelectedMonth] = useState<Moment>();
    const [dataSource, setDataSource] = useState<AttendanceRecord[]>([]);

    // 初始化加载当月数据
    useEffect(() => {
        const currentMonth = selectedMonth || moment();
        fetchAttendance(currentMonth.format('YYYY-MM'));
    }, []);

    // 获取考勤数据
    const fetchAttendance = async (monthStr: string) => {
        setLoading(true);
        try {
            const response = await service.get('/attendance', {
                params: { month: monthStr }
            });
            setDataSource(response.data.data);
            checkCurrentStatus(response.data.data);
        } catch (error) {
            message.error('获取考勤数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 检查当天签到状态
    const checkCurrentStatus = (records: AttendanceRecord[]) => {
        const today = moment().format('YYYY-MM-DD');
        const todayRecord = records.find(r => r.date === today);
        setCurrentStatus(todayRecord?.sign_in_time ? '已签到' : '未签到');
    };

    // 签到操作
    const handleSignIn = async () => {
        try {
            await service.post('/sign-records/sign-in');
            message.success('签到成功');
            const currentMonth = selectedMonth || moment();
            fetchAttendance(currentMonth.format('YYYY-MM'));
        } catch (error) {
            message.error('签到失败');
        }
    };

    // 签退操作
    const handleSignOut = async () => {
        try {
            await service.post('/sign-records/sign-out');
            message.success('签退成功');
            const currentMonth = selectedMonth || moment();
            fetchAttendance(currentMonth.format('YYYY-MM'));
        } catch (error) {
            message.error('签退失败');
        }
    };

    // 表格列定义
    const columns: ColumnsType<AttendanceRecord> = [
        { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
        {
            title: '签到时间',
            dataIndex: 'sign_in_time',
            render: (text) => text || <span style={{ color: '#ff4d4f' }}>未签到</span>,
            width: 100
        },
        {
            title: '签退时间',
            dataIndex: 'sign_out_time',
            render: (text) => text || <span style={{ color: '#ff4d4f' }}>未签退</span>,
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status) => (
                <span style={{
                    color: status === '正常' ? '#52c41a' : '#ff4d4f',
                    fontWeight: 500
                }}>
                    {status === '正常' ? '✅' : '⚠️'} {status}
                </span>
            ),
            width: 100
        }
    ];

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>考勤记录</span>
                    <DatePicker.MonthPicker
                        value={selectedMonth}
                        onChange={(m) => {
                            setSelectedMonth(m);
                            m && fetchAttendance(m.format('YYYY-MM'));
                        }}
                        style={{ width: 200 }}
                    />
                </div>
            }
        >
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <Button
                    type="primary"
                    onClick={handleSignIn}
                    disabled={currentStatus === '已签到'}
                    style={{ marginRight: 24, width: 120 }}
                >
                    {currentStatus === '已签到' ? '已签到' : '点击签到'}
                </Button>
                <Button
                    danger
                    onClick={handleSignOut}
                    disabled={currentStatus === '未签到'}
                    style={{ width: 120 }}
                >
                    签退
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                rowKey="date"
                pagination={{ pageSize: 20 }}
                scroll={{ x: 500 }}
                bordered
            />
        </Card>
    );
};

export default Attendance;