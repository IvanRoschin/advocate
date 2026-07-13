import { serviceActions } from '@/app/actions/service.actions';
import { ServiceResponseDTO } from '@/app/types';
import ServicesClient from './ServicesClient';

const ServicesPage = async () => {
  const servicesRaw = await serviceActions.getAll();

  const services: ServiceResponseDTO[] = servicesRaw.items;

  return <ServicesClient initialServices={services} />;
};

export default ServicesPage;
