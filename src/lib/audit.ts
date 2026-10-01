import { db } from './db';

export interface CreateAuditLogParams {
  adminId: string;
  action: string;
  entityType: 'BUSINESS_PROFILE' | 'DOCUMENT' | 'CONFIG' | 'USER' | 'RISK_FLAG';
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        previousValue: params.previousValue ? JSON.stringify(params.previousValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
    return null;
  }
}
