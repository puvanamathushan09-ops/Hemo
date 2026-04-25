-- Migration: Add address column to users and hospitals tables
-- Instructions: Run this script in your Supabase SQL Editor to apply the database changes.

BEGIN;

-- 1. Add Address to Users Table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Add Address to Hospitals Table
ALTER TABLE public.hospitals 
ADD COLUMN IF NOT EXISTS address TEXT;

COMMIT;
