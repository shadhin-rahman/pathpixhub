-- ============================================================
-- PathPixHub — Order revisions (Level 3)
-- Customers can send a completed/delivered order back for a
-- correction ("revision request") from their dashboard.
-- ============================================================

-- Allow the new revision_requested status.
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'in_progress', 'revision_requested', 'completed', 'delivered', 'cancelled'));

-- Free-text note from the customer describing what to fix.
alter table public.orders add column if not exists revision_note text default '';

-- ---------- request_revision (customer-owned) ----------
-- Security definer so RLS (which only lets admins update orders)
-- does not block the customer from flagging their own order.
create or replace function public.request_revision(
  p_order_id uuid,
  p_note text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  select status into v_status
  from public.orders
  where id = p_order_id and user_id = auth.uid();

  if v_status is null then
    raise exception 'Order not found';
  end if;

  if v_status not in ('completed', 'delivered') then
    raise exception 'Only completed or delivered orders can be sent for revision';
  end if;

  update public.orders
  set status = 'revision_requested',
      revision_note = coalesce(p_note, ''),
      updated_at = now()
  where id = p_order_id;
end;
$$;

revoke all on function public.request_revision(uuid, text) from public;
grant execute on function public.request_revision(uuid, text) to authenticated;
