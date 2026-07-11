import { leadActions } from '@/app/actions/lead.actions';
import { LeadResponseDTO } from '@/app/types';

import LeadsClient from './LeadsClient';

const LeadsPage = async () => {
  const result = await leadActions.getAll();
  const leads = result.items as LeadResponseDTO[];

  return <LeadsClient initialLeads={leads} />;
};

export default LeadsPage;
