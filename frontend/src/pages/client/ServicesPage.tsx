import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ServiceEntity = {
  id_service?: number;
  name: string;
  price: number;
};

export default function ServicesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceEntity[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      setError(null);
      try {
        const data = await apiFetch<ServiceEntity[]>("/services", { token });
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services");
      }
    };
    void loadServices();
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="panel p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-content/50">Services</p>
            <h2 className="mt-2 text-3xl font-semibold">Choose your vibe</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          {services.map((service) => {
            const priceNum = typeof service.price === "number" ? service.price : Number((service as any).price);
            const priceLabel = Number.isNaN(priceNum) ? "$0.00" : `$${priceNum.toFixed(2)}`;
            const isSelected = selectedService?.id_service === service.id_service;
            return (
              <button
                key={service.id_service}
                onClick={() => setSelectedService(service)}
                className={`rounded-3xl border-2 p-5 transition ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-surfaceAlt/40 bg-white/80 hover:border-accent/50"
                }`}
              >
                <p className="text-lg font-semibold">{service.name}</p>
                <p className="text-sm text-content/70">{`ID ${service.id_service ?? "-"}`}</p>
                <p className="mt-4 text-2xl font-semibold text-accent">{priceLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <div className="panel-solid p-8">
          <h3 className="text-2xl font-semibold">{selectedService.name}</h3>
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-sm text-content/60">Service ID</p>
              <p className="text-lg font-semibold">{selectedService.id_service}</p>
            </div>
            <div>
              <p className="text-sm text-content/60">Price</p>
              <p className="text-2xl font-semibold text-accent">
                ${((typeof selectedService.price === "number" ? selectedService.price : Number((selectedService as any).price)) || 0).toFixed(2)}
              </p>
            </div>
            <Button onClick={() => navigate("/reservations")} variant="accent">
              Reserve this service
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
