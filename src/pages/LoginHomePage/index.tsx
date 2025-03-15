import React from 'react';
import {FormProps, message} from 'antd';
import {Button, Form, Input} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import service from "../../utils/request.ts";
import "./LoginHomePage.css"

type FieldType = {
    username?: string;
    password?: string;

};


const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const LoginHomePage: React.FC = () => {


    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: '登录成功',
        });
    };

// 修改 handleLogin 方法
    const handleLogin = async (values: LoginRequest) => {
        try {
            setLoading(true);

            const response: ApiResponse = await service.post('/login', values);

            // console.log(response);
            // console.log(response.data);
            if (response.code === 200) { // 注意数据结构变化

                // ✅ 正确存储 Token
                localStorage.setItem('token', response.data.token);

                success()
                // 延迟 1 秒后跳转
                setTimeout(() => {
                    navigate('/work');
                }, 1000); // 1000ms = 1秒
            }
        } catch (error: any) {
            // 显示后端返回的具体错误
            message.error(error.response?.error || '登录失败');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="global-centered-container">
            <div className="centered-layout">

                {contextHolder}
                <h2>用户登录</h2>
                <Form
                    name="basic"
                    labelCol={{span: 6}}
                    form={form}
                    wrapperCol={{span: 18}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    onFinish={handleLogin}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}
                            , {min: 4, message: '用户名至少4位'},
                            {max: 20, message: '用户名最多20位'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}, {
                            min: 6,
                            message: '密码至少6位'
                        },
                            {max: 20, message: '密码最多20位'}]}
                    >
                        <Input.Password/>
                    </Form.Item>


                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            登录
                        </Button>
                        {/* 修改为 Link 组件 */}
                        <Link to="/register" style={{marginLeft: 16}}>
                            注册
                        </Link>

                    </Form.Item>
                </Form>
            </div>
        </div>

    )
};

export default LoginHomePage;