'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import AddExpenseModal from "./addExpense"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Expense {
  id: number;
  expense_name: string;
  amount: number;
  date: string;
  category: string;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyTotals, setMonthlyTotals] = useState<{ [month: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: '',
    amount: '',
    date: '',
    category: '',
  });

  const fetchExpenses = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3000/expense/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setExpenses(data);

        // Group by month
        const grouped: { [month: string]: number } = {};
        data.forEach((item) => {
          const date = new Date(item.date);
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          grouped[month] = (grouped[month] || 0) + Number(item.amount);
        });

        setMonthlyTotals(grouped);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:3000/expense/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          date: new Date(formData.date).toISOString().split('T')[0],
        }),
      });

      if (res.ok) {
        setFormData({ expense_name: '', amount: '', date: '', category: '' });
        setShowModal(false);
        fetchExpenses();
      }
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const chartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyTotals),
        backgroundColor: '#60a5fa',
      },
    ],
  };


  return (
      <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Expenses</h1>

          {/* 📊 Chart + Add Button */}
          <div className="bg-white p-4 rounded shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Monthly Expense Summary</h2>

              </div>
              <Bar data={chartData} />
          </div>

          {/* 📋 Recent Expenses */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
              <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-right"
                  onClick={() => setShowModal(true)}
              >
                  + Add
              </button></div>
              {expenses.slice(0, 10).map((exp) => (
                  <div
                      key={exp.id}
                      className="border-b py-2 flex justify-between items-center text-sm"
                  >
                      <div>
                          <p className="font-medium">{exp.expense_name}</p>
                          <p className="text-gray-500">{exp.category}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-blue-600 font-semibold">৳ {exp.amount}</p>
                          <p className="text-gray-500 text-xs">
                              {new Date(exp.date).toLocaleDateString()}
                          </p>
                      </div>
                  </div>
              ))}
                {expenses.length === 0 && (
                    <p className="text-gray-500 text-sm">No expenses recorded.</p>
                )}
            </div>

            {/* ➕ Modal */}
            {showModal && (<AddExpenseModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchExpenses}
            />
            )}
        </div>
    );
}
