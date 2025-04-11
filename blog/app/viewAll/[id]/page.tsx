'use client'

// components/BlogPosts.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/navaigation';

interface Props {
  params: {
    id: string; // The name matches the folder [slug]
  };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

export default function BlogPosts({ params }: Props) {

    const { id } = params;
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog/myPosts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts);
        setFeaturedPost(data.posts[0]); // Set first post as featured
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            {/* Error icon */}
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Post</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3">
                <Image
                  className="h-48 w-full object-cover md:h-full"
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  width={400}
                  height={300}
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${featuredPost.id}/800/400`;
                  }}
                />
              </div>
              <div className="p-8 md:w-2/3">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                  {featuredPost.tags.join(', ')}
                </div>
                <Link href={`/view/${featuredPost.slug}`} className="block mt-1 text-xl font-medium text-gray-900 hover:text-indigo-600">
                  {featuredPost.title}
                </Link>
                <p className="mt-2 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-4 flex items-center">
                  {featuredPost.author.avatar && (
                    <div className="flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        width={40}
                        height={40}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${featuredPost.id}/800/400`;
                        }}
                      />
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {featuredPost.author.name}
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={featuredPost.publishedAt}>
                        {new Date(featuredPost.publishedAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post,index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              className="h-48 w-full object-cover"
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={200}
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/${index}/800/400`;
              }}
            />
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/view/${post.slug}`} className="block text-xl font-semibold text-gray-900 hover:text-indigo-600">
                {post.title}
              </Link>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <div className="mt-4 flex items-center">
                {post.author.avatar && (
                  <div className="flex-shrink-0">
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/${index}/800/400`;
                      }}
                    />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author.name}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}