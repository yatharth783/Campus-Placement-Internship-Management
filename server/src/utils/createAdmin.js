
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const {
      MONGODB_URI,
      ADMIN_EMAIL,
      ADMIN_NAME,
      ADMIN_PASSWORD
    } = process.env;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing.');
    }

    if (!ADMIN_EMAIL || !ADMIN_EMAIL.includes('@')) {
      throw new Error('Enter a valid ADMIN_EMAIL.');
    }

    if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
      throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
    }

    await mongoose.connect(MONGODB_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('[Admin Setup] Admin already exists. No changes made.');
        return;
      }

      throw new Error(
        'This email already belongs to a non-admin user.'
      );
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME || 'Placement Administrator',
      email,
      passwordHash,
      role: 'admin',
      bio: 'Head of Training and Placement Cell'
    });

    console.log('[Admin Setup] New admin created successfully.');
    console.log(`[Admin Setup] Email: ${email}`);

  } catch (error) {
    console.error('[Admin Setup] Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();
