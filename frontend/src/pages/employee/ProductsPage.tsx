import { useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import DataTable from "../../components/common/DataTable";
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

type FormState = {
  name: string;
  price: string;
  stock: string;
  id_category: string;
  id_supplier: string;
};

type State = {
  items: Product[];
  categories: Category[];
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  form: FormState;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { items: Product[]; categories: Category[]; suppliers: Supplier[] } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_FORM"; payload: Partial<FormState> }
  | { type: "RESET_FORM" };

const initialState: State = {
  items: [],
  categories: [],
  suppliers: [],
  loading: true,
  error: null,
  form: {
    name: "",
    price: "",
    stock: "",
    id_category: "",
    id_supplier: ""
  }
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        categories: action.payload.categories,
        suppliers: action.payload.suppliers
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_FORM":
      return { ...state, form: { ...state.form, ...action.payload } };
    case "RESET_FORM":
      return { ...state, form: initialState.form };
    default:
      return state;
  }
}

export default function ProductsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, categories, suppliers, loading, error, form } = state;

  const loadProducts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const [data, cats, sups] = await Promise.all([
        apiFetch<Product[]>("/products", { token }).catch(() => []),
        apiFetch<Category[]>("/categories", { token }).catch(() => []),
        apiFetch<Supplier[]>("/suppliers", { token }).catch(() => [])
      ]);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          items: Array.isArray(data) ? data : [],
          categories: Array.isArray(cats) ? cats : [],
          suppliers: Array.isArray(sups) ? sups : []
        }
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Request could not be completed" });
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.stock || !form.id_category || !form.id_supplier) {
      dispatch({ type: "SET_ERROR", payload: "Missing required information" });
      return;
    }
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      await apiFetch<Product>("/products", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          id_category: Number(form.id_category),
          id_supplier: Number(form.id_supplier)
        })
      });
      dispatch({ type: "RESET_FORM" });
      await loadProducts();
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Request could not be completed" });
    }
  };

  const handleDelete = async (id: number) => {
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      await apiFetch<void>(`/products/${id}`, { method: "DELETE", token });
      await loadProducts();
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Request could not be completed" });
    }
  };

  const rows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        id: item.id_product ?? 0,
        name: item.name,
        category: (categories.find((c) => c.id_category === item.id_category)?.name) ?? String(item.id_category),
        stock: String(item.stock),
        price: (() => {
          const n = typeof item.price === "number" ? item.price : Number((item as any).price);
          if (Number.isNaN(n)) return "$0.00";
          return `$${n.toFixed(2)}`;
        })(),
        actions: "" 
      })),
    [items]
  );

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader
        title="Products"
        subtitle="Manage retail inventory and pricing."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="panel p-6">
          {loading ? (
            <p className="text-sm text-content/70">Loading products...</p>
          ) : null}
          {error && !loading ? <p className="mb-4 text-sm text-accent">{error}</p> : null}
          <DataTable
            columns={[
              { key: "id", label: "ID" },
              { key: "name", label: "Product" },
              { key: "category", label: "Category" },
              { key: "stock", label: "Stock", align: "center" },
              { key: "price", label: "Price", align: "right" },
              {
                key: "actions",
                label: "Actions",
                align: "right",
                render: (_, row) => (
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn-ghost px-2 py-1 text-xs"
                      onClick={() => navigate(`/products/${row.id}`)}
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
            rows={rows as any}
          />
        </div>

        <div className="panel-solid p-6">
          <h3 className="text-lg font-semibold">New product</h3>
          <p className="mt-1 text-sm text-content/70">Add a new item to the inventory.</p>
          <div className="mt-4 grid gap-3">
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(event) => dispatch({ type: "UPDATE_FORM", payload: { name: event.target.value } })}
            />
            <input
              className="input"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(event) => dispatch({ type: "UPDATE_FORM", payload: { price: event.target.value } })}
            />
            <input
              className="input"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(event) => dispatch({ type: "UPDATE_FORM", payload: { stock: event.target.value } })}
            />
            <select
              className="input"
              value={form.id_category}
              onChange={(event) => dispatch({ type: "UPDATE_FORM", payload: { id_category: event.target.value } })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id_category} value={c.id_category}>{c.name}</option>
              ))}
            </select>
            <select
              className="input"
              value={form.id_supplier}
              onChange={(event) => dispatch({ type: "UPDATE_FORM", payload: { id_supplier: event.target.value } })}
            >
              <option value="">Select supplier</option>
              {suppliers.map((s) => (
                <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>
              ))}
            </select>
            <Button variant="accent" onClick={handleCreate}>Create product</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
