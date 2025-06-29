'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}
