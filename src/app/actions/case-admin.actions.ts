'use server';

import { Types } from 'mongoose';

import { caseRepo } from '@/app/lib/repositories/case.repo';
import { ValidationError } from '@/app/lib/server/errors/httpErrors';
import {
  AdminClientCaseDto,
  CreateCaseDTO,
  mapCaseRowToAdminDto,
  UpdateCaseDTO,
} from '@/app/types';

import { findClientById } from '../lib/repositories';

const assertObjectId = (value: string, label: string) => {
  if (!value || value === 'undefined' || !Types.ObjectId.isValid(value)) {
    throw new ValidationError(`Невірний ${label}`);
  }
};

/* -------------------------------------------------------------------------- */
/*                                GET BY CLIENT                               */
/* -------------------------------------------------------------------------- */

export async function getClientCasesAction(
  clientId: string
): Promise<AdminClientCaseDto[]> {
  assertObjectId(clientId, 'id клієнта');

  const client = await findClientById(clientId);
  if (!client) {
    throw new ValidationError('Клієнта не знайдено');
  }

  const rows = await caseRepo.findByClientId(clientId);

  return rows.map(mapCaseRowToAdminDto);
}

/* -------------------------------------------------------------------------- */
/*                               CREATE CASE                                  */
/* -------------------------------------------------------------------------- */

export async function createClientCaseAction(
  clientId: string,
  data: CreateCaseDTO
): Promise<AdminClientCaseDto> {
  assertObjectId(clientId, 'id клієнта');

  const client = await findClientById(clientId);
  if (!client) {
    throw new ValidationError('Клієнта не знайдено');
  }

  const created = await caseRepo.create({
    clientId,
    title: data.title,
    description: data.description ?? '',
    status: data.status ?? 'new',
    currentStage: data.currentStage ?? 'Первинний аналіз',
    sourceLeadId: data.sourceLeadId ?? null,
    assignedLawyerId: data.assignedLawyerId ?? null,
  });

  const row = await caseRepo.findById(created._id.toString());
  if (!row) {
    throw new ValidationError('Справу не вдалося створити');
  }

  return mapCaseRowToAdminDto(row);
}

/* -------------------------------------------------------------------------- */
/*                               UPDATE CASE                                  */
/* -------------------------------------------------------------------------- */

export async function updateCaseAction(
  caseId: string,
  data: UpdateCaseDTO
): Promise<AdminClientCaseDto> {
  assertObjectId(caseId, 'id справи');

  const updated = await caseRepo.updateById(caseId, data);

  if (!updated) {
    throw new ValidationError('Справу не знайдено');
  }

  return mapCaseRowToAdminDto(updated);
}

/* -------------------------------------------------------------------------- */
/*                               DELETE CASE                                  */
/* -------------------------------------------------------------------------- */

export async function deleteCaseAction(
  caseId: string
): Promise<{ id: string }> {
  assertObjectId(caseId, 'id справи');

  const deleted = await caseRepo.deleteById(caseId);

  if (!deleted) {
    throw new ValidationError('Справу не знайдено');
  }

  return { id: deleted._id.toString() };
}
