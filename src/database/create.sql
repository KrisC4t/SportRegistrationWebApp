-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    last_registration DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles_history table
CREATE TABLE profiles_history (
    id UUID,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    year INT NOT NULL,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp BOOLEAN DEFAULT FALSE,
    email TEXT NOT NULL,
    birthdate DATE NOT NULL,
    address TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_year UNIQUE (user_id, year)
);

-- Table: payments
-- Stores online payments made via Stripe. Entries are immutable after creation.

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    stripe_payment_id TEXT UNIQUE NOT NULL,
    amount INT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'eur',
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: image_rights
-- Stores image rights. Entries are immutable after creation.

CREATE TABLE image_rights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    image_rights_consent BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION delete_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM registrations WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Create a trigger to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_registrations_modtime
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Create a function to clean up old accounts
CREATE OR REPLACE FUNCTION clean_old_accounts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM profiles
  WHERE last_registration < (CURRENT_DATE - INTERVAL '2 years')
  OR last_registration IS NULL;
END;
$$;

-- Admin policiespour que les utilisateurs v
CREATE FUNCTION is_admin() 
RETURNS bool AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE);
$$ LANGUAGE sql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a new user is added
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.profiles_history (id, email)
  VALUES (NEW.id, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to insert only if consent value changed
CREATE OR REPLACE FUNCTION image_rights_history_insert()
RETURNS TRIGGER AS $$
DECLARE
  last_consent image_rights%ROWTYPE;
BEGIN
  -- Get the last entry for this registration and user
  SELECT *
  INTO last_consent
  FROM image_rights
  WHERE registration_id = NEW.registration_id
    AND user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no previous entry, or value changed, allow the insert
  IF last_consent IS NULL OR last_consent.image_rights_consent IS DISTINCT FROM NEW.image_rights_consent THEN
    RETURN NEW;
  ELSE
    -- Otherwise, skip the insert
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger BEFORE INSERT
CREATE TRIGGER trg_image_rights_before_insert
BEFORE INSERT ON image_rights
FOR EACH ROW
EXECUTE FUNCTION image_rights_history_insert();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE registrations
ADD CONSTRAINT check_phone_format
CHECK (phone ~ '^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$');

ALTER TABLE registrations
ADD CONSTRAINT check_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');

-- Trigger function to update last_registration in profiles
CREATE OR REPLACE FUNCTION update_last_registration()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET last_registration = CURRENT_DATE,
      updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT
CREATE TRIGGER trg_update_last_registration_insert
AFTER INSERT ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_last_registration();

-- Trigger on UPDATE
CREATE TRIGGER trg_update_last_registration_update
AFTER UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_last_registration();

-- Function: Prevents any update on payments
CREATE OR REPLACE FUNCTION prevent_payment_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Payments cannot be modified after creation.';
END;
$$ LANGUAGE plpgsql;

-- Function: Prevents any deletion on payments
CREATE OR REPLACE FUNCTION prevent_payment_deletion()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Payments cannot be deleted.';
END;
$$ LANGUAGE plpgsql;

-- Trigger: Blocks updates on payments
CREATE TRIGGER trg_prevent_payment_update
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_payment_modification();

-- Trigger: Blocks deletions on payments
CREATE TRIGGER trg_prevent_payment_delete
  BEFORE DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_payment_deletion();
  
-- Function: Prevents any update on profiles_history
CREATE OR REPLACE FUNCTION prevent_profiles_history_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Profiles history cannot be modified after creation.';
END;
$$ LANGUAGE plpgsql;

-- Function: Prevents any deletion on profiles_history
CREATE OR REPLACE FUNCTION prevent_profiles_history_deletion()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Profiles history cannot be deleted.';
END;
$$ LANGUAGE plpgsql;

-- Trigger: Blocks updates on profiles_history
CREATE TRIGGER trg_prevent_profiles_history_update
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profiles_history_modification();

-- Trigger: Blocks deletions on profiles_history
CREATE TRIGGER trg_prevent_profiles_history_delete
  BEFORE DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profiles_history_deletion();
  
-- Function: Prevents any update on image_rights
CREATE OR REPLACE FUNCTION prevent_image_rights_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Profiles history cannot be modified after creation.';
END;
$$ LANGUAGE plpgsql;

-- Function: Prevents any deletion on image_rights
CREATE OR REPLACE FUNCTION prevent_image_rights_deletion()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Profiles history cannot be deleted.';
END;
$$ LANGUAGE plpgsql;

-- Trigger: Blocks updates on image_rights
CREATE TRIGGER trg_prevent_image_rights_update
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_image_rights_modification();

-- Trigger: Blocks deletions on image_rights
CREATE TRIGGER trg_prevent_image_rights_delete
  BEFORE DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION prevent_image_rights_deletion();
  
-- Block is_admin modification by users
CREATE OR REPLACE FUNCTION prevent_is_admin_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.role() = 'authenticated' THEN
    	IF NOT is_admin() THEN
	        IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
        	    RAISE EXCEPTION 'Modifying is_admin is forbidden for non-admin users';
        	END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Use trigger to call function
CREATE TRIGGER trg_prevent_is_admin_modification
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_is_admin_modification();

-- Trigger function to protect payment_mode, user_id, and year
CREATE OR REPLACE FUNCTION protect_registration_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'Cannot modify user_id of a registration';
    END IF;

    IF OLD.year IS DISTINCT FROM NEW.year THEN
        RAISE EXCEPTION 'Cannot modify year of a registration';
    END IF;

    IF OLD.payment_mode IS DISTINCT FROM NEW.payment_mode THEN
        IF EXISTS (
            SELECT 1
            FROM payments
            WHERE registration_id = OLD.id
              AND status = 'succeeded'
        ) THEN
            RAISE EXCEPTION 'Cannot change payment_mode: payment already successful';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on registrations
CREATE TRIGGER trg_protect_registration_fields
BEFORE UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION protect_registration_fields();

-- Fix RLS vulnerabilites and clean RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_rights ENABLE ROW LEVEL SECURITY;

-- Users: SELECT own profile
CREATE POLICY profiles_user_select
ON profiles
FOR SELECT
USING (id = auth.uid());

-- Users: UPDATE own profile (except is_admin handled by trigger)
CREATE POLICY profiles_user_update
ON profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins: SELECT all profiles
CREATE POLICY profiles_admin_select
ON profiles
FOR SELECT
USING (is_admin());

-- Admins: UPDATE all profiles
CREATE POLICY profiles_admin_update
ON profiles
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Users: SELECT own registrations
CREATE POLICY registrations_user_select
ON registrations
FOR SELECT
USING (user_id = auth.uid());

-- Users: INSERT own registrations
CREATE POLICY registrations_user_insert
ON registrations
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users: UPDATE own registrations (column restrictions via triggers)
CREATE POLICY registrations_user_update
ON registrations
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins: SELECT all registrations
CREATE POLICY registrations_admin_select
ON registrations
FOR SELECT
USING (is_admin());

-- Admins: UPDATE all registrations
CREATE POLICY registrations_admin_update
ON registrations
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Users: SELECT own payments
CREATE POLICY payments_user_select
ON payments
FOR SELECT
USING (user_id = auth.uid());

-- Admins: SELECT all payments
CREATE POLICY payments_admin_select
ON payments
FOR SELECT
USING (is_admin());
