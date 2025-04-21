'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ro } from 'date-fns/locale';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('token');

    if (!role) {
        router.push('/login');
    } else {    
        router.push('/menu')
    }
  }, [router]);

  // Mientras se verifica la autenticación, puedes mostrar un indicador de carga
    
    
  return <>{children}</>;
}

export default AuthGuard;