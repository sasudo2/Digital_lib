import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
function Start() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h2 className="text-4xl font-bold mb-4">Get Started with Pathsala</h2>
          <p className="text-gray-700 mb-8">
            Sign in to browse thousands of books and track your reading progress.
          </p>
          <Link
            to="/reader-login"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded"
          >
            Continue
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
export default Start;
