'use client';
import { useEffect, useState } from 'react';
import AddBudgetModal from './addBudget';


interface CategoryItem {
  category: string;
  month?: string;
  budgeted: number;
  spent: number;
  percentage: number;
}

export default function CategoryTable({ selectedMonth }: { selectedMonth: string }) {
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [filtered, setFiltered] = useState<CategoryItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);



  useEffect(() => {
    const fetchSummary = async () => {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:3000/budget/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Normalize dates (remove time if needed)
      const normalized = data.map((item: CategoryItem) => ({
        ...item,
        month: item.month || '', // ensure safe access
      }));

      setAllCategories(normalized);
    };

    fetchSummary();
  }, []);

  // Filter by selected month
  useEffect(() => {
    const filteredData = allCategories.filter((item) => item.month === selectedMonth);
    setFiltered(filteredData);
  }, [selectedMonth, allCategories]);

  const getColor = (percent: number) => {
    if (percent < 70) return 'bg-green-500';
    if (percent < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  function fetchBudgets(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Categories</h2>
        <AddBudgetModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setRefreshKey((prev) => prev + 1); // trigger re-render
          }}
        />

        <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  + Add Budget
                </button>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No data for this month</p>
        ) : (
          <table className="table w-full text-sm">
            <thead className="text-gray-600">
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>${item.budgeted}</td>
                  <td>${item.spent}</td>
                  <td>${item.budgeted - item.spent}</td>
                  <td className="w-40">
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className={`h-2 rounded ${getColor(item.percentage)}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-right block mt-1">
                      {Math.round(item.percentage)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
