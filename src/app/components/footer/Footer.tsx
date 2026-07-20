import { articlePublicActions } from '@/app/actions/article.actions';

import FooterClient from './FooterClient';

export default async function Footer() {
  const categories = await articlePublicActions.categories();

  return <FooterClient categories={categories} />;
}
