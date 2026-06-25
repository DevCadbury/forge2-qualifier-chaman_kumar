import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Input, Button, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CardView from './CardView';

const { TextArea } = Input;
const { Title } = Typography;

function ListView({ list, boardId, apiUrl, onUpdate, allLists }) {
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [list.id]);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${apiUrl}/boards/${boardId}/lists/${list.id}/cards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      message.error('Failed to load cards');
    }
  };

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/boards/${boardId}/lists/${list.id}/cards`,
        {
          title: newCardTitle,
          position: cards.length
        }
      );
      setCards([...cards, response.data]);
      setNewCardTitle('');
      setShowAddCard(false);
      message.success('Card created!');
    } catch (error) {
      console.error('Error creating card:', error);
      message.error('Failed to create card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`${apiUrl}/boards/${boardId}/lists/${list.id}/cards/${cardId}`);
      setCards(cards.filter(card => card.id !== cardId));
      message.success('Card deleted!');
    } catch (error) {
      console.error('Error deleting card:', error);
      message.error('Failed to delete card');
    }
  };

  const handleMoveCard = async (cardId, targetListId) => {
    try {
      const cardToMove = cards.find(c => c.id === cardId);
      await axios.patch(
        `${apiUrl}/boards/${boardId}/lists/${list.id}/cards/${cardId}/move`,
        {
          list_id: targetListId,
          position: 0
        }
      );
      message.success('Card moved!');
      fetchCards();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error moving card:', error);
      message.error('Failed to move card');
    }
  };

  return (
    <div style={{
      minWidth: '300px',
      maxWidth: '300px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      padding: '12px',
      maxHeight: 'calc(100vh - 300px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
          {list.name}
        </Title>
        <Badge count={cards.length} style={{ backgroundColor: '#8c8c8c' }} />
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {cards.map((card) => (
          <CardView
            key={card.id}
            card={card}
            boardId={boardId}
            listId={list.id}
            apiUrl={apiUrl}
            allLists={allLists}
            onDelete={() => handleDeleteCard(card.id)}
            onUpdate={(targetListId) => {
              if (targetListId) {
                handleMoveCard(card.id, targetListId);
              } else {
                fetchCards();
              }
            }}
          />
        ))}
      </div>

      {showAddCard ? (
        <Card size="small" style={{ marginBottom: '8px' }}>
          <Space.Compact direction="vertical" style={{ width: '100%' }}>
            <TextArea
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
              }}
              autoFocus
              rows={3}
            />
            <Space style={{ marginTop: '8px' }}>
              <Button
                type="primary"
                size="small"
                onClick={handleAddCard}
                disabled={!newCardTitle.trim()}
              >
                Add
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setShowAddCard(false);
                  setNewCardTitle('');
                }}
              >
                Cancel
              </Button>
            </Space>
          </Space.Compact>
        </Card>
      ) : (
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => setShowAddCard(true)}
          style={{
            textAlign: 'left',
            color: '#8c8c8c',
            height: 'auto',
            padding: '8px'
          }}
        >
          Add a card
        </Button>
      )}
    </div>
  );
}

export default ListView;
