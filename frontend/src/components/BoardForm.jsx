import { useState } from 'react';
import { Form, Input, Button, Space, Row, Col } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { TextArea } = Input;

function BoardForm({ onSubmit, onCancel }) {
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState('#0066ff');

  const colorPresets = [
    { color: '#0066ff', name: 'Blue' },
    { color: '#00aa00', name: 'Green' },
    { color: '#ff6600', name: 'Orange' },
    { color: '#cc00cc', name: 'Purple' },
    { color: '#ff0000', name: 'Red' },
    { color: '#00cccc', name: 'Cyan' },
    { color: '#ffcc00', name: 'Yellow' },
    { color: '#808080', name: 'Gray' },
  ];

  const handleSubmit = (values) => {
    onSubmit({
      name: values.name,
      description: values.description || '',
      color: selectedColor
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        description: '',
      }}
      style={{ marginTop: '20px' }}
    >
      <Form.Item
        label="Board Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a board name!' }]}
      >
        <Input
          placeholder="e.g., Product Roadmap, Sprint Planning"
          size="large"
          autoFocus
        />
      </Form.Item>

      <Form.Item
        label="Description (Optional)"
        name="description"
      >
        <TextArea
          placeholder="What is this board for?"
          rows={3}
          size="large"
        />
      </Form.Item>

      <Form.Item label="Board Color">
        <Row gutter={[12, 12]}>
          {colorPresets.map(({ color, name }) => (
            <Col key={color}>
              <div
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedColor === color ? '3px solid #1890ff' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: selectedColor === color ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                }}
                title={name}
              >
                {selectedColor === color && (
                  <CheckOutlined style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }} />
                )}
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#8c8c8c' }}>Custom:</span>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{
              width: '60px',
              height: '40px',
              border: '2px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <span style={{ color: '#595959', fontWeight: 500 }}>{selectedColor}</span>
        </div>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
        <Space size="middle">
          <Button type="primary" htmlType="submit" size="large">
            Create Board
          </Button>
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default BoardForm;
