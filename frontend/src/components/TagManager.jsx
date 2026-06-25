import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Tag, Space, ColorPicker, message, List, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

function TagManager({ visible, onClose, apiUrl, onTagsUpdated }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingTag, setEditingTag] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#1890ff');

  useEffect(() => {
    if (visible) {
      fetchTags();
    }
  }, [visible]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTag) {
        // Update existing tag
        const response = await axios.put(`${apiUrl}/tags/${editingTag.id}`, {
          name: values.name,
          color: selectedColor
        });
        setTags(tags.map(t => t.id === editingTag.id ? response.data : t));
        message.success('Tag updated!');
      } else {
        // Create new tag
        const response = await axios.post(`${apiUrl}/tags`, {
          name: values.name,
          color: selectedColor
        });
        setTags([...tags, response.data]);
        message.success('Tag created!');
      }
      form.resetFields();
      setEditingTag(null);
      setSelectedColor('#1890ff');
      if (onTagsUpdated) onTagsUpdated();
    } catch (error) {
      console.error('Error saving tag:', error);
      message.error(error.response?.data?.message || 'Failed to save tag');
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name });
    setSelectedColor(tag.color);
  };

  const handleDelete = async (tagId) => {
    try {
      await axios.delete(`${apiUrl}/tags/${tagId}`);
      setTags(tags.filter(t => t.id !== tagId));
      message.success('Tag deleted!');
      if (onTagsUpdated) onTagsUpdated();
    } catch (error) {
      console.error('Error deleting tag:', error);
      message.error('Failed to delete tag');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingTag(null);
    setSelectedColor('#1890ff');
  };

  return (
    <Modal
      title="Manage Tags"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="inline"
        onFinish={handleSubmit}
        style={{ marginBottom: '24px' }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter tag name!' }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Tag name (e.g., Bug, Design)" size="large" />
        </Form.Item>
        <Form.Item>
          <ColorPicker
            value={selectedColor}
            onChange={(color) => setSelectedColor(color.toHexString())}
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" icon={editingTag ? <EditOutlined /> : <PlusOutlined />}>
            {editingTag ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
        {editingTag && (
          <Form.Item>
            <Button onClick={handleCancel} size="large">Cancel</Button>
          </Form.Item>
        )}
      </Form>

      <List
        loading={loading}
        dataSource={tags}
        locale={{ emptyText: 'No tags yet. Create your first tag above!' }}
        renderItem={(tag) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(tag)}
              />,
              <Popconfirm
                title="Delete this tag?"
                description="It will be removed from all cards."
                onConfirm={() => handleDelete(tag.id)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ]}
          >
            <Tag color={tag.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
              {tag.name}
            </Tag>
          </List.Item>
        )}
      />
    </Modal>
  );
}

export default TagManager;
