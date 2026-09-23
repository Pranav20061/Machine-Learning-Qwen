import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import ParkingLocation from '../models/ParkingLocation.js';
import ParkingSlot from '../models/ParkingSlot.js';
import Booking from '../models/Booking.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await ParkingLocation.deleteMany({});
    await ParkingSlot.deleteMany({});
    await Booking.deleteMany({});

    console.log('Cleared existing data...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@12345',
      role: 'ADMIN',
      phone: '+1234567890'
    });

    // Create regular users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User@12345',
      role: 'USER',
      phone: '+1234567891'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'User@12345',
      role: 'USER',
      phone: '+1234567892'
    });

    console.log('Created users...');

    // Create parking locations
    const location1 = await ParkingLocation.create({
      name: 'Downtown Parking',
      address: '123 Main Street',
      city: 'New York',
      description: 'Convenient downtown parking near shopping and business district',
      pricePerHour: 5,
      openingTime: '06:00',
      closingTime: '23:00',
      isActive: true
    });

    const location2 = await ParkingLocation.create({
      name: 'Airport Long-term Parking',
      address: '456 Airport Road',
      city: 'New York',
      description: 'Secure long-term parking near airport terminals',
      pricePerHour: 3,
      openingTime: '00:00',
      closingTime: '23:59',
      isActive: true
    });

    const location3 = await ParkingLocation.create({
      name: 'Mall Parking Center',
      address: '789 Shopping Blvd',
      city: 'Brooklyn',
      description: 'Large parking facility attached to shopping mall',
      pricePerHour: 4,
      openingTime: '08:00',
      closingTime: '22:00',
      isActive: true
    });

    console.log('Created parking locations...');

    // Create parking slots for each location
    const createSlots = async (locationId, count, floor = 'Ground') => {
      const slots = [];
      for (let i = 1; i <= count; i++) {
        slots.push({
          parkingLocation: locationId,
          slotNumber: `${floor}-${String(i).padStart(3, '0')}`,
          slotType: i % 10 === 0 ? 'EV' : i % 15 === 0 ? 'DISABLED' : 'REGULAR',
          status: 'AVAILABLE',
          floor
        });
      }
      return await ParkingSlot.insertMany(slots);
    };

    await createSlots(location1._id, 20, 'Ground');
    await createSlots(location1._id, 15, 'Level 1');
    await createSlots(location2._id, 50, 'Ground');
    await createSlots(location3._id, 30, 'Ground');
    await createSlots(location3._id, 25, 'Level 1');

    console.log('Created parking slots...');

    // Update parking location slot counts
    await location1.updateSlotCounts();
    await location2.updateSlotCounts();
    await location3.updateSlotCounts();

    // Create some sample bookings
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startTime = new Date(tomorrow);
    startTime.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(12, 0, 0, 0);

    // Get an available slot for booking
    const availableSlot = await ParkingSlot.findOne({ 
      parkingLocation: location1._id, 
      status: 'AVAILABLE' 
    });

    if (availableSlot) {
      await Booking.create({
        user: user1._id,
        parkingLocation: location1._id,
        parkingSlot: availableSlot._id,
        bookingDate: tomorrow,
        startTime,
        endTime,
        duration: 2,
        totalAmount: 10,
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      });

      // Update slot status
      await ParkingSlot.findByIdAndUpdate(availableSlot._id, { status: 'RESERVED' });
      await location1.updateSlotCounts();
    }

    console.log('Created sample bookings...');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Admin credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin@12345');
    console.log('\n📋 User credentials:');
    console.log('   Email: john@example.com or jane@example.com');
    console.log('   Password: User@12345');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
