
import { BlogPost, BlogPostResponse } from '@/lib/types';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/DeleteButton';
import { EditButton } from '@/components/EditButton';
import Image from 'next/image';
type Props = {
  params: { slug: string };
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = new URL(`${baseUrl}/api/blog/find/${slug}`);

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status}`);
    }

    const data: BlogPostResponse = await res.json();

    if (!data.data) {
      throw new Error('Post data not found');
    }
    return data.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const post = await getPost(slug);
  const session = await getServerSession(authOptions);

  const isAuthor = session?.user?.email === post?.author?.email;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
        <p className="mt-4 text-lg">The requested blog post could not be found.</p>
      </div>
    );
  }



  return (
    <article className="max-w-4xl mx-auto py-12 px-4 relative">
      {isAuthor && (
        <div className="absolute top-4 right-4 flex gap-2">
          <EditButton postId={post._id}  />
          {/* <form action={handleDelete(post._id)}>
            <Button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </Button>
          </form> */}
          <DeleteButton postId={post._id} email={post.author!.email} />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <span>By {post.author?.email}</span>
          <span>•</span>
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
        {post.coverImage && (
          <div className="mt-6">
            <Image
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/${post.id}/800/400`;
              }}
            />
          </div>
        )}
      </header>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}