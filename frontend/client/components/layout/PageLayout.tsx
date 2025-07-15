import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const PageLayout = ({
  children,
  showNavbar = true,
  showFooter = true,
  className = "",
}: PageLayoutProps) => (
  <div className={`min-h-screen bg-background ${className}`}>
    {showNavbar && <Navbar />}
    <main className="flex-1">{children}</main>
    {showFooter && <Footer />}
  </div>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) => (
  <div className="min-h-screen bg-slate-50">
    {title && (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </header>
    )}
    <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
  </div>
);
