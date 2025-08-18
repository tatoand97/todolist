import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
