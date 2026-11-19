
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing.');
    }

    if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
      throw new Error('Set ADMIN_PASSWORD with at least 8 characters.');
    }

    await mongoose.connect(MONGODB_URI);

    const email = 'admin@campusconnect.edu';

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('[Admin Setup] Admin already exists. No changes made.');
        return;
      }

      throw new Error(
        'This email already belongs to a non-admin user. No changes made.'
      );
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: 'Placement Administrator',
      email,
      passwordHash,
      role: 'admin',
      bio: 'Head of Training and Placement Cell'
    });

    console.log('[Admin Setup] Admin account created successfully.');
    console.log(`[Admin Setup] Email: ${email}`);
    console.log('[Admin Setup] Password: Not displayed for security.');
  } catch (error) {
    console.error('[Admin Setup] Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();
