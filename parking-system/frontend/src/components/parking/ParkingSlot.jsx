import React from 'react';

const ParkingSlot = ({ slot, isSelected, onSelect, isDisabled }) => {
  const { slotNumber, slotType, status } = slot;

  const getStatusColor = () => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success';
      case 'OCCUPIED': return 'bg-danger';
      case 'RESERVED': return 'bg-warning';
      case 'MAINTENANCE': return 'bg-secondary';
      default: return 'bg-light';
    }
  };

  const getTypeIcon = () => {
    switch (slotType) {
      case 'EV': return 'bi-ev-station';
      case 'DISABLED': return 'bi-handicap';
      default: return 'bi-p-square';
    }
  };

  const isAvailable = status === 'AVAILABLE' && !isDisabled;
  const showSelected = isSelected && isAvailable;

  return (
    <div
      className={`
        parking-slot 
        p-2 m-1 
        border rounded-3 
        text-center 
        cursor-pointer 
        transition-all
        ${showSelected ? 'border-primary border-2 bg-primary bg-opacity-10' : ''}
        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover-shadow'}
      `}
      style={{ 
        width: '70px', 
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={() => isAvailable && onSelect(slot)}
    >
      <i className={`bi ${getTypeIcon()} mb-1 ${getStatusColor()}`}></i>
      <small className="fw-bold">{slotNumber}</small>
      <small className="text-muted" style={{ fontSize: '0.65rem' }}>{slotType}</small>
    </div>
  );
};

export default ParkingSlot;
