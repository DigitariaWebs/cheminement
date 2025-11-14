"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReportPeriod = "week" | "month" | "quarter" | "year";

interface ReportMetrics {
  totalRevenue: number;
  revenueChange: number;
  totalSessions: number;
  sessionsChange: number;
  activeProfessionals: number;
  professionalsChange: number;
  activePatients: number;
  patientsChange: number;
}

const mockMetrics: ReportMetrics = {
  totalRevenue: 125430,
  revenueChange: 12.5,
  totalSessions: 1247,
  sessionsChange: 8.3,
  activeProfessionals: 45,
  professionalsChange: 5.2,
  activePatients: 312,
  patientsChange: 15.7,
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Platform-wide metrics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onValueChange={(val) => setPeriod(val as ReportPeriod)}
          >
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                ${mockMetrics.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{mockMetrics.revenueChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
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
                {mockMetrics.totalSessions.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">
                  +{mockMetrics.sessionsChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
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
                Active Professionals
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                {mockMetrics.activeProfessionals}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">
                  +{mockMetrics.professionalsChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
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
                Active Patients
              </p>
              <p className="text-2xl font-serif font-light text-foreground mt-2">
                {mockMetrics.activePatients}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  +{mockMetrics.patientsChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last period
                </span>
              </div>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            Revenue Breakdown
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-light text-muted-foreground">
                  Session Fees
                </span>
                <span className="text-sm font-medium text-foreground">
                  $98,450
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "78%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-light text-muted-foreground">
                  Subscription Plans
                </span>
                <span className="text-sm font-medium text-foreground">
                  $18,900
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "15%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-light text-muted-foreground">
                  Resource Sales
                </span>
                <span className="text-sm font-medium text-foreground">
                  $8,080
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "7%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <h2 className="text-xl font-serif font-light text-foreground mb-4">
            Top Issue Types
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-light text-foreground">
                Anxiety
              </span>
              <span className="text-sm font-medium text-foreground">
                432 sessions
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-light text-foreground">
                Depression
              </span>
              <span className="text-sm font-medium text-foreground">
                387 sessions
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-light text-foreground">
                Stress Management
              </span>
              <span className="text-sm font-medium text-foreground">
                265 sessions
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-light text-foreground">
                Relationship Issues
              </span>
              <span className="text-sm font-medium text-foreground">
                163 sessions
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card p-6 border border-border/40">
        <h2 className="text-xl font-serif font-light text-foreground mb-4">
          Professional Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Professional
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Total Sessions
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Active Clients
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Revenue Generated
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Avg. Rating
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-light text-foreground">
                  Dr. Sarah Martin
                </td>
                <td className="p-4 text-sm font-light text-foreground">48</td>
                <td className="p-4 text-sm font-light text-foreground">12</td>
                <td className="p-4 text-sm font-light text-foreground">
                  $7,200
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    ⭐ 4.9
                  </span>
                </td>
              </tr>
              <tr className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-light text-foreground">
                  Dr. Jean Dupont
                </td>
                <td className="p-4 text-sm font-light text-foreground">32</td>
                <td className="p-4 text-sm font-light text-foreground">8</td>
                <td className="p-4 text-sm font-light text-foreground">
                  $4,800
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    ⭐ 4.8
                  </span>
                </td>
              </tr>
              <tr className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-light text-foreground">
                  Marie Leblanc
                </td>
                <td className="p-4 text-sm font-light text-foreground">28</td>
                <td className="p-4 text-sm font-light text-foreground">7</td>
                <td className="p-4 text-sm font-light text-foreground">
                  $4,200
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    ⭐ 4.7
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
