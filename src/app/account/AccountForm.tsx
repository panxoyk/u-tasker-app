'use client';

import { signout } from '@/actions/auth';

import { useCallback, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';

import { createClient } from '@/utils/supabase/client';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [last_name, setLastName] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profile')
        .select(`name, last_name`)
        .eq('user_id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setName(data.name);
        setLastName(data.last_name);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <div className="form-widget">
      {/* ... */}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>

      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={name ?? ''} disabled />
      </div>

      <div>
        <label htmlFor="last-name">Last name</label>
        <input id="last-name" type="text" value={last_name ?? ''} disabled />
      </div>

      <div>
        <form action={signout}>
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
