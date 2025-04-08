import React from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/app/types";
import { useState } from "react";
import { useUsers } from "@/app/hooks/useUsers";
import Spinner from "@/app/components/Spinner";

interface PostFormProps {
  initialData?: Post;
  onSubmit: (post: Omit<Post, "id">) => Promise<void>;
  isSubmitting: boolean;
}

const PostForm = ({ initialData, onSubmit, isSubmitting }: PostFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Post, "id">>(
    initialData || { title: "", body: "", userId: 1 }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.body?.trim()) {
      newErrors.body = "Content is required";
    }

    if (!formData.userId) {
      newErrors.userId = "Author is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      router.push("/posts");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg shadow-md p-6"
    >
      {/* Title field */}
      <div>
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? "border-red-500" : ""}`}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Content field */}
      <div>
        <label htmlFor="body" className="form-label">
          Content
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          value={formData.body}
          onChange={handleChange}
          className={`form-input ${errors.body ? "border-red-500" : ""}`}
          disabled={isSubmitting}
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body}</p>
        )}
      </div>

      {/* User field */}
      <div>
        <label htmlFor="userId" className="form-label">
          Author
        </label>
        <select
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={`form-select ${errors.userId ? "border-red-500" : ""}`}
          disabled={isSubmitting || isLoadingUsers}
        >
          <option value="">Select an author</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="small" />
              <span className="ml-2">
                {initialData ? "Updating..." : "Creating..."}
              </span>
            </>
          ) : initialData ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
