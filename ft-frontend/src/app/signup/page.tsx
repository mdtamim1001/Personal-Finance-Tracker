'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const isFormValid = isEmailValid && isPasswordValid;

  // Email validation
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(value));
  };

  // Password validation
  const validatePassword = (value: string) => {
    setIsPasswordValid(value.length >= 6);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    validateEmail(val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    validatePassword(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        },1500);
      } else {
                setError(data.message || 'Signup failed');
            }
        } catch {
            setError('Something went wrong');
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-start justify-center"
            style={{
                backgroundImage: "url('/home.jpg')",
            }}
        >
            {/* Background blur overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-0" />

            {/* Signup form container */}
            <div className="relative z-10 mt-20 max-w-md w-full p-6 border rounded shadow bg-white bg-opacity-90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
                        Signup successful! Redirecting to login...
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 mb-4 text-sm text-center">{error}</p>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className={`w-full px-3 py-2 border rounded ${email && !isEmailValid ? 'border-red-500' : ''
                            }`}
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {!isEmailValid && email && (
                        <p className="text-xs text-red-500">Enter a valid email address.</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        className={`w-full px-3 py-2 border rounded ${password && !isPasswordValid ? 'border-red-500' : ''
                            }`}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    {!isPasswordValid && password && (
                        <p className="text-xs text-red-500">Password must be at least 6 characters.</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={!isFormValid}
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}