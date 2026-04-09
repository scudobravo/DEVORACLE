export type ProfileRow = {
  id: string;
  email: string | null;
  product: string | null;
  plan: string | null;
  tokens_limit: number | null;
  tokens_used: number | null;
  usage_reset_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
};
