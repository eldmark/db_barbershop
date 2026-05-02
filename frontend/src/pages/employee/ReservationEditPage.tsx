import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
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

type User = { id_user: number; name: string };
type Employee = { id_employee: number; name: string };
type Service = { id_service: number; name: string };

export default function ReservationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [form, setForm] = useState({
    date: "",
    time: "",
    status: "pending",
    id_user: "",
    id_employee: "",
    id_service: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resData, usersData, empsData, servsData] = await Promise.all([
          apiFetch<Reservation>(`/reservations/${id}`, { token }),
          apiFetch<User[]>("/users", { token }),
          apiFetch<Employee[]>("/employees", { token }),
          apiFetch<Service[]>("/services", { token })
        ]);

        const res = Array.isArray(resData) ? resData[0] : resData;
        setForm({
          date: res.date.split("T")[0], // assuming YYYY-MM-DD
          time: res.time.slice(0, 5), // assuming HH:MM:SS or HH:MM
          status: res.status,
          id_user: String(res.id_user),
          id_employee: String(res.id_employee),
          id_service: String(res.id_service)
        });
        
        setUsers(usersData);
        setEmployees(empsData);
        setServices(servsData);
      } catch (err) {
        setError("Request could not be completed");
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.id_user || !form.id_employee || !form.id_service) {
      setError("Missing required information");
      return;
    }

    setError(null);
    try {
      await apiFetch<Reservation>(`/reservations/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          status: form.status,
          id_user: Number(form.id_user),
          id_employee: Number(form.id_employee),
          id_service: Number(form.id_service)
        })
      });
      navigate("/reservations");
    } catch (err) {
      setError("Request could not be completed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader title="Edit Reservation" subtitle={`Updating ticket #${id}`} />
      
      <div className="panel-solid p-6 max-w-2xl">
        {error && <p className="mb-4 text-sm text-accent">{error}</p>}
        
        <form onSubmit={handleUpdate} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Time</label>
              <input
                className="input"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">User</label>
            <select
              className="input"
              value={form.id_user}
              onChange={(e) => setForm({ ...form, id_user: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id_user} value={u.id_user}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Employee</label>
            <select
              className="input"
              value={form.id_employee}
              onChange={(e) => setForm({ ...form, id_employee: e.target.value })}
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id_employee} value={e.id_employee}>{e.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Service</label>
            <select
              className="input"
              value={form.id_service}
              onChange={(e) => setForm({ ...form, id_service: e.target.value })}
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id_service} value={s.id_service}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <Button type="submit" variant="accent">Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/reservations")}>Cancel</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
