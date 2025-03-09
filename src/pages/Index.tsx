
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';

export default function Index() {
  return (
    <AuthLayout>
      <AuthTabs />
    </AuthLayout>
  );
}
