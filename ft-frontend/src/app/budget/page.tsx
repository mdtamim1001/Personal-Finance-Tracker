'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PieChart from './PieChart';
import DaisyProgress from './DaisyProgress';

export default function BudgetPage() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    //if (!token) {
     // router.push('/login');
    //}
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-8">
      <PieChart />
      <DaisyProgress />
    </main>
  );
}

