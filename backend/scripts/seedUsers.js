const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const usersToSeed = [
  {
    name: 'Thudum Laxmi @ Allaram Laxmi',
    email: 'laxmi@nyayasetu.test',
    password: 'Laxmi@12345',
    role: 'citizen'
  },
  {
    name: 'Mallepally Srinivas',
    email: 'srinivas@nyayasetu.test',
    password: 'Srinivas@12345',
    role: 'citizen'
  },
  {
    name: 'Gandla Raghavendra',
    email: 'raghavendra@nyayasetu.test',
    password: 'Raghavendra@12345',
    role: 'citizen'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    for (const u of usersToSeed) {
      const existingUser = await User.findOne({ email: u.email });
      
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        
        await User.create({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role
        });
        console.log(`User created: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('User seeding completed successfully.');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedUsers();
