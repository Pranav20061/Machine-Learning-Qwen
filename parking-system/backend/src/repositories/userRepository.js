import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    return includePassword ? query.select('+password') : query;
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = User.find(filters).select('-password');
    
    const [users, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filters)
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async count(filters = {}) {
    return await User.countDocuments(filters);
  }
}

export default new UserRepository();
