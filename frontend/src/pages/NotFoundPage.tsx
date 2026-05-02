import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="app-container">
      <div className="panel p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-content/50">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-content/70">The route you requested is not available.</p>
        <div className="mt-6 flex justify-center">
          <Link to="/login">
            <Button variant="ghost">Return to login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
