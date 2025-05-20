'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3000/account/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
      {user && (
        <p className="text-gray-700">
          Logged in as: <strong>{user.email}</strong>
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">What's next?</h2>
        <ul className="list-disc list-inside text-gray-800">
          <li>View your budget summary</li>
          <li>Add new expenses</li>
          <li>Track category-wise spending</li>
        </ul>
      </div>
    </div>
  );
}
