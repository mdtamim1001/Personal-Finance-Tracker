'use client';

import { useEffect, useState } from 'react';

interface BudgetSummaryItem {
  category: string;
  month?: string; // e.g. "2025-06"
  budgeted: number;
  spent: number;
  percentage: number;
}

export default function DaisyProgress() {
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState<BudgetSummaryItem[]>([]);
  const [allSummary, setAllSummary] = useState<BudgetSummaryItem[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Set today's readable date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setDate(formattedDate);

    // set default selectedMonth = current YYYY-MM
    setSelectedMonth(today.toISOString().slice(0, 7));
  }, []);

  // Fetch all budget summary
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
          setAllSummary(data);

          // Extract unique months
          const uniqueMonths = Array.from(
            new Set(
              data
                .map((item: BudgetSummaryItem) => item.month)
                .filter((month): month is string => typeof month === 'string')
            )
          ).sort().reverse();

          setMonths(uniqueMonths);
        } else {
          console.error('Unexpected summary response:', data);
        }
      } catch (err) {
        console.error('Failed to fetch budget summary:', err);
      }
    };

    fetchSummary();
  }, []);

  // Filter summary for selected month
  useEffect(() => {
    if (!selectedMonth) return;
    const filtered = allSummary.filter((item) => item.month === selectedMonth);
    setSummary(filtered);
  }, [selectedMonth, allSummary]);

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

      {/* 🔽 Month Dropdown */}
      <div className="mb-4">
        <select
          className="select select-bordered w-full"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + '-01').toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Progress Bars */}
      {summary.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          No budget data available for selected month
        </p>
      ) : (
        summary.map((item) => (
          <div key={item.category} className="mb-5">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.category}</span>
              <span className="text-sm text-gray-600">
                {item.spent} / {item.budgeted} ({item.percentage.toFixed(0)}%)
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
