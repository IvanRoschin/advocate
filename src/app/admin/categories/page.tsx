import { categoryActions } from '@/app/actions/category.actions';
import { CategoryResponseDTO } from '@/app/types';

import CategoriesClient from './CategoriesClient';

const CategoriesPage = async () => {
  const result = await categoryActions.getAll();

  const categories: CategoryResponseDTO[] = result.items;

  return <CategoriesClient initialCategories={categories} />;
};

export default CategoriesPage;
