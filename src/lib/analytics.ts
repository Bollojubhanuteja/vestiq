import { db } from './db';

export type AnalyticsEventType =
  | 'REGISTRATION'
  | 'ONBOARDING_COMPLETE'
  | 'BUSINESS_SUBMISSION'
  | 'OPPORTUNITY_VIEW'
  | 'WATCHLIST_ADD'
  | 'WATCHLIST_REMOVE'
  | 'COMPARISON_USE'
  | 'INFO_REQUEST';

export async function trackEvent(
  eventType: AnalyticsEventType,
  userId?: string | null,
  entityId?: string | null,
  metadata?: Record<string, any>
) {
  try {
    return await db.analyticsEvent.create({
      data: {
        eventType,
        userId: userId || null,
        entityId: entityId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log analytics event:', error);
    return null;
  }
}
