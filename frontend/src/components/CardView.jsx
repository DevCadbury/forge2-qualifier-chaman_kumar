import { useState } from 'react';
import { format } from 'date-fns';
import { Card, Tag, Avatar, Space, Popconfirm, Button, Tooltip, Dropdown } from 'antd';
import { CalendarOutlined, UserOutlined, DeleteOutlined, TagsOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import CardDetailsModal from './CardDetailsModal';

function CardView({ card, boardId, listId, apiUrl, onDelete, onUpdate, allLists }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDueDate = (date) => {
    if (!date) return null;
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const isDueSoon = (date) => {
    if (!date) return false;
    const dueDate = new Date(date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getDueDateColor = (date) => {
    if (!date) return 'default';
    if (isOverdue(date)) return 'error';
    if (isDueSoon(date)) return 'warning';
    return 'success';
  };

  const handleMoveCard = async (targetListId) => {
    try {
      await onUpdate(targetListId);
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  const moveMenuItems = allLists
    ?.filter(list => list.id !== listId)
    .map(list => ({
      key: list.id,
      label: list.name,
      onClick: () => handleMoveCard(list.id)
    })) || [];

  return (
    <>
      <Card
        size="small"
        hoverable
        onClick={() => setShowDetails(true)}
        style={{
          cursor: 'pointer',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
        bodyStyle={{ padding: '12px' }}
        actions={[
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            Edit
          </Button>,
          moveMenuItems.length > 0 && (
            <Dropdown
              menu={{ items: moveMenuItems }}
              trigger={['click']}
            >
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                Move
              </Button>
            </Dropdown>
          ),
          <Popconfirm
            title="Delete this card?"
            description="This action cannot be undone."
            onConfirm={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        ].filter(Boolean)}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '8px', color: '#262626' }}>
            {card.title}
          </div>

          {card.description && (
            <div style={{
              fontSize: '12px',
              color: '#8c8c8c',
              marginBottom: '8px',
              whiteSpace: 'pre-wrap',
              maxHeight: '60px',
              overflow: 'hidden'
            }}>
              {card.description}
            </div>
          )}

          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            {card.due_date && (
              <Tag
                icon={<CalendarOutlined />}
                color={getDueDateColor(card.due_date)}
                style={{ margin: 0 }}
              >
                {formatDueDate(card.due_date)}
              </Tag>
            )}

            {card.tags && card.tags.length > 0 && (
              <Space wrap size={4}>
                <TagsOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                {card.tags.map((tag) => (
                  <Tag
                    key={tag.id}
                    color={tag.color}
                    style={{ margin: 0, fontSize: '11px' }}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </Space>
            )}

            {card.members && card.members.length > 0 && (
              <Space size={4} style={{ marginTop: '4px' }}>
                <UserOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                <Avatar.Group maxCount={3} size="small">
                  {card.members.map((member) => (
                    <Tooltip key={member.id} title={member.name}>
                      <Avatar
                        size="small"
                        src={member.avatar}
                        style={{ backgroundColor: '#1890ff' }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </Space>
            )}
          </Space>
        </div>
      </Card>

      <CardDetailsModal
        visible={showDetails}
        card={card}
        boardId={boardId}
        listId={listId}
        apiUrl={apiUrl}
        onClose={() => setShowDetails(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}

export default CardView;
