import { getAllServices } from '@/app/actions';
import { mapServiceToResponse, ServiceResponseDTO } from '@/app/types';

import ServicesClient from './ServicesClient';

const ServicesPage = async () => {
  const servicesRaw = await getAllServices();

  const services: ServiceResponseDTO[] = servicesRaw.map(mapServiceToResponse);

  return <ServicesClient initialServices={services} />;
};

export default ServicesPage;
