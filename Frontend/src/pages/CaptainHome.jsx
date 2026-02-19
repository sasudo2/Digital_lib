import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

function CaptainHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold">Captain Home</h2>
      </main>
      <SiteFooter />
    </div>
  );
}
export default CaptainHome;
