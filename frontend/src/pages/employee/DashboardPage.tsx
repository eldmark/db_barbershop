import { useEffect, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

type Sale = {
  id_sale: number;
  date: string;
  total: number | null;
  user_name: string;
  employee_name: string;
};

type Summary = {
  today: number;
  week: number;
  lowStock: number;
};

type TopProduct = { name: string; total_sold: number; total_revenue: number };
type ActiveCustomer = { name: string; email: string };

export default function DashboardPage() {
  const { token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<ActiveCustomer[]>([]);
  const [summary, setSummary] = useState<Summary>({ today: 0, week: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [salesData, summaryData, topData, customersData] = await Promise.all([
          apiFetch<Sale[]>("/sales", { token }),
          apiFetch<Summary>("/sales/summary", { token }),
          apiFetch<TopProduct[]>("/sales/top-products", { token }),
          apiFetch<ActiveCustomer[]>("/sales/active-customers", { token })
        ]);
        setSales(Array.isArray(salesData) ? salesData.slice(0, 3) : []);
        setSummary(summaryData);
        setTopProducts(Array.isArray(topData) ? topData : []);
        setActiveCustomers(Array.isArray(customersData) ? customersData : []);
      } catch {
        setError("Request could not be completed");
      } finally {
        setLoading(false);
      }
    };
    if (token) void loadData();
  }, [token]);

  const handleExportCSV = () => {
    if (sales.length === 0) return;
    const headers = ["Ticket", "Date", "Client", "Employee", "Total"];
    const rows = sales.map(s => [`#${s.id_sale}`, s.date.split("T")[0], s.user_name, s.employee_name, s.total]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const salesRows = sales.map((sale) => ({
    ticket: `#${sale.id_sale}`,
    client: sale.user_name,
    service: sale.employee_name || "-",
    total: `$${Number(sale.total ?? 0).toFixed(2)}`,
    status: "Paid"
  }));

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader
        title="Business Analytics"
        subtitle="Real-time data from the barber shop floor." 
        action={<Button variant="ghost" onClick={handleExportCSV}>Export to CSV</Button>}
      />
      
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Today (CTE logic)" value={`$${summary.today.toFixed(2)}`} tone="success" />
        <StatCard label="Last 7 Days" value={`$${summary.week.toFixed(2)}`} tone="primary" />
        <StatCard label="Low Stock Items" value={String(summary.lowStock)} tone="accent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-4">Top Sellers (GROUP BY / HAVING)</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-content/50 italic">Not enough sales yet.</p>
          ) : (
            <DataTable
              columns={[
                { key: "name", label: "Product" },
                { key: "total_sold", label: "Qty Sold", align: "center" },
                { key: "total_revenue", label: "Revenue", align: "right", render: (v) => `$${Number(v).toFixed(2)}` }
              ]}
              rows={topProducts as unknown as Record<string, ReactNode>[]}
            />
          )}
        </div>

        <div className="panel p-6">
          <h3 className="text-lg font-semibold mb-4">Active Clients (SUBQUERY logic)</h3>
          {activeCustomers.length === 0 ? (
            <p className="text-sm text-content/50 italic">No activity yet.</p>
          ) : (
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" }
              ]}
              rows={activeCustomers as unknown as Record<string, ReactNode>[]}
            />
          )}
        </div>
      </div>

      <div className="panel p-6">
        <SectionHeader title="Recent Transactions" subtitle="Mixed product and service tickets." />
        {loading && <p className="mt-4 text-sm text-content/70">Loading sales...</p>}
        {error && <p className="mt-4 text-sm text-accent">{error}</p>}
        {!loading && salesRows.length === 0 && <p className="mt-4 text-sm text-content/70">No sales yet.</p>}
        {!loading && salesRows.length > 0 && (
          <div className="mt-4">
            <DataTable
              columns={[
                { key: "ticket", label: "Ticket" },
                { key: "client", label: "Client" },
                { key: "service", label: "Employee" },
                { key: "total", label: "Total", align: "right" },
                { key: "status", label: "Status", align: "center" }
              ]}
              rows={salesRows}
            />
          </div>
        )}
      </div>
    </section>
  );
}
