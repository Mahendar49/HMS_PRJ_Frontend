export interface SubscriptionUpdateRequest {
patientId: number;
planId: number;
startedAt: string;
nextBillingAt: string;
status: string;
autoRenew: boolean;
}