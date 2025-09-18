import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const reports = sqliteTable('reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientInfo: text('patient_info').notNull(),
  agentResults: text('agent_results', { mode: 'json' }).notNull(),
  summary: text('summary').notNull(),
  title: text('title'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});