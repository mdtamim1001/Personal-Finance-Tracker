'use client';

import { useEffect, useState } from 'react';

interface BudgetSummaryItem {
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
}

export default function DaisyProgress() {
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState<BudgetSummaryItem[]>([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/budget/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setSummary(data);
        } else {
          console.error('Unexpected summary response:', data);
        }
      } catch (err) {
        console.error('Failed to fetch budget summary:', err);
      }
    };

    fetchSummary();
  }, []);

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'progress-success';
    if (percentage < 80) return 'progress-warning';
    return 'progress-error';
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 p-4 bg-base-100 rounded-box shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Goal Progress</h2>
        <span className="text-sm text-gray-500">{date}</span>
      </div>

      {summary.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No budget data available</p>
      ) : (
        summary.map((item) => (
          <div key={item.category} className="mb-5">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.category}</span>
              <span className="text-sm text-gray-600">
                {item.spent} / {item.budgeted} ({item.percentage}%)
              </span>
            </div>
            <progress
              className={`progress w-full ${getProgressColor(item.percentage)}`}
              value={item.percentage}
              max={100}
            ></progress>
          </div>
        ))
      )}
    </div>
  );
}
