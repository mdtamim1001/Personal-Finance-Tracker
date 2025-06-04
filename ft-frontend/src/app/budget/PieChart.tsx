'use client';

import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Budget',
        data: [],
        backgroundColor: [
          '#60a5fa', '#f87171', '#facc15', '#34d399', '#a78bfa', '#fb923c'
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/budget', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const budgets = await res.json();

        const labels = budgets.map((item: any) => item.category);
        const data = budgets.map((item: any) => Number(item.amount));

        setChartData((prev: any) => ({
          ...prev,
          labels,
          datasets: [
            {
              ...prev.datasets[0],
              data,
              backgroundColor: prev.datasets[0].backgroundColor.slice(0, labels.length),
            },
          ],
        }));
      } catch (err) {
        console.error('Failed to load chart data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Budget by Category</h2>
      <Pie data={chartData} />
    </div>
  );
}
