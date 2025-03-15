import {Button, Form, Input, message} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import service from "../../utils/request.ts";
import "./RegisterPage.css"

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: '注册成功',
        });
    };

    // 修改 handleSubmit 方法
    const handleSubmit = async (values: RegisterRequest) => {
        try {
            setLoading(true);
            // 移除 confirmPassword 字段

            // const response: ApiResponse = await service.post('/register', values);

            // 动态选择接口地址
            const url = values.secret_key ? '/admin/register' : '/register';

            // 提交数据（可根据需要过滤字段）
            const submitData = values.secret_key
                ? values // 包含密钥的完整数据
                : {...values, secret_key: undefined}; // 移除密钥字段

            const response: ApiResponse = await service.post(url, submitData);

            // console.log(response);
            // console.log(response.data);
            if (response.code === 200) { // 注意数据结构变化

                success()
                // 延迟 1 秒后跳转
                setTimeout(() => {
                    navigate('/');
                }, 1000); // 1000ms = 1秒
            }
        } catch (error: any) {
            // 显示后端返回的具体错误
            message.error(error.response?.error || '注册失败');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="global-centered-container">
            <div className="centered-layout" style={{maxWidth: 600, margin: '0 auto'}}>
                {contextHolder}
                <h2>用户注册</h2>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                >
                    {/* 注册表单内容 */}
                    <Form.Item label="用户名" name="username"
                               rules={[
                                   {required: true, message: '请输入用户名'},
                                   {min: 4, message: '用户名至少4位'},
                                   {max: 20, message: '用户名最多20位'} // 新增
                               ]}>
                        <Input prefix={<UserOutlined/>} placeholder="请输入用户名"/>
                    </Form.Item>
                    {/* 邮箱 */}
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {required: true, message: '请输入邮箱'},
                            {type: 'email', message: '邮箱格式不正确'}
                        ]}
                    >
                        <Input prefix={<MailOutlined/>} placeholder="example@domain.com"/>
                    </Form.Item>


                    <Form.Item
                        name="phone"
                        label="手机号"
                        rules={[
                            {required: true, message: '请输入手机号'},
                            {len: 11, message: '必须11位号码'}
                        ]}
                    >
                        <Input placeholder="13800138000"/>
                    </Form.Item>


                    {/* 密码 */}
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {required: true, message: '请输入密码'},
                            {min: 6, message: '密码至少6位'},
                            {max: 20, message: '密码最多20位'} // 新增
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>}/>
                    </Form.Item>

                    {/* 确认密码 */}
                    <Form.Item
                        name="confirmPassword"
                        label="确认密码"
                        dependencies={['password']}
                        rules={[
                            {required: true, message: '请确认密码'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>}/>
                    </Form.Item>

                    <Form.Item
                        name="secret_key"
                        label="密钥"
                        rules={[
                            {required: false, message: '若要注册Admin账号，请输入密钥'}

                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>}/>
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit"
                                loading={loading}
                                style={{marginLeft: 56}}
                        >注册</Button>
                        <Link to="/" style={{marginLeft: 32}}>
                            返回登录
                        </Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;