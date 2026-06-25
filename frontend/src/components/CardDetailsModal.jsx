import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, Tag, Avatar, Space, Divider, message, Tooltip } from 'antd';
import { CalendarOutlined, TagsOutlined, UserOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;

function CardDetailsModal({ visible, card, boardId, listId, apiUrl, onClose, onUpdate }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (visible && card) {
      // Load card data into form
      form.setFieldsValue({
        title: card.title,
        description: card.description,
        due_date: card.due_date ? dayjs(card.due_date) : null
      });

      setSelectedTags(card.tags?.map(t => t.id) || []);
      setSelectedMembers(card.members?.map(m => m.id) || []);

      // Fetch available tags and members
      fetchTags();
      fetchMembers();
    }
  }, [visible, card]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Update card details
      const cardData = {
        title: values.title,
        description: values.description || '',
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD HH:mm:ss') : null
      };

      await axios.put(`${apiUrl}/boards/${boardId}/lists/${listId}/cards/${card.id}`, cardData);

      // Update tags
      const currentTagIds = card.tags?.map(t => t.id) || [];
      const tagsToAdd = selectedTags.filter(id => !currentTagIds.includes(id));
      const tagsToRemove = currentTagIds.filter(id => !selectedTags.includes(id));

      for (const tagId of tagsToAdd) {
        await axios.post(`${apiUrl}/cards/${card.id}/tags/${tagId}`);
      }
      for (const tagId of tagsToRemove) {
        await axios.delete(`${apiUrl}/cards/${card.id}/tags/${tagId}`);
      }

      // Update members
      const currentMemberIds = card.members?.map(m => m.id) || [];
      const membersToAdd = selectedMembers.filter(id => !currentMemberIds.includes(id));
      const membersToRemove = currentMemberIds.filter(id => !selectedMembers.includes(id));

      for (const memberId of membersToAdd) {
        await axios.post(`${apiUrl}/cards/${card.id}/members/${memberId}`);
      }
      for (const memberId of membersToRemove) {
        await axios.delete(`${apiUrl}/cards/${card.id}/members/${memberId}`);
      }

      message.success('Card updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating card:', error);
      message.error('Failed to update card');
    } finally {
      setLoading(false);
    }
  };

  if (!card) return null;

  return (
    <Modal
      title="Edit Card"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          Save Changes
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          name="title"
          label="Card Title"
          rules={[{ required: true, message: 'Please enter a title!' }]}
        >
          <Input size="large" placeholder="Enter card title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            rows={4}
            placeholder="Add a more detailed description..."
          />
        </Form.Item>

        <Divider />

        <Form.Item
          name="due_date"
          label={
            <Space>
              <CalendarOutlined />
              Due Date
            </Space>
          }
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <TagsOutlined />
              Tags
            </Space>
          }
        >
          <Select
            mode="multiple"
            placeholder="Select tags"
            value={selectedTags}
            onChange={setSelectedTags}
            size="large"
            style={{ width: '100%' }}
          >
            {tags.map(tag => (
              <Select.Option key={tag.id} value={tag.id}>
                <Tag color={tag.color}>{tag.name}</Tag>
              </Select.Option>
            ))}
          </Select>
          {tags.length === 0 && (
            <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '12px' }}>
              No tags available. Create tags in the board menu.
            </div>
          )}
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <UserOutlined />
              Assign Members
            </Space>
          }
        >
          <Select
            mode="multiple"
            placeholder="Select members"
            value={selectedMembers}
            onChange={setSelectedMembers}
            size="large"
            style={{ width: '100%' }}
          >
            {members.map(member => (
              <Select.Option key={member.id} value={member.id}>
                <Space>
                  <Avatar size="small" src={member.avatar}>
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {member.name}
                </Space>
              </Select.Option>
            ))}
          </Select>
          {members.length === 0 && (
            <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '12px' }}>
              No members available. Add team members in the board menu.
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CardDetailsModal;
