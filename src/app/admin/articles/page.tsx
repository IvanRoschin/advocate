'use client';

import { FaFileAlt, FaPlus } from 'react-icons/fa';

import { AppLink } from '@/components';

type Article = {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
};

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Розірвання шлюбу в Києві',
    status: 'published',
    author: 'Іван Іванов',
    createdAt: '2026-02-05',
  },
  {
    id: '2',
    title: 'Захист прав споживачів',
    status: 'draft',
    author: 'Петро Петров',
    createdAt: '2026-01-28',
  },
];

const ArticlesPage = () => {
  return (
    <div className="p-6">
      {/* Заголовок + кнопка добавления */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <FaFileAlt /> Статьи
        </h1>
        <AppLink
          href="/admin/articles/add"
          className="bg-accentcolor flex items-center gap-2 rounded px-4 py-2 text-white shadow transition"
        >
          <FaPlus /> Добавить статью
        </AppLink>
      </div>

      {/* Таблица статей */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-150 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Заголовок
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Дата создания
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockArticles.map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4">{article.title}</td>
                <td className="px-6 py-4 capitalize">{article.status}</td>
                <td className="px-6 py-4">{article.author}</td>
                <td className="px-6 py-4">{article.createdAt}</td>
                <td className="px-6 py-4 text-right">
                  <AppLink
                    href={`/admin/articles/${article.id}`}
                    className="text-accent hover:underline"
                  >
                    Просмотр / Редактировать
                  </AppLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticlesPage;
