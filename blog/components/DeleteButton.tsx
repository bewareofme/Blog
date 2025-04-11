// app/components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const DeleteButton = ({ postId,email }: { postId: string,email:any }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${baseUrl}/api/blog/delete/${postId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete post');
      }
      
      router.push(`/viewAll/${email}`); // Client-side navigation
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Delete
    </Button>
  );
};