'use client';

import { useState } from 'react';

interface Props {
  category: string;
  month: string;
  initialAmount: number;
  onClose: () => void;
  onUpdated: () => void;
}

export default function BudgetActionsModal({ category, month, initialAmount, onClose, onUpdated }: Props) {
  const [amount, setAmount] = useState(initialAmount);

  const token = sessionStorage.getItem('token');

  const handleUpdate = async () => {
    const res = await fetch('http://localhost:3000/budget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, amount, month }),
    });

    if (res.ok) {
      onUpdated();
      onClose();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/budget`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, month }),
    });

    if (res.ok) {
      onUpdated();
      onClose();
    }
  };

  return (
    //<div className="fixed inset-0 glass bg-opacity-50 flex justify-center items-center z-50">
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Edit "{category}"</h2>

        <label className="block text-sm mb-1">Amount (৳)</label>
        <input
          type="number"
          className="input input-bordered w-full mb-4"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-sm">Cancel</button>
          <button onClick={handleUpdate} className="btn btn-sm btn-primary">Update</button>
          <button onClick={handleDelete} className="btn btn-sm btn-error">Delete</button>
        </div>
      </div>
    </div>
  );
}
