import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // Adjust import path as needed
import BlogPost from '@/models/BlogPost'; // Adjust import path as needed

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const {slug} = await params
  await connectDB();
  console.log("Request received for slug:", slug);

  try {
    if (typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }
    const post = await BlogPost.findOne({ _id: slug }).populate('author', 'name email');
    console.log(post)
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: post },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Optionally add other HTTP methods if needed
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}