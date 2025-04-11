import { NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import {connectDB} from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // const { id } = params;
    const body=await request.json();
    const {post,id} = body;
    
    console.log(id)
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Prevent certain fields from being updated
    const { _id, createdAt, ...sanitizedData } =post;
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { 
        ...sanitizedData,
        updatedAt: new Date() // Force update timestamp
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);

  } catch (error: any) {
    console.error("Error updating post:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Slug must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}