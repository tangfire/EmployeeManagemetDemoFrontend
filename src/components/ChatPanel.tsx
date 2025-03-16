// src/components/ChatPanel.tsx
import React, { useState, useEffect } from 'react';
import {List, Input, Button, Avatar, Card, message} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from "axios";

interface ChatUser {
    id: number;
    name: string;
    online: boolean;

}

// 模拟员工数据
const mockEmployees = [
    { id: 1, name: '张三', online: true },
    { id: 2, name: '李四', online: false },
    // ...其他员工数据
];

interface Message {
    senderId: number;
    content: string;
    timestamp: number;
}

const ChatPanel: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMsg, setInputMsg] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
// 状态管理
    const [chatusers, setChatUsers] = useState<ChatUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChatUsers = async () => {
        const token = localStorage.getItem('token');
        return axios.get('/api/chat-users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    // 初始化数据获取
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchChatUsers();
                setChatUsers(response.data.data);
            } catch (err) {
                message.error('员工数据加载失败');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 实时更新在线状态（结合WebSocket）
    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            // 更新在线状态逻辑
            setChatUsers(prev => prev.map(emp =>
                emp.id === msg.senderId ? { ...emp, online: true } : emp
            ));
        };
    }, [ws]);

    // 初始化WebSocket连接
    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = new WebSocket(`ws://localhost:8080/api/chat/ws?token=${token}`);

        socket.onopen = () => {
            console.log('WebSocket连接成功');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prev => [...prev, newMessage]);
        };

        return () => socket.close();
    }, []);

    // 发送消息
    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN && selectedUser && inputMsg.trim()) {
            const message = {
                receiverId: selectedUser,
                content: inputMsg,
                timestamp: Date.now()
            };
            ws.send(JSON.stringify(message));
            setInputMsg('');
        }
    };

    return (
        <Card title="员工通讯" bordered={false}>
            <div style={{ display: 'flex', height: '60vh' }}>
                {/* 左侧员工列表 */}
                <div style={{ width: 200, borderRight: '1px solid #f0f0f0' }}>
                    <List
                        dataSource={chatusers}
                        renderItem={chatuser => (
                            <List.Item
                                onClick={() => setSelectedUser(chatuser.id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedUser === chatuser.id ? '#e6f7ff' : 'inherit'
                                }}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={chatuser.name}
                                    description={chatuser.online ? '在线' : '离线'}
                                />
                            </List.Item>
                        )}
                    />
                </div>

                {/* 右侧聊天区域 */}
                <div style={{ flex: 1, padding: '0 16px' }}>
                    {selectedUser ? (
                        <>
                            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            textAlign: msg.senderId === selectedUser ? 'left' : 'right',
                                            margin: '8px 0'
                                        }}
                                    >
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            background: msg.senderId === selectedUser ? '#f5f5f5' : '#1890ff',
                                            color: msg.senderId === selectedUser ? '#333' : 'white'
                                        }}>
                                            {msg.content}
                                            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Input.Group compact style={{ marginTop: 16 }}>
                                <Input
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                    onPressEnter={sendMessage}
                                    placeholder="输入消息..."
                                />
                                <Button type="primary" onClick={sendMessage}>发送</Button>
                            </Input.Group>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>请选择聊天对象</div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ChatPanel;