import { categoryService } from '@/app/lib/services/category.service';
import FooterClient from './FooterClient';

export default async function Footer() {
  const categories = await categoryService.getPublicList(8);

  return <FooterClient categories={categories} />;
}
