import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

type Reservation = {
  id_reservation?: number;
  date: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
  id_user: number;
  id_employee: number;
  id_service: number;
  user_name?: string;
  employee_name?: string;
  service_name?: string;
};

type User = { id_user: number; name: string; role?: number };
type Employee = { id_employee: number; name: string };
type Service = { id_service: number; name: string };

export default function ReservationsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
     date: "", 
    time: "",
    status: "pending",
    id_user: "",
    id_employee: "",
    id_service: ""
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resData, usersData, servsData] = await Promise.all([
        apiFetch<Reservation[]>("/reservations", { token }).catch(() => []),
        apiFetch<User[]>('/users', { token }).catch(() => []),
        apiFetch<Service[]>('/services', { token }).catch(() => [])
      ]);
      setItems(Array.isArray(resData) ? resData : []);
      const allUsers = Array.isArray(usersData) ? usersData : [];
      // employees are users with role === 2
      const onlyEmployees = allUsers.filter((u: User) => (u.role ?? 0) === 2).map((u: User) => ({ id_employee: u.id_user, name: u.name }));
      setUsers(allUsers.filter((u: User) => (u.role ?? 0) !== 2));
      setEmployees(onlyEmployees as Employee[]);
      setServices(Array.isArray(servsData) ? servsData : []);
    } catch {
      setError("Request could not be completed");
      setItems([]);
      setUsers([]);
      setEmployees([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetch = async () => {
      await Promise.resolve();
      void loadData();
    };
    void fetch();
  }, [loadData]);

  const handleCreate = async () => {
    if (!form.date || !form.time || !form.id_user || !form.id_employee || !form.id_service) {
      setError("Missing required information");
      return;
    }
    setError(null);
    try {
      await apiFetch<Reservation>("/reservations", {
        method: "POST",
        token,
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          status: form.status as Reservation["status"],
          id_user: Number(form.id_user),
          id_employee: Number(form.id_employee),
          id_service: Number(form.id_service)
        })
      });
      setForm({ date: "", time: "", status: "pending", id_user: "", id_employee: "", id_service: "" });
      await loadData();
    } catch {
      setError("Request could not be completed");
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await apiFetch<void>(`/reservations/${id}`, { method: "DELETE", token });
      await loadData();
    } catch {
      setError("Request could not be completed");
    }
  };

  const rows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: item.id_reservation ?? 0,
        date: item.date.split("T")[0],
        time: item.time.slice(0, 5),
        status: item.status,
        user: item.user_name || String(item.id_user),
        employee: item.employee_name || String(item.id_employee),
        service: item.service_name || String(item.id_service),
        actions: ""
      })),
    [items]
  );

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader title="Reservations" subtitle="Manage the chair lineup." />
      
      <div className="grid gap-6">
        <div className="panel p-6">
          <h3 className="mb-4 text-lg font-semibold">Active Reservations</h3>
          {loading ? (
            <p className="text-sm text-content/70">Loading reservations...</p>
          ) : null}
          {error && !loading ? <p className="mb-4 text-sm text-accent">{error}</p> : null}
          <DataTable
            columns={[
              { key: "id", label: "ID" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time", align: "center" },
              { key: "status", label: "Status", align: "center" },
              { key: "user", label: "User" },
              { key: "employee", label: "Employee" },
              { key: "service", label: "Service" },
              {
                key: "actions",
                label: "Actions",
                align: "right",
                render: (_, row) => (
                  <div className="flex justify-end gap-2">
                    {row.status === "pending" && (
                      <button
                        className="btn-success px-2 py-1 text-xs"
                        onClick={() => navigate(`/sales?from_res=${row.id}`)}
                      >
                        Bill
                      </button>
                    )}
                    <button
                      className="btn-ghost px-2 py-1 text-xs"
                      onClick={() => navigate(`/reservations/${row.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-ghost px-2 py-1 text-xs text-accent"
                      onClick={() => row.id && handleDelete(Number(row.id))}
                    >
                      Delete
                    </button>
                  </div>
                )
              }
            ]}
            rows={rows as unknown as Record<string, ReactNode>[]}
          />
        </div>

        <div className="panel-solid p-6">
          <h3 className="text-lg font-semibold">New Reservation</h3>
          <p className="mt-1 text-sm text-content/70">Schedule a new service for a client.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">Date</label>
              <input
                className="input"
                type="date"
                value={form.date || ""}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">Time</label>
              <input
                className="input"
                type="time"
                value={form.time || ""}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="pending">pending</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">User</label>
              <select
                className="input"
                value={form.id_user || ""}
                onChange={(event) => setForm({ ...form, id_user: event.target.value })}
              >
                <option value="">Select User</option>
                {Array.isArray(users) && users.map((u) => (
                  <option key={u.id_user} value={u.id_user}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">Employee</label>
              <select
                className="input"
                value={form.id_employee || ""}
                onChange={(event) => setForm({ ...form, id_employee: event.target.value })}
              >
                <option value="">Select Employee</option>
                {Array.isArray(employees) && employees.map((e) => (
                  <option key={e.id_employee} value={e.id_employee}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-content/60">Service</label>
              <select
                className="input"
                value={form.id_service || ""}
                onChange={(event) => setForm({ ...form, id_service: event.target.value })}
              >
                <option value="">Select Service</option>
                {Array.isArray(services) && services.map((s) => (
                  <option key={s.id_service} value={s.id_service}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="accent" onClick={handleCreate}>Create reservation</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
