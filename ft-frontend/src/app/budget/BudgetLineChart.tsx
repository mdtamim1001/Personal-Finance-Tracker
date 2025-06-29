'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DownloadTxtButton from './Report';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyData {
  month: string;
  budgeted: number;
  spent: number;
}

export default function BudgetMonthlyLineChart() {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/budget/trend', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((summary) => {
        if (Array.isArray(summary)) setData(summary);
      })
      .catch((err) => console.error('Failed to fetch monthly summary', err));
  }, []);

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Total Budgeted (৳)',
        data: data.map((item) => item.budgeted),
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Total Spent (৳)',
        data: data.map((item) => item.spent),
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ allow custom height
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Budget vs Expense',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Taka (৳)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    //<div className="bg-white rounded shadow max-w-6xl mx-auto my-6">
      <div className="max-w-4xl w-full mx-auto p-2 bg-white shadow-md rounded-xl">

      <div className="flex justify-end pt-2 pb-0 pr-2">
      <div className="btn btn-sm btn-primary"><DownloadTxtButton /></div>
    </div>
      <div className="h-[380px] w-[600px]">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
