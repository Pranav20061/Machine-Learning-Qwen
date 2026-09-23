import mongoose from 'mongoose';

const parkingLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parking name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalSlots: {
    type: Number,
    default: 0
  },
  availableSlots: {
    type: Number,
    default: 0
  },
  openingTime: {
    type: String,
    default: '08:00'
  },
  closingTime: {
    type: String,
    default: '22:00'
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

parkingLocationSchema.methods.updateSlotCounts = async function() {
  const ParkingSlot = mongoose.model('ParkingSlot');
  const totalSlots = await ParkingSlot.countDocuments({ parkingLocation: this._id });
  const availableSlots = await ParkingSlot.countDocuments({ 
    parkingLocation: this._id, 
    status: 'AVAILABLE' 
  });
  
  this.totalSlots = totalSlots;
  this.availableSlots = availableSlots;
  await this.save();
  
  return this;
};

const ParkingLocation = mongoose.model('ParkingLocation', parkingLocationSchema);

export default ParkingLocation;
