import { ClientSession } from 'mongoose';

import Case from '@/app/models/Case';
import { createQuery } from './queryFactory';

type CaseStatus =
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

const caseeQuery = createQuery(Case);

export const caseRepo = {
  async findAll(): Promise<CaseRow[]> {
    return Case.find().sort({ createdAt: -1 }).lean<CaseRow[]>();
  },

  async findAllPaginated(page: number, limit: number) {
    return caseeQuery()
      .sortBy({ createdAt: -1 })
      .paginate(page, limit)
      .execWithCount<CaseRow>();
  },

  async findById(id: string) {
    return Case.findById(id);
  },

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

  async update(id: string, data: UpdateCaseRepoInput) {
    return Case.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return Case.findByIdAndDelete(id);
  },

  async reassignClient(id: string, clientId: string) {
    return Case.findByIdAndUpdate(
      id,
      { clientId },
      { returnDocument: 'after', runValidators: true }
    );
  },
};

export const caseQueries = {
  async findByClientId(clientId: string): Promise<CaseRow[]> {
    return Case.find({ clientId })
      .select('clientId title description status currentStage updatedAt')
      .sort({ updatedAt: -1, _id: -1 })
      .lean<CaseRow[]>();
  },
};
