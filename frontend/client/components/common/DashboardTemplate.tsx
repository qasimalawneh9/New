import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "./Loading";
import { useCommon } from "@/hooks/useCommon";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  icon,
  color = "text-blue-600",
}: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </div>
        <div className={color}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface DashboardSection {
  id: string;
  title: string;
  component: React.ComponentType;
}

interface DashboardTemplateProps {
  title: string;
  subtitle?: string;
  stats?: StatCardProps[];
  sections: DashboardSection[];
  actions?: React.ReactNode;
}

export const DashboardTemplate = ({
  title,
  subtitle,
  stats = [],
  sections,
  actions,
}: DashboardTemplateProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const { user } = useCommon();

  if (!user) {
    return <Loading fullPage text="Loading dashboard..." />;
  }

  const ActiveComponent = sections.find(
    (section) => section.id === activeSection,
  )?.component;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Navigation */}
        {sections.length > 1 && (
          <div className="mb-6">
            <nav className="flex space-x-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </nav>
          </div>
        )}

        {/* Active Section Content */}
        <div>
          {ActiveComponent ? <ActiveComponent /> : <div>Section not found</div>}
        </div>
      </div>
    </div>
  );
};
