'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-slate-600 mt-2">Book faster and manage your visits.</p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+962 7 0000 0000"
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 text-white h-12 px-6 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
      <Image
        src="https://images.unsplash.com/photo-1588771930290-24f3b0b1a888?q=80&w=1200&auto=format&fit=crop"
        alt="Dental care"
        width={1200}
        height={800}
        className="rounded-3xl shadow-lg"
      />
    </main>
  );
}
