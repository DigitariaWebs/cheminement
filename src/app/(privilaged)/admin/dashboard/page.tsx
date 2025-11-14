"use client";

import {
  Users,
  User,
  BarChart3,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = {
    totalProfessionals: 45,
    professionalsChange: 5.2,
    totalPatients: 312,
    patientsChange: 15.7,
    totalSessions: 1247,
    sessionsChange: 8.3,
    totalRevenue: 125430,
    revenueChange: 12.5,
  };

  const recentActivity = [
    {
      id: 1,
      type: "professional_joined",
      message: "Dr. Marie Leblanc joined the platform",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "session_completed",
      message: "48 sessions completed today",
      time: "5 hours ago",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "pending_approval",
      message: "3 professionals pending approval",
      time: "1 day ago",
      icon: Clock,
      color: "text-yellow-600",
    },
  ];

  const topProfessionals = [
    { name: "Dr. Sarah Martin", sessions: 48, rating: 4.9, revenue: 7200 },
    { name: "Dr. Jean Dupont", sessions: 32, rating: 4.8, revenue: 4800 },
    { name: "Marie Leblanc", sessions: 28, rating: 4.7, revenue: 4200 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground font-light mt-2">
          Platform overview and key metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Professionals
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                {stats.totalProfessionals}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{stats.professionalsChange}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Patients
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                {stats.totalPatients}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  +{stats.patientsChange}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <User className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Sessions
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                {stats.totalSessions.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">
                  +{stats.sessionsChange}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{stats.revenueChange}%
                </span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div
                    className={`rounded-full bg-background p-2 ${activity.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-light text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            Top Professionals
          </h2>
          <div className="space-y-3">
            {topProfessionals.map((prof, index) => (
              <div
                key={prof.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-light text-foreground">
                      {prof.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {prof.sessions} sessions • ⭐ {prof.rating}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  ${prof.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-6 border border-border/40">
        <h2 className="text-xl font-serif font-light text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/admin/dashboard/professionals"
            className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-light text-foreground mb-2">
              Review Professionals
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              Approve or manage professional accounts
            </p>
          </a>
          <a
            href="/admin/dashboard/patients"
            className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-light text-foreground mb-2">Manage Patients</h3>
            <p className="text-sm text-muted-foreground font-light">
              View and manage patient accounts
            </p>
          </a>
          <a
            href="/admin/dashboard/reports"
            className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <h3 className="font-light text-foreground mb-2">View Reports</h3>
            <p className="text-sm text-muted-foreground font-light">
              Access detailed platform analytics
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
