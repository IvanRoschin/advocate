// src/app/shared/lead.constants.ts
export const LEAD_SOURCES = ['home', 'contacts'] as const;
export const LEAD_STATUSES = ['new', 'processed'] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
