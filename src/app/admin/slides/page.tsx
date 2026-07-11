import { slideActions } from '@/app/actions/slide.actions';
import { SlideResponseDTO } from '@/app/types';

import SlidesClient from './SlidesClient';

const SlidesPage = async () => {
  const result = await slideActions.getAll();
  const slides = result.items as SlideResponseDTO[];

  return <SlidesClient initialSlides={slides} />;
};

export default SlidesPage;
