import { categoryService } from '@/app/lib/services/category.service';
import { CategoryResponseDTO } from '@/app/types';

import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

const CategoriesPage = async () => {
  const categories: CategoryResponseDTO[] = await categoryService.getAll();

  return <CategoriesClient initialCategories={categories} />;
};

export default CategoriesPage;
