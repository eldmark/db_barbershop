import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import Button from "../../components/common/Button";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

type Product = {
  id_product?: number;
  name: string;
  price: number;
  stock: number;
  id_category: number;
  id_supplier: number;
};

type Category = { id_category: number; name: string };
type Supplier = { id_supplier: number; name: string };

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    id_category: "",
    id_supplier: ""
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await apiFetch<Product>(`/products/${id}`, { token });
        setForm({
          name: data.name,
          price: String(data.price),
          stock: String(data.stock),
          id_category: String(data.id_category),
          id_supplier: String(data.id_supplier)
        });
        const [cats, sups] = await Promise.all([
          apiFetch<Category[]>("/categories", { token }).catch(() => []),
          apiFetch<Supplier[]>("/suppliers", { token }).catch(() => [])
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setSuppliers(Array.isArray(sups) ? sups : []);
  } catch {
        setError("Request could not be completed");
      } finally {
        setLoading(false);
      }
    };
    void loadProduct();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.id_category || !form.id_supplier) {
      setError("Missing required information");
      return;
    }

    setError(null);
    try {
      await apiFetch<Product>(`/products/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          id_category: Number(form.id_category),
          id_supplier: Number(form.id_supplier)
        })
      });
      navigate("/products");
    } catch {
      setError("Request could not be completed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader title="Edit Product" subtitle={`Updating item #${id}`} />
      
      <div className="panel-solid p-6 max-w-2xl">
        {error && <p className="mb-4 text-sm text-accent">{error}</p>}
        
        <form onSubmit={handleUpdate} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="input"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Price</label>
              <input
                className="input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Stock</label>
              <input
                className="input"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <select className="input" value={form.id_category} onChange={(e) => setForm({ ...form, id_category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id_category} value={c.id_category}>{c.name}</option>
                  ))}
                </select>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Supplier</label>
                <select className="input" value={form.id_supplier} onChange={(e) => setForm({ ...form, id_supplier: e.target.value })}>
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button type="submit" variant="accent">Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/products")}>Cancel</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
