import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export  async function POST(
  req: Request,
  res: NextResponse
) {

  try {

    // Ensure the request has a body
    if (!req.body) {
      // return res.status(400).json({ message: 'Request body is missing' });
      return NextResponse.json(
        { success: false, message: 'Requesst body is missing' },
        { status: 400 }
      );
    }

    // Parse the JSON body if it's a string
    const body = await req.json()
    await connectDB();
    console.log('MongoDB connected');

    const { email, password,firstName } = body; // Use the parsed body
    // Basic validation
    if (!email || !password) {
      // return res.status(400).json({ message: 'Email and password are required' });
      return NextResponse.json(
        { success: false, message: 'email and password requried' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // return res.status(400).json({ message: 'Invalid email format' });
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      // return res.status(400).json({ message: 'Password must be at least 6 characters' });
      return NextResponse.json(
        { success: true, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.status(400).json({ message: 'Email already in use' });
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user with hashed password
    const user = new User({
      name:firstName, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();

    // Return user data without sensitive information
    return NextResponse.json(
      { success: true, message: 'User registered' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    // return res.status(500).json({ 
    //   success: false,
    //   message: error.message || 'Internal server error' 
    // });
    return NextResponse.json(
      { success: false, message: error.message || 'User registered' },
      { status: 500 }
    );
  }
}