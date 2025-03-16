// 修改后的 App.tsx
import './App.css'
import {ConfigProvider} from "antd";
import React from "react";

import {RouterProvider} from "react-router-dom";
import router from "./router";


const App: React.FC = () => (
    // return <RouterProvider router={router} />

    <ConfigProvider
        theme={{
            token: {
                // Seed Token，影响范围大
                colorPrimary: '#da2505',
                borderRadius: 2,

                // 派生变量，影响范围小
                colorBgContainer: 'white',
            },
            components: {
                Table: {
                    colorBgContainer: '#fff', // 表格背景色
                    colorText: 'rgba(0, 0, 0, 0.88)', // 表格文字颜色
                    headerBg: '#fafafa', // 表头背景
                    stickyScrollBarBg: "#ff7f50",
                }
            }
        }}
    >

        {/*<LoginLoginHomePage></LoginLoginHomePage>*/}
        {/* 替换为路由提供者 */}
        <RouterProvider router={router} />
    </ConfigProvider>

)

export default App