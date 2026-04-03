import { slideService } from '@/app/lib/services/slide.service';
import { SlideResponseDTO } from '@/app/types';
import SlidesClient from './SlidesClient';

const SlidesPage = async () => {
  const slides: SlideResponseDTO[] = await slideService.getAll();

  return <SlidesClient initialSlides={slides} />;
};

export default SlidesPage;
