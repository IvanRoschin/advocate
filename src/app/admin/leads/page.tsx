import { leadService } from '@/app/lib/services/lead.service';
import { LeadResponseDTO } from '@/app/types';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic';

const LeadsPage = async () => {
  const leads = (await leadService.getAll()) as LeadResponseDTO[];

  return <LeadsClient initialLeads={leads} />;
};

export default LeadsPage;
