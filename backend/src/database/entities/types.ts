export type Platform = 'trendyol' | 'hepsiburada' | 'n11' | 'amazon';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type UserRole = 'admin' | 'user';
export type AlertType = 'price_drop' | 'price_increase' | 'stock_out' | 'stock_low' | 'competitor_add' | 'competitor_remove';

export interface AlertCondition {
  threshold?: number;
  percentage?: number;
  stockThreshold?: number;
}

export interface NotificationChannel {
  type: 'email' | 'webhook' | 'sms' | 'push';
  config?: Record<string, any>;
}