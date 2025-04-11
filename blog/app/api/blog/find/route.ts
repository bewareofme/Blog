// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/BlogPost';

export async function GET() {
  try {
    await connectDB();
    
    const posts = await Post.find({})
      .sort({ publishedAt: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}