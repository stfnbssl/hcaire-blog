import mongoose, { Schema, Document } from 'mongoose';

export type SubscriptionStatus =
  | 'active' | 'on_trial' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'none';

export type SubscriptionPlan = 'none' | 'abbonato' | 'bartleby' | 'bartleby_plus';

export interface IUserSubscription extends Document {
  clerkUserId:      string;
  lsSubscriptionId: string;
  lsCustomerId:     string;
  lsVariantId:      string;
  plan:             SubscriptionPlan;
  status:           SubscriptionStatus;
  currentPeriodEnd: Date | null;
  createdAt:        Date;
  updatedAt:        Date;
}

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    clerkUserId:      { type: String, required: true, unique: true },
    lsSubscriptionId: { type: String, default: '' },
    lsCustomerId:     { type: String, default: '' },
    lsVariantId:      { type: String, default: '' },
    plan:             { type: String, enum: ['none','abbonato','bartleby','bartleby_plus'], default: 'none' },
    status:           { type: String, enum: ['active','on_trial','paused','cancelled','expired','past_due','none'], default: 'none' },
    currentPeriodEnd: { type: Date, default: null },
  },
  { timestamps: true, collection: 'user-subscriptions' }
);

export default mongoose.model<IUserSubscription>('UserSubscription', UserSubscriptionSchema);
