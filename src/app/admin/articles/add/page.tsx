'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ArticleForm } from '@/app/components/forms';
import { ArticleFormValues } from '@/app/components/forms/ArticleForm';
import { CategoryResponseDTO, UserResponseDTO } from '@/app/types';

const AddArticlePage = () => {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем пользователей
        const usersRes = await fetch('/api/v1/users');
        const usersJson = await usersRes.json();
        setUsers(usersJson || []);

        // Получаем категории
        const categoriesRes = await fetch('/api/v1/categories');
        const categoriesJson = await categoriesRes.json();
        setCategories(categoriesJson || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка створення');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Загрузка...</div>;
  }

  const initialValues: ArticleFormValues = {
    title: '',
    slug: '',
    category: '',
    slugTouchedManually: false,
    status: 'draft',
    visibility: 'public',
    subtitle: '',
    excerpt: '',
    content: '',
    readingTime: 5,
    language: 'uk',
    author: users[0]?._id || '',
    coAuthors: [],
    tags: categories.map(c => c._id),
    coverImage: [],
    seo: {
      title: '',
      description: '',
      canonicalUrl: '',
      noIndex: false,
    },
    featured: false,
    pinned: false,
  };

  return (
    <div className="container w-250 p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-500">Добавить статью</h1>

      <ArticleForm
        initialValues={initialValues}
        users={users.map(u => ({
          id: u._id.toString(),
          name: u.name,
        }))}
        categories={categories.map(c => ({
          id: c._id.toString(),
          name: c.title,
        }))}
      />
    </div>
  );
};

export default AddArticlePage;
