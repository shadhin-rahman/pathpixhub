-- ============================================================
-- PathPixHub — Sequential quote reference numbers
-- Run this in the Supabase SQL Editor (after 0001_initial.sql).
--
-- Gives every quote/order a sequential, human-readable reference
-- like Q1001, Q1002, Q1003 … The number comes from a Postgres
-- sequence so two customers can never get the same code.
-- ============================================================

-- Sequence starts at 1001 → first ref is Q1001.
create sequence if not exists public.quote_no_seq
  start 1001
  increment 1
  minvalue 1
  no cycle;

-- Returns the next number in the sequence (1 call = 1 number).
create or replace function public.next_quote_no()
returns bigint
language sql
security definer
set search_path = public
as $$
  select nextval('public.quote_no_seq');
$$;

-- Callable by logged-in customers AND anonymous visitors who submit quotes.
revoke all on function public.next_quote_no() from public;
grant execute on function public.next_quote_no() to anon;
grant execute on function public.next_quote_no() to authenticated;
