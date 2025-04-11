'use client'

// pages/create-blog.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/lib/types';
import { blogPostSchema } from '@/lib/validation';
import * as yup from 'yup';
import { withAuth } from '@/components/withAuth';
import { useSession } from 'next-auth/react';


function CreateBlogPage() {
    const { data: session, status } = useSession();

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const email=session?.user?.email

    // Add to your component
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = async () => {
        try {
            await blogPostSchema.validate(post, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                err.inner.forEach(error => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };


    const [post, setPost] = useState<BlogPost>({
        id: '',
        publishedAt:'',
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        tags: [],
        coverImage: '',
        author:{
            name:'',
            avatar:'',
            email:email || '',
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setPost(prev => ({
            ...prev,
            tags
        }));
    };

    const generateSlug = () => {
        const slug = post.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        setPost(prev => ({
            ...prev,
            slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const isValid = await validateForm();
        if (!isValid) {
            setIsSubmitting(false)
            return;
        }

        try {
            const response = await fetch('/api/blog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const data = await response.json();
            router.push(`/view/${data.slug}`);
        } catch (err) {
            setError('Failed to create blog post. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Create a New Blog Post
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Share your thoughts and ideas with the world
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Post Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Provide details about your blog post.
                                </p>
                            </div>

                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Title
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={post.title}
                                            onChange={handleChange}
                                            className={`max-w-lg block w-full shadow-sm  focus:border-indigo-500 focus:outline-none  focus:ring-indigo-500 border-gray-300  sm:max-w-xs sm:text-sm  border rounded-md ${errors.title ? 'border-red-300' : ''
                                                } p-1.5`}
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={generateSlug}
                                            className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Generate Slug
                                        </button>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Slug
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <input
                                            type="text"
                                            name="slug"
                                            id="slug"
                                            value={post.slug}
                                            onChange={handleChange}
                                            className="max-w-lg block w-full border shadow-sm focus:ring-indigo-500 focus:outline-none  p-1.5 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Excerpt
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <textarea
                                            id="excerpt"
                                            name="excerpt"
                                            rows={3}
                                            value={post.excerpt}
                                            onChange={handleChange}
                                            className="max-w-lg shadow-sm p-1.5 block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md focus:outline-none "
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Write a short excerpt for your blog post.</p>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Cover Image URL
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <input
                                            type="text"
                                            name="coverImage"
                                            id="coverImage"
                                            value={post.coverImage}
                                            onChange={handleChange}
                                            className="max-w-lg block w-full  p-1.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Tags
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                                        <input
                                            type="text"
                                            name="tags"
                                            id="tags"
                                            value={post.tags.join(', ')}
                                            onChange={handleTagsChange}
                                            className="max-w-lg block w-full shadow-sm p-1.5 focus:ring-indigo-500 focus:outline-none border focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Separate tags with commas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Content</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Write your blog post content here.
                                </p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="content" className="sr-only">Content</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={20}
                                        value={post.content}
                                        onChange={handleChange}
                                        className="block w-full shadow-sm focus:ring-indigo-500 p-1.5 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md focus:outline-none border"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.push('/blog')}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : 'Publish Post'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default withAuth(CreateBlogPage)