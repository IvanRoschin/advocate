import { categoryPublicActions } from '@/app/actions/category.actions';

import FooterClient from './FooterClient';

export default async function Footer() {
  const categories = await categoryPublicActions.list({ limit: 8 });

  return <FooterClient categories={categories} />;
}
