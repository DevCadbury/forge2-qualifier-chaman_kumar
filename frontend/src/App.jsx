import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Tabs, Button, Spin, Empty, Modal, message } from 'antd';
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import BoardView from './components/BoardView';
import BoardForm from './components/BoardForm';
import './App.css';

const { Header, Content } = Layout;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`${API_URL}/boards`);
      setBoards(response.data);
      if (response.data.length > 0 && !selectedBoard) {
        setSelectedBoard(response.data[0].id.toString());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching boards:', error);
      message.error('Failed to load boards');
      setLoading(false);
    }
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const response = await axios.post(`${API_URL}/boards`, boardData);
      setBoards([...boards, response.data]);
      setShowModal(false);
      setSelectedBoard(response.data.id.toString());
      message.success('Board created successfully!');
    } catch (error) {
      console.error('Error creating board:', error);
      message.error('Failed to create board');
    }
  };

  const tabItems = boards.map((board) => ({
    key: board.id.toString(),
    label: (
      <span>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: board.color,
          marginRight: '8px'
        }} />
        {board.name}
      </span>
    ),
    children: <BoardView boardId={board.id} apiUrl={API_URL} />
  }));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading boards..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#001529',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Kanban Board</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
          size="large"
        >
          New Board
        </Button>
      </Header>

      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
        {boards.length === 0 ? (
          <Empty
            description="No boards yet. Create your first board to get started!"
            style={{ marginTop: '100px' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)} size="large">
              Create Board
            </Button>
          </Empty>
        ) : (
          <Tabs
            activeKey={selectedBoard}
            onChange={setSelectedBoard}
            items={tabItems}
            size="large"
            style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}
          />
        )}
      </Content>

      <Modal
        title="Create New Board"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <BoardForm
          onSubmit={handleCreateBoard}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </Layout>
  );
}

export default App;
