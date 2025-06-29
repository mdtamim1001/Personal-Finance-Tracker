'use client';
import BudgetPieChart from "./BudgetPieChart";
import BudgetMonthlyLineChart from "./BudgetLineChart";
import CategoryTable from "./CategoryTable";
import { useState } from "react";

export default function BudgetPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
  const now = new Date();
  return now.toISOString().slice(0, 7); // "YYYY-MM"
});
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-gray-500">Manage your monthly budgets</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>
      </div>


      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BudgetPieChart selectedMonth={selectedMonth}/>
        <BudgetMonthlyLineChart />
        

      </div>
      {/* Table */}
      <CategoryTable selectedMonth={selectedMonth} />
    </main>
  );
}
