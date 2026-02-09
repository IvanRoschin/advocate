'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CategoryForm } from '@/app/components/forms/index';
import { apiUrl } from '@/app/config/routes';
import { useModal } from '@/app/hooks/useModal';
import { apiFetch } from '@/app/lib/client/apiFetch';
import {
  CategoryResponseDTO,
  CreateCategoryRequestDTO,
  UpdateCategoryDTO,
} from '@/app/types';
import {
  Breadcrumbs,
  Btn,
  DeleteConfirmation,
  EmptyState,
  Loader,
  Modal,
} from '@/components/index';

import { AdminTable } from '../components/table';
import { categoryColumns } from './category.columns';

interface Props {
  initialCategories: CategoryResponseDTO[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] =
    useState<CategoryResponseDTO[]>(initialCategories);

  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryResponseDTO | null>(null);

  const [categoryToUpdate, setCategoryToUpdate] =
    useState<CategoryResponseDTO | null>(null);

  const createModal = useModal('createCategory');
  const deleteModal = useModal('deleteCategory');
  const updateModal = useModal('updateCategory');

  /* ---------- handlers ---------- */

  const handleDelete = (category: CategoryResponseDTO) => {
    setCategoryToDelete(category);
    deleteModal.open();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await apiFetch<void>(
        apiUrl(`/api/admin/categories/${categoryToDelete._id}`),
        { method: 'DELETE' }
      );

      setCategories(prev =>
        prev.filter(cat => cat._id !== categoryToDelete._id)
      );

      toast.success('Категорію видалено');
      deleteModal.close();
      setCategoryToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const handleEdit = (category: CategoryResponseDTO) => {
    setCategoryToUpdate(category);
    updateModal.open();
  };

  const handleCreateCategory = async (payload: CreateCategoryRequestDTO) => {
    try {
      const newCategory = await apiFetch<CategoryResponseDTO>(
        apiUrl('/api/admin/categories'),
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setCategories(prev => [newCategory, ...prev]);
      toast.success('Категорію створено');
      createModal.close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка створення');
    }
  };

  const handleUpdateCategory = async (payload: UpdateCategoryDTO) => {
    if (!categoryToUpdate) return;

    try {
      const updatedCategory = await apiFetch<CategoryResponseDTO>(
        apiUrl(`/api/admin/categories/${categoryToUpdate?._id}`),
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );
      setCategories(prev =>
        prev.map(cat =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      toast.success('Категорію оновлено');
      updateModal.close();
      setCategoryToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };

  /* ---------------- UI ---------------- */

  if (!categories) return <Loader />;

  if (categories.length === 0) {
    return (
      <EmptyState
        title="Категорії відсутні"
        subtitle="Додайте першу категорію"
        actionLabel="Додати категорію"
        actionHref="../categories"
      />
    );
  }

  return (
    <div className="container">
      <Breadcrumbs />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Категорії</h1>
        <Btn label="Додати категорію" onClick={createModal.open} />
      </div>

      <AdminTable
        data={categories}
        columns={categoryColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
      />
      {/* 
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-200 font-medium">
            <td className="p-2">
              <Btn
                label="Назва"
                icon={sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown}
                onClick={handleSort}
              />
            </td>
            <td className="p-2">Слаг</td>
            <td className="p-2">Зображення</td>
            <td className="p-2 text-center">Редагувати</td>
            <td className="p-2 text-center">Видалити</td>
          </tr>
        </thead>

        <tbody>
          {sortedCategories.map(category => (
            <tr key={category._id} className="border-b">
              <td className="p-2">{category.title}</td>
              <td className="p-2">{category.slug}</td>
              <td className="p-2">
                {category.src[0] && (
                  <NextImage
                    src={category.src[0]}
                    alt={category.title}
                    width={50}
                    height={50}
                  />
                )}
              </td>
              <td className="p-2 text-center">
                <Btn
                  icon={FaPen}
                  onClick={() => {
                    setCategoryToUpdate(category);
                    updateModal.open();
                  }}
                />
              </td>
              <td className="p-2 text-center">
                <Btn
                  icon={FaTrash}
                  onClick={() => handleDelete(category._id, category.title)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {/* Create */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        body={
          <CategoryForm
            onSubmit={handleCreateCategory}
            onClose={createModal.close}
          />
        }
      />

      {/* Delete */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        body={
          <DeleteConfirmation
            title={`Категорія: ${categoryToDelete?.title}`}
            onConfirm={handleDeleteConfirm}
            onCancel={deleteModal.close}
          />
        }
      />

      {/* Update */}
      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.close();
          setCategoryToUpdate(null);
        }}
        body={
          categoryToUpdate && (
            <CategoryForm
              initialValues={{
                title: categoryToUpdate.title,
                src: categoryToUpdate.src,
                slug: categoryToUpdate.slug,
              }}
              submitLabel="Оновити категорію"
              onSubmit={handleUpdateCategory}
              onClose={updateModal.close}
            />
          )
        }
      />
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { FaPen, FaSortAlphaDown, FaSortAlphaUp, FaTrash } from 'react-icons/fa';
// import { toast } from 'sonner';

// import { CategoryForm } from '@/app/components/forms/index';
// import { apiUrl } from '@/app/config/routes';
// import { useModal } from '@/app/hooks/useModal';
// import { apiFetch } from '@/app/lib/client/apiFetch';
// import {
//   CategoryResponseDTO,
//   CreateCategoryRequestDTO,
//   UpdateCategoryDTO,
// } from '@/app/types';
// import {
//   Breadcrumbs,
//   Btn,
//   DeleteConfirmation,
//   EmptyState,
//   Loader,
//   Modal,
//   NextImage,
// } from '@/components/index';

// interface Props {
//   initialCategories: CategoryResponseDTO[];
// }

// export default function CategoriesClient({ initialCategories }: Props) {
//   const [categories, setCategories] =
//     useState<CategoryResponseDTO[]>(initialCategories);

//   const [categoryToDelete, setCategoryToDelete] = useState<{
//     id: string;
//     title: string;
//   } | null>(null);

//   const [categoryToUpdate, setCategoryToUpdate] =
//     useState<CategoryResponseDTO | null>(null);

//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   const createModal = useModal('createCategory');
//   const deleteModal = useModal('deleteCategory');
//   const updateModal = useModal('updateCategory');

//   /* ---------------- SORT ---------------- */

//   const handleSort = () => {
//     setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//   };

//   const sortedCategories = [...categories].sort((a, b) => {
//     const res = a.title.localeCompare(b.title);
//     return sortOrder === 'asc' ? res : -res;
//   });

//   /* ---------------- CREATE ---------------- */

//   const handleCreateCategory = async (payload: CreateCategoryRequestDTO) => {
//     try {
//       const newCategory = await apiFetch<CategoryResponseDTO>(
//         apiUrl('/api/admin/categories'),
//         {
//           method: 'POST',
//           body: JSON.stringify(payload),
//         }
//       );

//       setCategories(prev => [newCategory, ...prev]);
//       toast.success('Категорію створено');
//       createModal.close();
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Помилка створення');
//     }
//   };

//   /* ---------------- DELETE ---------------- */

//   const handleDeleteClick = (id: string, title: string) => {
//     setCategoryToDelete({ id, title });
//     deleteModal.open();
//   };

//   const handleDeleteConfirm = async () => {
//     if (!categoryToDelete) return;

//     try {
//       await apiFetch<void>(
//         apiUrl(`/api/admin/categories/${categoryToDelete.id}`),
//         { method: 'DELETE' }
//       );

//       setCategories(prev =>
//         prev.filter(cat => cat._id !== categoryToDelete.id)
//       );

//       toast.success('Категорію видалено');
//       deleteModal.close();
//       setCategoryToDelete(null);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Помилка видалення');
//     }
//   };

//   /* ---------------- UPDATE ---------------- */

//   const handleUpdateCategory = async (payload: UpdateCategoryDTO) => {
//     if (!categoryToUpdate) return;

//     try {
//       const updatedCategory = await apiFetch<CategoryResponseDTO>(
//         apiUrl(`/api/admin/categories/${categoryToUpdate?._id}`),
//         {
//           method: 'PATCH',
//           body: JSON.stringify(payload),
//         }
//       );
//       setCategories(prev =>
//         prev.map(cat =>
//           cat._id === updatedCategory._id ? updatedCategory : cat
//         )
//       );
//       toast.success('Категорію оновлено');
//       updateModal.close();
//       setCategoryToUpdate(null);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Помилка оновлення');
//     }
//   };

//   /* ---------------- UI ---------------- */

//   if (!categories) return <Loader />;

//   if (categories.length === 0) {
//     return (
//       <EmptyState
//         title="Категорії відсутні"
//         subtitle="Додайте першу категорію"
//         actionLabel="Додати категорію"
//         actionHref="../categories"
//       />
//     );
//   }

//   return (
//     <div className="container">
//       <Breadcrumbs />

//       <div className="mb-4 flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Категорії</h1>
//         <Btn label="Додати категорію" onClick={createModal.open} />
//       </div>

//       <table className="w-full text-sm">
//         <thead>
//           <tr className="border-b bg-slate-200 font-medium">
//             <td className="p-2">
//               <Btn
//                 label="Назва"
//                 icon={sortOrder === 'asc' ? FaSortAlphaUp : FaSortAlphaDown}
//                 onClick={handleSort}
//               />
//             </td>
//             <td className="p-2">Слаг</td>
//             <td className="p-2">Зображення</td>
//             <td className="p-2 text-center">Редагувати</td>
//             <td className="p-2 text-center">Видалити</td>
//           </tr>
//         </thead>

//         <tbody>
//           {sortedCategories.map(category => (
//             <tr key={category._id} className="border-b">
//               <td className="p-2">{category.title}</td>
//               <td className="p-2">{category.slug}</td>
//               <td className="p-2">
//                 {category.src[0] && (
//                   <NextImage
//                     src={category.src[0]}
//                     alt={category.title}
//                     width={50}
//                     height={50}
//                   />
//                 )}
//               </td>
//               <td className="p-2 text-center">
//                 <Btn
//                   icon={FaPen}
//                   onClick={() => {
//                     setCategoryToUpdate(category);
//                     updateModal.open();
//                   }}
//                 />
//               </td>
//               <td className="p-2 text-center">
//                 <Btn
//                   icon={FaTrash}
//                   onClick={() =>
//                     handleDeleteClick(category._id, category.title)
//                   }
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Create */}
//       <Modal
//         isOpen={createModal.isOpen}
//         onClose={createModal.close}
//         body={
//           <CategoryForm
//             onSubmit={handleCreateCategory}
//             onClose={createModal.close}
//           />
//         }
//       />

//       {/* Delete */}
//       <Modal
//         isOpen={deleteModal.isOpen}
//         onClose={deleteModal.close}
//         body={
//           <DeleteConfirmation
//             title={`Категорія: ${categoryToDelete?.title}`}
//             onConfirm={handleDeleteConfirm}
//             onCancel={deleteModal.close}
//           />
//         }
//       />

//       {/* Update */}
//       <Modal
//         isOpen={updateModal.isOpen}
//         onClose={() => {
//           updateModal.close();
//           setCategoryToUpdate(null);
//         }}
//         body={
//           categoryToUpdate && (
//             <CategoryForm
//               initialValues={{
//                 title: categoryToUpdate.title,
//                 src: categoryToUpdate.src,
//                 slug: categoryToUpdate.slug,
//               }}
//               submitLabel="Оновити категорію"
//               onSubmit={handleUpdateCategory}
//               onClose={updateModal.close}
//             />
//           )
//         }
//       />
//     </div>
//   );
// }
