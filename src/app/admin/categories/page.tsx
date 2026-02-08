import { apiUrl } from '@/app/config/routes';
import { apiFetch } from '@/app/lib/client/apiFetch';
import { CategoryResponseDTO } from '@/app/types';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic'; // важно для админки

const CategoriesPage = async () => {
  const categories = await apiFetch<CategoryResponseDTO[]>(
    apiUrl('/api/v1/categories')
  );

  return <CategoriesClient initialCategories={categories} />;
};

export default CategoriesPage;
