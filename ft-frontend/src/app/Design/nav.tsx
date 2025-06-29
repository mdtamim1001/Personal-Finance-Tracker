'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react'; // or use an SVG instead
import Link from 'next/link';
import { Home, ReceiptText, Settings, Wallet } from 'lucide-react';


export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
   
    
    <nav className="bg-[#4B23D0] text-white px-6 py-3 flex justify-between items-center shadow-md">
        
        <div className="dropdown" >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle " 
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-10 p-4 space-y-2 shadow w-52 rounded-box"
            style={{ backgroundColor: '#150161' }}
          >
            <li>
              <Link className="text-white text-lg py-3 flex items-center gap-2" href="/">
                <Home size={20} /> Home
              </Link>
            </li>
            <li>
              <Link className="text-white text-lg py-3 flex items-center gap-2" href="/budget">
                <Wallet size={20} /> Budget
              </Link>
            </li>
            <li>
              <Link className="text-white text-lg py-3 flex items-center gap-2" href="/expense">
                <ReceiptText size={20} /> Expense
              </Link>
            </li>
            <li>
              <Link className="text-white text-lg py-3 flex items-center gap-2" href="/settings">
                <Settings size={20} /> Settings
              </Link>
            </li>
                          
          </ul>

        </div>
      
      {/* Left: Logo + Title */}
      <div className="flex items-center space-x-2">
        <div className="bg-white p-1  rounded-md">
         <Image src="/logo.png" alt="logo" width={25} height={25} />        
         </div>
        <span className="text-lg font-semibold tracking-tight">FinTrack</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-white text-black font-medium px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition"
        >
          Logout
                </button>

                <button className="bg-white p-2 rounded-full hover:bg-gray-200 transition">
                    <Bell className="w-4 h-4 text-black" />
                </button>

                <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2">
                        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                    </div>
                </div>
            </div>
        </nav>
        
    );
}
