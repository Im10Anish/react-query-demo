"use client";

import { useCreatePost } from "@/app/hooks/usePosts";
import PostForm from "@/app/components/PostForm";

export default function NewPost() {
  const { mutateAsync: createPost, isPending } = useCreatePost();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <PostForm
        onSubmit={async (post) => {
          await createPost(post);
        }}
        isSubmitting={isPending}
      />
    </div>
  );
}
