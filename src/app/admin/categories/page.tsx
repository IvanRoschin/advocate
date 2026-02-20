import { categoryService } from '@/app/lib/services/category.service';
import { CategoryResponseDTO, mapCategoryToResponse } from '@/app/types';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

const CategoriesPage = async () => {
  const categoriesRaw = await categoryService.getAll();

  const categories: CategoryResponseDTO[] = categoriesRaw.map(
    mapCategoryToResponse
  );

  return <CategoriesClient initialCategories={categories} />;
};

export default CategoriesPage;
