import { serviceService } from '@/app/lib/services/service.service';
import { mapServiceToResponse, ServiceResponseDTO } from '@/app/types';

import ServicesClient from './ServicesClient';

const ServicesPage = async () => {
  const servicesRaw = await serviceService.getAll();

  const services: ServiceResponseDTO[] = servicesRaw.map(mapServiceToResponse);

  return <ServicesClient initialServices={services} />;
};

export default ServicesPage;
