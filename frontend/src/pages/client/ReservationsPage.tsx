import { useEffect, useMemo, useState, useCallback } from "react";
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
};

type ServiceEntity = { id_service?: number; name: string; price: number | string };
type User = { id_user: number; name: string; role?: number };

export default function ReservationsPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [services, setServices] = useState<ServiceEntity[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: "",
    time: "",
    id_employee: "",
    id_service: ""
  });

  const upcoming = useMemo(
    () => items.filter((item) => item.id_user === user?.id_user),
    [items, user]
  );

  const loadReservations = useCallback(async () => {
    setError(null);
    try {
      const [resData, svcData, usersData] = await Promise.all([
        apiFetch<Reservation[]>("/reservations", { token }).catch(() => []),
        apiFetch<ServiceEntity[]>("/services", { token }).catch(() => []),
        apiFetch<User[]>("/users", { token }).catch(() => [])
      ]);
      setItems(Array.isArray(resData) ? resData : []);
      setServices(Array.isArray(svcData) ? svcData : []);
      // Filter to only employees (role === 2)
      const allUsers = Array.isArray(usersData) ? usersData : [];
      const onlyEmployees = allUsers.filter((u: User) => (u.role ?? 0) === 2);
      setEmployees(onlyEmployees);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reservations");
    }
  }, [token]);

  useEffect(() => {
    const fetch = async () => {
      await Promise.resolve();
      void loadReservations();
    };
    void fetch();
  }, [loadReservations]);

  const handleCreate = async () => {
    if (!user || !form.date || !form.time || !form.id_service) {
      setError("Please fill date, time, and service");
      return;
    }
    setError(null);
    try {
      // If no employee selected, pick one at random
      let empId = Number(form.id_employee);
      if (!form.id_employee && employees.length > 0) {
        empId = employees[Math.floor(Math.random() * employees.length)].id_user;
      }

      await apiFetch<Reservation>("/reservations", {
        method: "POST",
        token,
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          status: "pending",
          id_user: user.id_user,
          id_employee: empId,
          id_service: Number(form.id_service)
        })
      });
      setForm({ date: "", time: "", id_employee: "", id_service: "" });
      await loadReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reservation");
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-content/50">Book</p>
        <h2 className="mt-2 text-3xl font-semibold">Reserve your chair</h2>
        <div className="mt-6 grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase">Date</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase">Time</label>
            <input
              className="input"
              type="time"
              value={form.time}
              onChange={(event) => setForm({ ...form, time: event.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase">Service</label>
            <select
              className="input"
              value={form.id_service}
              onChange={(event) => setForm({ ...form, id_service: event.target.value })}
            >
              <option value="">Select a service</option>
              {services.map((s) => {
                const priceNum = typeof s.price === "number" ? s.price : Number(s.price);
                const priceLabel = Number.isNaN(priceNum) ? "$0" : `$${priceNum.toFixed(2)}`;
                return (
                  <option key={s.id_service} value={s.id_service}>
                    {s.name} ({priceLabel})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase">
              Employee <span className="text-content/50">(optional)</span>
            </label>
            <select
              className="input"
              value={form.id_employee}
              onChange={(event) => setForm({ ...form, id_employee: event.target.value })}
            >
              <option value="">Any available</option>
              {employees.map((e) => (
                <option key={e.id_user} value={e.id_user}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <Button variant="accent" onClick={handleCreate}>Request appointment</Button>
        </div>
        {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
      </div>

      <div className="panel-solid p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-content/50">Upcoming</p>
        <div className="mt-6 space-y-4">
          {upcoming.map((item) => (
            <div key={`${item.date}-${item.time}`} className="rounded-2xl border border-surfaceAlt/40 bg-white/80 p-4">
              <p className="text-lg font-semibold">Service #{item.id_service}</p>
              <p className="text-sm text-content/70">{item.date} at {item.time}</p>
              <p className="text-xs text-content/60">Status: {item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
