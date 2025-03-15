// src/components/DepartmentHeadcountChart.tsx
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { message } from 'antd';
import service from '../utils/request';



const DepartmentHeadcountChart = () => {
    const [chartData, setChartData] = useState<DepartmentHeadcountData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response:ApiResponse = await service.get('/admin/departments/headcounts');
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
        const data = chartData.map(item => ({
            name: item.depart,
            value: item.headcount,
            percentage: item.percentage.toFixed(2) + '%'
        }));

        return {
            title: {
                text: '部门人员分布占比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: ({ data }: any) => `
        <strong>${data.name}</strong><br/>
        人数: ${data.value} 人<br/>
        占比: ${data.percentage}
      `
            },
            series: [{
                type: 'pie',
                radius: ['35%', '65%'], // 环形饼图
                data: data,
                label: {
                    formatter: ({ percent }: any) => `${percent}%`, // 标签显示百分比
                    fontSize: 14
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18
                    }
                }
            }],
            legend: {
                orient: 'vertical',
                right: 20,
                top: 'middle',
                formatter: (name: string) => {
                    const item = data.find(d => d.name === name);
                    return `${name}（${item?.value}人）`; // 图例显示人数
                }
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

export default DepartmentHeadcountChart;