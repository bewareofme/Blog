import { NextResponse } from 'next/server';
import  BlogPost  from '@/models/BlogPost';
import {connectDB} from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } =await params;
  try {
    await connectDB();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}