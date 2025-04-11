// app/api/posts/by-author/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/BlogPost';
import User from '@/models/User'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    // Verify authentication
    const {email}=await params
    const user=User.find({email:email})
    if(!user){
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find posts by author email
    const posts = await Post.find({ 'author.email':email })
      .sort({ publishedAt: -1 }) // Newest first
      .lean(); // Convert to plain JS objects

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}