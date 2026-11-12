import { useEffect, useMemo, useState, useReducer, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

type Product = {
  id_product: number;
  name: string;
  price: number;
  stock: number;
};

type Service = {
  id_service: number;
  name: string;
  price: number;
};

type Sale = {
  id_sale?: number;
  date: string;
  total?: number;
  id_user: number;
  id_employee: number;
  user_name?: string;
  employee_name?: string;
  products?: Array<{ id_product: number; quantity: number; unit_price: number }>;
  services?: Array<{ id_service: number; quantity: number; unit_price: number }>;
};

type User = { id_user: number; name: string; role?: number };

type CartItem = {
  type: "product" | "service";
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
};

type CartState = {
  products: CartItem[];
  services: CartItem[];
};

type CartAction =
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "ADD_SERVICE"; service: Service }
  | { type: "REMOVE_ITEM"; itemType: "product" | "service"; index: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_SERVICES"; services: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const existing = state.products.find((i) => i.id === action.product.id_product);
      if (existing) {
        return {
          ...state,
          products: state.products.map((i) =>
            i.id === action.product.id_product ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        products: [
          ...state.products,
          {
            type: "product",
            id: action.product.id_product,
            name: action.product.name,
            quantity: 1,
            unit_price: action.product.price,
          },
        ],
      };
    }
    case "ADD_SERVICE": {
      const existing = state.services.find((i) => i.id === action.service.id_service);
      if (existing) {
        return {
          ...state,
          services: state.services.map((i) =>
            i.id === action.service.id_service ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        services: [
          ...state.services,
          {
            type: "service",
            id: action.service.id_service,
            name: action.service.name,
            quantity: 1,
            unit_price: action.service.price,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      if (action.itemType === "product") {
        return { ...state, products: state.products.filter((_, i) => i !== action.index) };
      }
      return { ...state, services: state.services.filter((_, i) => i !== action.index) };
    case "CLEAR_CART":
      return { products: [], services: [] };
    case "SET_SERVICES":
      return { ...state, services: action.services };
    default:
      return state;
  }
}

type Reservation = {
  id_reservation: number;
  id_user: number;
  id_employee: number;
  id_service: number;
  date: string;
  status?: string;
};

export default function SalesPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const resId = searchParams.get("from_res");

  const [items, setItems] = useState<Sale[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catalogType, setCatalogType] = useState<"products" | "services">("products");
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    id_user: "",
    id_employee: "",
    id_reservation: ""
  });

  const [cart, dispatch] = useReducer(cartReducer, { products: [], services: [] });

  const filteredCatalog = useMemo(() => {
    if (catalogType === "products") {
      return allProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return allServices.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [allProducts, allServices, search, catalogType]);

  const totalAmount = useMemo(() => {
    const pTotal = cart.products.reduce((sum, p) => sum + p.quantity * p.unit_price, 0);
    const sTotal = cart.services.reduce((sum, s) => sum + s.quantity * s.unit_price, 0);
    return pTotal + sTotal;
  }, [cart]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [salesData, productsData, servicesData, usersData] = await Promise.all([
        apiFetch<Sale[]>("/sales", { token }),
        apiFetch<Product[]>("/products", { token }),
        apiFetch<Service[]>("/services", { token }),
        apiFetch<User[]>("/users", { token })
      ]);
      setItems(Array.isArray(salesData) ? salesData : []);
      setAllProducts(Array.isArray(productsData) ? productsData : []);
      setAllServices(Array.isArray(servicesData) ? servicesData : []);
      
      const allUsers = Array.isArray(usersData) ? usersData : [];
      setEmployees(allUsers.filter(u => u.role === 2)); // 2 = employee
      setUsers(allUsers.filter(u => u.role !== 2));

      // If billing from a reservation
      if (resId) {
        const res = await apiFetch<Reservation | Reservation[]>(`/reservations/${resId}`, { token });
        const resData = Array.isArray(res) ? res[0] : res;
        if (resData) {
          setForm(f => ({
            ...f,
            id_user: String(resData.id_user),
            id_employee: String(resData.id_employee),
            id_reservation: String(resData.id_reservation)
          }));
          // Auto-add the booked service
          const bookedService = (Array.isArray(servicesData) ? servicesData : []).find(s => s.id_service === resData.id_service);
          if (bookedService) {
            dispatch({
              type: "SET_SERVICES",
              services: [{
                type: "service",
                id: bookedService.id_service,
                name: bookedService.name,
                quantity: 1,
                unit_price: bookedService.price
              }]
            });
          }
        }
      }
    } catch {
      setError("Request could not be completed");
    } finally {
      setLoading(false);
    }
  }, [token, resId]);

  useEffect(() => {
    const fetch = async () => {
      await loadData();
    };
    void fetch();
  }, [loadData]);

  const addToSale = (item: Product | Service) => {
    if ("id_product" in item) {
      dispatch({ type: "ADD_PRODUCT", product: item });
    } else {
      dispatch({ type: "ADD_SERVICE", service: item });
    }
  };

  const removeItem = (type: "product" | "service", index: number) => {
    dispatch({ type: "REMOVE_ITEM", itemType: type, index });
  };

  const handleCreate = async () => {
    if (!form.id_user || !form.id_employee || (cart.products.length === 0 && cart.services.length === 0)) {
      setError("Missing required information");
      return;
    }
    setError(null);
    try {
      await apiFetch<Sale>("/sales", {
        method: "POST",
        token,
        body: JSON.stringify({
          date: form.date,
          total: totalAmount,
          id_user: Number(form.id_user),
          id_employee: Number(form.id_employee),
          id_reservation: form.id_reservation ? Number(form.id_reservation) : undefined,
          products: cart.products.map(({ id, quantity, unit_price }) => ({ id_product: id, quantity, unit_price })),
          services: cart.services.map(({ id, quantity, unit_price }) => ({ id_service: id, quantity, unit_price }))
        })
      });
      dispatch({ type: "CLEAR_CART" });
      setForm({ ...form, id_user: "", id_employee: "", id_reservation: "" });
      await loadData();
    } catch {
      setError("Request could not be completed");
    }
  };

  const rows = useMemo(
    () =>
      items.map((item) => ({
        id: item.id_sale ?? 0,
        date: item.date.split("T")[0],
        total: `$${Number(item.total ?? 0).toFixed(2)}`,
        user: item.user_name || String(item.id_user),
        employee: item.employee_name || String(item.id_employee)
      })),
    [items]
  );

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader title="Sales" subtitle="Register a transaction in seconds." />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${catalogType === "products" ? "bg-primary text-white" : "bg-surfaceAlt text-content/60"}`}
                  onClick={() => setCatalogType("products")}
                >
                  Products
                </button>
                <button 
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${catalogType === "services" ? "bg-primary text-white" : "bg-surfaceAlt text-content/60"}`}
                  onClick={() => setCatalogType("services")}
                >
                  Services
                </button>
              </div>
              <input
                className="input max-w-xs"
                placeholder={`Search ${catalogType}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-auto pr-2">
              {filteredCatalog.map((item: Product | Service) => (
                <div key={"id_product" in item ? item.id_product : item.id_service} className="panel-solid p-4 flex flex-col justify-between border border-transparent hover:border-primary/30 transition-all">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-content/70">${Number(item.price).toFixed(2)}</p>
                    {"stock" in item && <p className="text-xs text-content/50">Stock: {item.stock}</p>}
                  </div>
                  <button
                    className="btn-success mt-3 py-1 text-xs"
                    onClick={() => addToSale(item)}
                  >
                    Add to Sale
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
            {loading ? <p className="text-sm text-content/70">Loading sales...</p> : null}
            <DataTable
              columns={[
                { key: "id", label: "Ticket" },
                { key: "date", label: "Date" },
                { key: "user", label: "User" },
                { key: "employee", label: "Employee" },
                { key: "total", label: "Total", align: "right" }
              ]}
              rows={rows}
            />
          </div>
        </div>

        <div className="panel-solid p-6 h-fit sticky top-6">
          <h3 className="text-lg font-semibold">Current Sale</h3>
          {form.id_reservation && <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded w-fit">Billing Reservation #{form.id_reservation}</div>}
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-content/60 uppercase text-[10px] tracking-widest">Client</label>
              <select className="input" value={form.id_user} onChange={(e) => setForm({ ...form, id_user: e.target.value })}>
                <option value="">Select User</option>
                {users.map((u) => <option key={u.id_user} value={u.id_user}>{u.name}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-content/60 uppercase text-[10px] tracking-widest">Employee</label>
              <select className="input" value={form.id_employee} onChange={(e) => setForm({ ...form, id_employee: e.target.value })}>
                <option value="">Select Employee</option>
                {employees.map((e) => <option key={e.id_user} value={e.id_user}>{e.name}</option>)}
              </select>
            </div>

            <div className="border-t border-surfaceAlt/50 pt-4 mt-2">
              <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-content/40">Checkout Summary</h4>
              <div className="grid gap-3 max-h-60 overflow-auto pr-2">
                {[...cart.services, ...cart.products].length === 0 ? (
                  <p className="text-sm text-content/50 italic">Cart is empty.</p>
                ) : (
                  <>
                    {cart.services.map((s, i) => (
                      <div key={`s-${i}`} className="flex items-center justify-between gap-2 py-2 border-b border-surfaceAlt/30 last:border-0">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{s.name} <span className="text-[10px] text-primary ml-1 font-normal opacity-70">Service</span></div>
                          <div className="text-xs text-content/70">${Number(s.unit_price).toFixed(2)}</div>
                        </div>
                        <button className="text-accent/60 hover:text-accent" onClick={() => removeItem("service", i)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {cart.products.map((p, i) => (
                      <div key={`p-${i}`} className="flex items-center justify-between gap-2 py-2 border-b border-surfaceAlt/30 last:border-0">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{p.name} <span className="text-[10px] text-accent ml-1 font-normal opacity-70">Product</span></div>
                          <div className="text-xs text-content/70">{p.quantity} × ${Number(p.unit_price).toFixed(2)}</div>
                        </div>
                        <button className="text-accent/60 hover:text-accent" onClick={() => removeItem("product", i)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-surfaceAlt/50 pt-4 mt-2 flex justify-between items-center">
              <span className="font-bold text-sm text-content/50 uppercase tracking-widest">Total Amount</span>
              <span className="text-2xl font-bold text-success">${totalAmount.toFixed(2)}</span>
            </div>

            {error && <p className="text-xs text-accent font-medium">{error}</p>}
            
            <Button variant="success" className="w-full mt-2" onClick={handleCreate} disabled={cart.products.length === 0 && cart.services.length === 0}>
              Finalize & Print Ticket
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
