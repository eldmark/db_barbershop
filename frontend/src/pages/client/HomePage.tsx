import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const highlights = [
  { title: "Fresh fade", detail: "Precision cut with sculpted finish." },
  { title: "Beard ritual", detail: "Hot towel, clean line, calm skin." },
  { title: "Color touch", detail: "Natural blends with low maintenance." }
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="panel-dark p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-surface/70">Client experience</p>
        <h2 className="mt-4 text-4xl font-semibold text-surface md:text-5xl">Your next appointment starts here.</h2>
        <p className="mt-4 text-sm text-surface/70">
          Book in seconds, track your reservations, and discover the latest products.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="accent" onClick={() => navigate('/reservations')}>Book now</Button>
          <Button variant="ghost" onClick={() => navigate('/services')}>Explore services</Button>
        </div>
      </div>
      <div className="panel p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-content/50">Highlights</p>
        <div className="mt-6 space-y-4">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-surfaceAlt/40 bg-white/80 p-4">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-content/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
