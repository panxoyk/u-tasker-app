import AccountForm from '@/app/account/AccountForm';
import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />
      <AccountForm user={user} />
    </>
  );
}
