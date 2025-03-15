// src/components/DepartmentSalaryChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { message } from 'antd';
import service from '../utils/request';


const DepartmentSalaryChart = () => {
    const [chartData, setChartData] = useState<DepartmentSalaryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response:ApiResponse = await service.get('/admin/departments/salary-averages');
                if (response.code === 200) {
                    setChartData(response.data);
                }
            } catch (error) {
                message.error('获取数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getOption = () => {
        const departments = chartData.map(item => item.depart);
        const salaries = chartData.map(item => item.avg_salary);

        return {
            title: {
                text: '部门平均薪资',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const data = params[0];
                    return `${data.name}<br/>平均薪资: ¥${data.value.toFixed(2)}`;
                }
            },
            xAxis: {
                type: 'category',
                data: departments,
                // axisLabel: {
                //     rotate: 45 // 部门名称较长时旋转角度
                // }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value: number) => `¥${value.toFixed(0)}`
                }
            },
            series: [{
                data: salaries,
                type: 'bar',
                itemStyle: {
                    color: '#ee7959' // 使用 Ant Design 主色
                },
                barWidth: '60%'
            }],
            grid: {
                left: '10%',
                right: '5%',
                bottom: '20%'
            }
        };
    };

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>数据加载中...</div>
            ) : (
                <ReactECharts
                    option={getOption()}
                    style={{ height: '500px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                />
            )}
        </div>
    );
};

export default DepartmentSalaryChart;