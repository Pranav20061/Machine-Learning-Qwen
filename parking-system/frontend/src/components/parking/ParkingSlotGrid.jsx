import React from 'react';
import ParkingSlot from './ParkingSlot';

const ParkingSlotGrid = ({ slots, selectedSlot, onSlotSelect, disabledSlots = [] }) => {
  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox display-4 text-muted"></i>
        <p className="text-muted mt-3">No parking slots available</p>
      </div>
    );
  }

  // Group slots by floor
  const slotsByFloor = slots.reduce((acc, slot) => {
    const floor = slot.floor || 'Ground';
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(slot);
    return acc;
  }, {});

  return (
    <div className="parking-slot-grid">
      {Object.entries(slotsByFloor).map(([floor, floorSlots]) => (
        <div key={floor} className="mb-4">
          <h6 className="fw-semibold mb-3">
            <i className="bi bi-building me-2"></i>
            {floor} Floor
          </h6>
          <div className="d-flex flex-wrap justify-content-center p-3 bg-light rounded-3">
            {floorSlots.map((slot) => (
              <ParkingSlot
                key={slot._id}
                slot={slot}
                isSelected={selectedSlot?._id === slot._id}
                onSelect={onSlotSelect}
                isDisabled={disabledSlots.includes(slot._id)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="card border-0 bg-light mt-4">
        <div className="card-body p-3">
          <h6 className="fw-semibold mb-3">Legend</h6>
          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex align-items-center">
              <span className="badge bg-success me-2"></span>
              <small>Available</small>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-danger me-2"></span>
              <small>Occupied</small>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-warning me-2"></span>
              <small>Reserved</small>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-secondary me-2"></span>
              <small>Maintenance</small>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-ev-station me-2"></i>
              <small>EV Charging</small>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-handicap me-2"></i>
              <small>Disabled Access</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlotGrid;
