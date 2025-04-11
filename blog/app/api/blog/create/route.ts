import { NextResponse } from 'next/server';
import BlogPost from '@/models/BlogPost';
import {connectDB} from '@/lib/mongodb'; // DB connection util

// POST /api/posts
export async function POST(request: Request) {
  try {

    await connectDB(); // Ensure DB connection
    
    const { title, content, excerpt, slug, coverImage, tags, author } = await request.json();
    
    // Validation
    if (!title || !content || !excerpt || !slug) {

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPost = await BlogPost.create({
      title,
      content,
      excerpt,
      slug,
      coverImage: coverImage || undefined,
      tags: tags || [],
      publishedAt: new Date(),
      author: author ? { 
        name: author.name, 
        avatar: author.avatar,
        email:author.email
      } : undefined
    });

 
    return NextResponse.json(newPost, { status: 201 });

  } catch (error: any) {
    console.error("Error creating post:", error);
    
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