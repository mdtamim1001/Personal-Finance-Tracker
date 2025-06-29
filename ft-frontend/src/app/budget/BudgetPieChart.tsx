'use client';

import { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import BudgetActionsModal from "./EditBudgetModal";

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetItem {
    category: string;
    amount: number;
    month?: string;
}

const colors = [
    '#60a5fa', '#f87171', '#facc15', '#34d399',
    '#a78bfa', '#fb923c', '#f472b6', '#2dd4bf',
];

export default function BudgetPieChart({ selectedMonth }: { selectedMonth: string }) {
    const chartRef = useRef<any>(null);
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);

    const fetchBudgets = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:3000/budget', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const all: BudgetItem[] = await res.json();

        const filtered = all.filter((b) => {
            const m = new Date(b.month as string).toISOString().slice(0, 7);
            return m === selectedMonth;
        });

        setItems(filtered);
    };

    useEffect(() => {
        fetchBudgets();
        window.addEventListener('budget-refresh', fetchBudgets);
        return () => window.removeEventListener('budget-refresh', fetchBudgets);
    }, [selectedMonth]);

    const labels = items.map((b) => b.category);
    const data = items.map((b) => b.amount);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Budget (৳)',
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };

    const handleClick = (event: any, elements: any[]) => {
        if (!elements?.length || !chartRef.current) return;
        const index = elements[0].index;
        const item = items[index];
        if (item) {
            setSelectedItem(item);
        }
    };

    return (
        <div className="relative p-4 bg-white rounded-lg shadow w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-center mb-4">Budget Allocation</h2>

            {data.length === 0 ? (
                <p className="text-center text-gray-500">No budget data for this month.</p>
            ) : (
                <div className="h-[400px] relative">
                    <Pie
                        ref={chartRef}
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            onClick: handleClick,
                        }}
                    />
                </div>
            )}

            {selectedItem && (
                <BudgetActionsModal
                    category={selectedItem.category}
                    month={selectedMonth}
                    initialAmount={selectedItem.amount}
                    onClose={() => setSelectedItem(null)}
                    onUpdated={() => {
                        setSelectedItem(null);
                        window.dispatchEvent(new Event('budget-refresh'));
                    }}
                />
            )}



        </div>

    );
}
