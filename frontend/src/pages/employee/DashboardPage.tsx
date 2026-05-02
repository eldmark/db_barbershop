import { useEffect, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";
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

export default function DashboardPage() {
  const { token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<Summary>({ today: 0, week: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [salesData, summaryData] = await Promise.all([
          apiFetch<Sale[]>("/sales", { token }),
          apiFetch<Summary>("/sales/summary", { token })
        ]);
        setSales(Array.isArray(salesData) ? salesData.slice(0, 3) : []);
        setSummary(summaryData);
      } catch (err) {
        setError("Request could not be completed");
      } finally {
        setLoading(false);
      }
    };
    if (token) void loadData();
  }, [token]);

  const rows = sales.map((sale) => ({
    ticket: `#${sale.id_sale}`,
    client: sale.user_name,
    service: sale.employee_name || "-",
    total: `$${Number(sale.total ?? 0).toFixed(2)}`,
    status: "Paid"
  }));

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader
        title="Sales pulse"
        subtitle="A live snapshot of today and the week." 
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Today" value={`$${summary.today.toFixed(2)}`} tone="success" />
        <StatCard label="Last 7 Days" value={`$${summary.week.toFixed(2)}`} tone="primary" />
        <StatCard label="Low Stock Items" value={String(summary.lowStock)} tone="accent" />
      </div>

      <div className="panel p-6">
        <SectionHeader title="Recent sales" subtitle="Track service + product bundles." />
        {loading && <p className="mt-4 text-sm text-content/70">Loading sales...</p>}
        {error && <p className="mt-4 text-sm text-accent">{error}</p>}
        {!loading && rows.length === 0 && <p className="mt-4 text-sm text-content/70">No sales yet.</p>}
        {!loading && rows.length > 0 && (
          <div className="mt-4">
            <DataTable
              columns={[
                { key: "ticket", label: "Ticket" },
                { key: "client", label: "Client" },
                { key: "service", label: "Employee" },
                { key: "total", label: "Total", align: "right" },
                { key: "status", label: "Status", align: "center" }
              ]}
              rows={rows}
            />
          </div>
        )}
      </div>
    </section>
  );
}
