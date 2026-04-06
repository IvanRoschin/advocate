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

export type CreateCaseRepoInput = {
  clientId: string;
  title: string;
  description?: string;
  status?: CaseStatus;
  currentStage?: string;
  sourceLeadId?: string | null;
  assignedLawyerId?: string | null;
};

export type UpdateCaseRepoInput = Partial<{
  title: string;
  description: string;
  status: CaseStatus;
  currentStage: string;
  sourceLeadId: string | null;
  assignedLawyerId: string | null;
}>;

export const caseRepo = {
  async create(data: CreateCaseRepoInput, session?: ClientSession) {
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

  findById(caseId: string) {
    return Case.findById(caseId);
  },

  findByClientId(clientId: string): Promise<CaseRow[]> {
    return Case.find({ clientId })
      .sort({ updatedAt: -1, _id: -1 })
      .lean<CaseRow[]>();
  },

  updateById(caseId: string, data: UpdateCaseRepoInput) {
    return Case.findByIdAndUpdate(caseId, data, {
      new: true,
      runValidators: true,
    });
  },

  deleteById(caseId: string) {
    return Case.findByIdAndDelete(caseId);
  },
};
