import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Avatar, List, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

function MemberManager({ visible, onClose, apiUrl, onMembersUpdated }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      fetchMembers();
    }
  }, [visible]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/members`, {
        name: values.name,
        email: values.email,
        avatar: values.avatar || null
      });
      setMembers([...members, response.data]);
      form.resetFields();
      message.success('Member added!');
      if (onMembersUpdated) onMembersUpdated();
    } catch (error) {
      console.error('Error adding member:', error);
      message.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDelete = async (memberId) => {
    try {
      await axios.delete(`${apiUrl}/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
      message.success('Member removed!');
      if (onMembersUpdated) onMembersUpdated();
    } catch (error) {
      console.error('Error deleting member:', error);
      message.error('Failed to remove member');
    }
  };

  return (
    <Modal
      title="Manage Team Members"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginBottom: '24px' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter member name!' }]}
        >
          <Input placeholder="John Doe" prefix={<UserOutlined />} size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email!' },
            { type: 'email', message: 'Please enter valid email!' }
          ]}
        >
          <Input placeholder="john@example.com" prefix={<MailOutlined />} size="large" />
        </Form.Item>
        <Form.Item
          name="avatar"
          label="Avatar URL (Optional)"
        >
          <Input placeholder="https://example.com/avatar.jpg" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" block>
            Add Member
          </Button>
        </Form.Item>
      </Form>

      <List
        loading={loading}
        dataSource={members}
        locale={{ emptyText: 'No members yet. Add your first team member above!' }}
        renderItem={(member) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Remove this member?"
                description="They will be unassigned from all cards."
                onConfirm={() => handleDelete(member.id)}
                okText="Remove"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={48}
                  src={member.avatar}
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={member.name}
              description={member.email}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
}

export default MemberManager;
