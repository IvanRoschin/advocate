import { ClientSession } from 'mongoose';

import Case from '@/app/models/Case';

export type CaseStatus =
  | 'new'
  | 'in_progress'
  | 'awaiting_client'
  | 'in_court'
  | 'completed'
  | 'archived';

export type CaseRow = {
  _id: import('mongoose').Types.ObjectId;
  clientId: import('mongoose').Types.ObjectId;
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  assignedLawyerId?: import('mongoose').Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export const caseRepo = {
  async create(
    data: {
      clientId: string;
      title: string;
      description?: string;
      status?:
        | 'new'
        | 'in_progress'
        | 'awaiting_client'
        | 'in_court'
        | 'completed'
        | 'archived';
      currentStage?: string;
      sourceLeadId?: string | null;
      assignedLawyerId?: string | null;
    },
    session?: ClientSession
  ) {
    return Case.create(
      [
        {
          clientId: data.clientId,
          title: data.title,
          description: data.description ?? '',
          status: data.status ?? 'new',
          currentStage: data.currentStage ?? 'Первинний аналіз',
          sourceLeadId: data.sourceLeadId ?? null,
          assignedLawyerId: data.assignedLawyerId ?? null,
        },
      ],
      { session }
    ).then(([doc]) => doc);
  },

  findByClientId(clientId: string): Promise<CaseRow[]> {
    return Case.find({ clientId })
      .sort({ updatedAt: -1, _id: -1 })
      .lean<CaseRow[]>();
  },
};
