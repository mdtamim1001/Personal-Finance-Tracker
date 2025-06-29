'use client';

import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Food',
  'Transport',
  'Utilities',
  'Housing',
  'Education',
  'Healthcare',
  'Entertainment',
  'Other',
];

export default function AddBudgetModal({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3000/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (res.ok) {
        setFormData({ category: '', amount: '', month: '' });
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Failed to add budget:', err);
    }
  };

  if (!open) return null;

  return (
   // <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Add New Budget</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full border px-3 py-2 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="w-full border px-3 py-2 rounded"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />

          <input
            type="month"
            className="w-full border px-3 py-2 rounded"
            value={formData.month}
            onChange={(e) =>
              setFormData({ ...formData, month: e.target.value })
            }
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
