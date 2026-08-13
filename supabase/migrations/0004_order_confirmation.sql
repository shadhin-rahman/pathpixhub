-- ============================================================
-- PathPixHub — Quote → order confirmation (Level 4)
-- A form submission becomes a "quote" first (kind='quote').
-- The admin approves it with a final price (status='quoted'),
-- then the customer confirms it from their dashboard, which:
--   • converts it to an order (kind='order', status='in_progress')
--   • assigns a sequential order number (ORD-1001, ORD-1002, …)
--   • deducts the credit_cost from the customer's balance
-- ============================================================

-- New status: quoted (approved by admin, awaiting customer confirmation).
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'quoted', 'in_progress', 'revision_requested', 'completed', 'delivered', 'cancelled'));

-- kind: quote (awaiting admin + customer) vs order (confirmed, being worked on).
alter table public.orders add column if not exists kind text not null default 'quote'
  check (kind in ('quote', 'order'));

-- Order number assigned only once the customer confirms (ORD-1001, …).
alter table public.orders add column if not exists order_reference text not null default '';

-- Existing non-pending rows were already worked orders.
update public.orders
set kind = 'order'
where status in ('in_progress', 'revision_requested', 'completed', 'delivered', 'cancelled');

-- Sequential order number source (starts at 1001 → ORD-1001).
create sequence if not exists public.order_no_seq
  start 1001
  increment 1
  minvalue 1
  no cycle;

-- ---------- confirm_quote (customer-owned) ----------
-- Security definer so customer RLS does not block converting their quote.
-- Returns the new order reference (e.g. ORD-1002).
create or replace function public.confirm_quote(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_kind text;
  v_cost integer;
  v_balance integer;
  v_num bigint;
  v_ref text;
begin
  select status, kind, credit_cost
  into v_status, v_kind, v_cost
  from public.orders
  where id = p_order_id and user_id = auth.uid();

  if v_status is null then
    raise exception 'Quote not found';
  end if;
  if v_kind <> 'quote' then
    raise exception 'Already confirmed as an order';
  end if;
  if v_status <> 'quoted' then
    raise exception 'Quote is not approved yet';
  end if;

  select credits_balance into v_balance
  from public.profiles
  where id = auth.uid();

  if v_balance < v_cost then
    raise exception 'Insufficient credits — this order needs % credit(s) but your balance is %', v_cost, v_balance;
  end if;

  v_num := nextval('public.order_no_seq');
  v_ref := 'ORD-' || v_num;

  update public.orders
  set kind = 'order',
      status = 'in_progress',
      order_reference = v_ref,
      updated_at = now()
  where id = p_order_id;

  update public.profiles
  set credits_balance = credits_balance - v_cost,
      updated_at = now()
  where id = auth.uid();

  if v_cost > 0 then
    insert into public.credit_transactions (user_id, change, reason)
    values (auth.uid(), -v_cost, 'Order ' || v_ref || ' confirmed');
  end if;

  return v_ref;
end;
$$;

revoke all on function public.confirm_quote(uuid) from public;
grant execute on function public.confirm_quote(uuid) to authenticated;