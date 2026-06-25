import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Input, Button, Space, Typography, message } from 'antd';
import { PlusOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons';
import ListView from './ListView';
import TagManager from './TagManager';
import MemberManager from './MemberManager';

const { Title, Paragraph } = Typography;

function BoardView({ boardId, apiUrl }) {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showMemberManager, setShowMemberManager] = useState(false);

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      const [boardRes, listsRes] = await Promise.all([
        axios.get(`${apiUrl}/boards/${boardId}`),
        axios.get(`${apiUrl}/boards/${boardId}/lists`)
      ]);
      setBoard(boardRes.data);
      setLists(listsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching board data:', error);
      message.error('Failed to load board data');
      setLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/boards/${boardId}/lists`, {
        name: newListName,
        position: lists.length
      });
      setLists([...lists, response.data]);
      setNewListName('');
      setShowInput(false);
      message.success('List created!');
    } catch (error) {
      console.error('Error creating list:', error);
      message.error('Failed to create list');
    }
  };

  const refreshLists = () => {
    fetchBoardData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Spin size="large" tip="Loading board..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {board && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#262626' }}>
              {board.name}
            </Title>
            {board.description && (
              <Paragraph style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>
                {board.description}
              </Paragraph>
            )}
          </div>
          <Space>
            <Button
              icon={<TagsOutlined />}
              onClick={() => setShowTagManager(true)}
            >
              Manage Tags
            </Button>
            <Button
              icon={<TeamOutlined />}
              onClick={() => setShowMemberManager(true)}
            >
              Manage Members
            </Button>
          </Space>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        minHeight: '500px'
      }}>
        {lists.map((list) => (
          <ListView
            key={list.id}
            list={list}
            boardId={boardId}
            apiUrl={apiUrl}
            allLists={lists}
            onUpdate={refreshLists}
          />
        ))}

        <div style={{
          minWidth: '300px',
          backgroundColor: showInput ? '#f5f5f5' : 'transparent',
          padding: showInput ? '12px' : '0',
          borderRadius: '8px',
          transition: 'all 0.3s'
        }}>
          {showInput ? (
            <Space.Compact style={{ width: '100%' }} direction="vertical">
              <Input
                placeholder="Enter list title..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onPressEnter={handleAddList}
                autoFocus
                size="large"
              />
              <Space style={{ marginTop: '8px' }}>
                <Button type="primary" onClick={handleAddList} disabled={!newListName.trim()}>
                  Add List
                </Button>
                <Button onClick={() => {
                  setShowInput(false);
                  setNewListName('');
                }}>
                  Cancel
                </Button>
              </Space>
            </Space.Compact>
          ) : (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setShowInput(true)}
              style={{
                width: '300px',
                height: '48px',
                fontSize: '16px',
                borderColor: '#d9d9d9'
              }}
            >
              Add another list
            </Button>
          )}
        </div>
      </div>

      <TagManager
        visible={showTagManager}
        onClose={() => setShowTagManager(false)}
        apiUrl={apiUrl}
        onTagsUpdated={refreshLists}
      />

      <MemberManager
        visible={showMemberManager}
        onClose={() => setShowMemberManager(false)}
        apiUrl={apiUrl}
        onMembersUpdated={refreshLists}
      />
    </div>
  );
}

export default BoardView;
