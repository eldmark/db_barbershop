import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import RoleGate from "../../components/common/RoleGate";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

type ServiceEntity = {
  id_service?: number;
  name: string;
  price: number;
};

export default function ServicesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ServiceEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "" });
  const [updateForm, setUpdateForm] = useState({ id_service: "", name: "", price: "" });
  const [deleteId, setDeleteId] = useState("");

  const rows = useMemo(
    () =>
      items.map((item) => ({
        id: item.id_service ?? 0,
        name: item.name,
        price: (() => {
          const n = typeof item.price === "number" ? item.price : Number((item as any).price);
          if (Number.isNaN(n)) return "$0.00";
          return `$${n.toFixed(2)}`;
        })()
      })),
    [items]
  );

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ServiceEntity[]>("/services", { token });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const handleCreate = async () => {
    setError(null);
    try {
      await apiFetch<ServiceEntity>("/services", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price)
        })
      });
      setForm({ name: "", price: "" });
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    }
  };

  const handleUpdate = async () => {
    if (!updateForm.id_service) return;
    setError(null);
    try {
      await apiFetch<ServiceEntity>(`/services/${updateForm.id_service}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: updateForm.name,
          price: Number(updateForm.price)
        })
      });
      setUpdateForm({ id_service: "", name: "", price: "" });
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setError(null);
    try {
      await apiFetch<void>(`/services/${deleteId}`, { method: "DELETE", token });
      setDeleteId("");
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader
        title="Services"
        subtitle="Curate the menu and timing."
        action={
          <RoleGate allow={["admin"]}>
            <Button>New service</Button>
          </RoleGate>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="panel p-6">
          {loading ? (
            <p className="text-sm text-content/70">Loading services...</p>
          ) : null}
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <DataTable
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Service" },
              { key: "price", label: "Price", align: "right" }
            ]}
            rows={rows}
          />
        </div>

        <div className="panel-solid p-6">
          <h3 className="text-lg font-semibold">Manage services</h3>
          <p className="mt-2 text-sm text-content/70">Create, update, or remove services.</p>
          <div className="mt-4 grid gap-3">
            <input
              className="input"
              placeholder="Service name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <input
              className="input"
              placeholder="Price"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
            <Button variant="accent" onClick={handleCreate}>Create service</Button>
          </div>
          <div className="mt-6 grid gap-3">
            <select
              className="input"
              value={updateForm.id_service}
              onChange={(event) => {
                const id = event.target.value;
                setUpdateForm({ ...updateForm, id_service: id });
                const svc = items.find((it) => String(it.id_service) === id);
                if (svc) {
                  setUpdateForm({ id_service: id, name: svc.name, price: String(svc.price) });
                }
              }}
            >
              <option value="">Select service to update</option>
              {items.map((s) => (
                <option key={s.id_service} value={s.id_service}>{s.name}</option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Service name"
              value={updateForm.name}
              onChange={(event) => setUpdateForm({ ...updateForm, name: event.target.value })}
            />
            <input
              className="input"
              placeholder="Price"
              value={updateForm.price}
              onChange={(event) => setUpdateForm({ ...updateForm, price: event.target.value })}
            />
            <Button variant="ghost" onClick={handleUpdate}>Update service</Button>
          </div>
          <div className="mt-6 grid gap-3">
            <input
              className="input"
              placeholder="Delete service ID"
              value={deleteId}
              onChange={(event) => setDeleteId(event.target.value)}
            />
            <Button variant="ghost" onClick={handleDelete}>Delete service</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
