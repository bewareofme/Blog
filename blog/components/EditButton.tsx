// app/components/DeleteButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const EditButton = ({ postId }: { postId: string}) => {
  const router = useRouter();

  const handleEdit = async () => {
      router.push(`/edit/${postId}`); // Client-side navigation
  };

  return (
    <Button
      onClick={handleEdit}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Edit
    </Button>
  );
};