import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import styles from './KanbanBoard.module.css';

const COLUMNS = [
  { id: 'applied', label: 'Applied', headerClass: 'applied' },
  { id: 'interview', label: 'Interview', headerClass: 'interview' },
  { id: 'offer', label: 'Offer', headerClass: 'offer' },
  { id: 'rejected', label: 'Rejected', headerClass: 'rejected' },
];

const COLUMN_IDS = new Set(COLUMNS.map((column) => column.id));

function KanbanCard({ application, onEdit, isDragging = false }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
    data: { status: application.status },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.company}>{application.company}</h3>
        {application.starred && <span className={styles.star}>★</span>}
      </div>
      <p className={styles.role}>{application.role}</p>
      {application.notes && (
        <p className={styles.notes}>{application.notes}</p>
      )}
      <div className={styles.cardFooter}>
        <span className={styles.date}>
          {new Date(application.date_applied).toLocaleDateString()}
        </span>
        <button
          type="button"
          className={styles.editButton}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(application);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function KanbanCardPreview({ application }) {
  return (
    <div className={`${styles.card} ${styles.cardOverlay}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.company}>{application.company}</h3>
        {application.starred && <span className={styles.star}>★</span>}
      </div>
      <p className={styles.role}>{application.role}</p>
    </div>
  );
}

function KanbanColumn({ column, applications, onEdit }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className={styles.column}>
      <div className={`${styles.columnHeader} ${styles[column.headerClass]}`}>
        <h2 className={styles.columnTitle}>{column.label}</h2>
        <span className={styles.columnCount}>{applications.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`${styles.columnBody} ${isOver ? styles.columnBodyOver : ''}`}
      >
        {applications.length === 0 ? (
          <p className={styles.emptyColumn}>Drop jobs here</p>
        ) : (
          applications.map((application) => (
            <KanbanCard
              key={application.id}
              application={application}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

function KanbanBoard({ applications, onEdit, onStatusChange, emptyMessage = 'No jobs added yet. Add your first job!' }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null;

  const resolveDropStatus = (overId) => {
    if (COLUMN_IDS.has(overId)) {
      return overId;
    }

    const targetApplication = applications.find((app) => app.id === overId);
    return targetApplication?.status ?? null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const newStatus = resolveDropStatus(over.id);
    const application = applications.find((app) => app.id === active.id);

    if (!application || !newStatus || application.status === newStatus) {
      return;
    }

    onStatusChange(application.id, newStatus);
  };

  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveId(event.active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className={styles.board}>
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            applications={applications.filter((app) => app.status === column.id)}
            onEdit={onEdit}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <KanbanCardPreview application={activeApplication} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
