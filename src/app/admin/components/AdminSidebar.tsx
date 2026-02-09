'use client';

import Link from 'next/link';
import { memo } from 'react';
import { CiInboxIn } from 'react-icons/ci';
import { FaOpencart, FaUserCircle } from 'react-icons/fa';
import { IoMdFolderOpen, IoMdHome } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';

const menu = [
  { name: 'Главная', href: '/admin', icon: IoMdHome },
  { name: 'Пользователи', href: '/admin/users', icon: FaUserCircle },
  { name: 'Статьи', href: '/admin/articles', icon: IoDocumentTextOutline },
  { name: 'Категории', href: '/admin/categories', icon: IoMdFolderOpen },
  { name: 'Заказы', href: '/admin/orders', icon: FaOpencart },
  { name: 'Лиды', href: '/admin/leads', icon: CiInboxIn },
];

const AdminSidebar = memo(() => {
  return (
    <aside className="bg-surface-input sticky top-0 h-screen w-64 border-r border-gray-200 p-6">
      <h2 className="mb-6 text-lg font-semibold text-zinc-500">Админка</h2>
      <nav className="flex flex-col gap-2">
        {menu.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded px-3 py-2 transition-colors hover:bg-gray-100"
          >
            <item.icon className="h-5 w-5 text-gray-600" />
            <span className="nav font-medium text-gray-800">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
