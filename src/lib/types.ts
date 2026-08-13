export type Role = "customer" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  credits_balance: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pending"
  | "quoted"
  | "in_progress"
  | "revision_requested"
  | "completed"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  reference: string;
  order_reference: string;
  title: string;
  description: string;
  service: string;
  image_count: number;
  credit_cost: number;
  kind: "quote" | "order";
  status: OrderStatus;
  revision_note: string;
  created_at: string;
  updated_at: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  change: number;
  reason: string;
  created_at: string;
};
