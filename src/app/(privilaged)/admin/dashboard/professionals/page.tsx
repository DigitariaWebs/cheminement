"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProfessionalStatus = "active" | "pending" | "inactive";

interface Professional {
  id: string;
  name: string;
  email: string;
  specialty: string;
  license: string;
  status: ProfessionalStatus;
  joinedDate: string;
  totalClients: number;
  totalSessions: number;
}

interface ProfessionalsData {
  professionals: Professional[];
  summary: {
    totalProfessionals: number;
    activeProfessionals: number;
    pendingProfessionals: number;
    totalSessions: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ProfessionalsPage() {
  const [data, setData] = useState<ProfessionalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProfessionals = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search: searchQuery,
        status: statusFilter,
      });
      const response = await fetch(`/api/admin/professionals?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch professionals");
      }
      const result = await response.json();
      setData(result);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals(1);
  }, [searchQuery, statusFilter]);

  const professionals = data?.professionals || [];
  const summary = data?.summary || {
    totalProfessionals: 0,
    activeProfessionals: 0,
    pendingProfessionals: 0,
    totalSessions: 0,
  };

  const getStatusBadge = (status: ProfessionalStatus) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      inactive: "bg-gray-100 text-gray-700",
    };

    const icons = {
      active: CheckCircle2,
      pending: Clock,
      inactive: XCircle,
    };

    const Icon = icons[status];

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-light text-foreground">
              Professionals
            </h1>
            <p className="text-muted-foreground font-light mt-2">
              Manage all professionals on the platform
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card p-6 border border-border/40">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-card border border-border/40">
          <div className="p-6 border-b border-border/40">
            <div className="animate-pulse">
              <div className="h-10 bg-muted rounded w-full max-w-md"></div>
            </div>
          </div>
          <div className="animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded m-6"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-light text-foreground">
              Professionals
            </h1>
            <p className="text-muted-foreground font-light mt-2">
              Manage all professionals on the platform
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-light text-foreground mb-2">
                Failed to load professionals data
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => fetchProfessionals(1)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-light text-foreground">
            Professionals
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Manage all professionals on the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProfessionals(currentPage)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Professional
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Professionals
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {summary.totalProfessionals}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">Active</p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {summary.activeProfessionals}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">Pending</p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {summary.pendingProfessionals}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Sessions
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {summary.totalSessions.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border/40">
        <div className="p-6 border-b border-border/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Specialty
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  License
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Clients
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Sessions
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Joined
                </th>
                <th className="text-right p-4 text-sm font-light text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => (
                <tr
                  key={professional.id}
                  className="border-t border-border/40 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-light text-foreground">
                        {professional.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {professional.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-light text-foreground">
                    {professional.specialty}
                  </td>
                  <td className="p-4 text-sm font-light text-muted-foreground">
                    {professional.license}
                  </td>
                  <td className="p-4">{getStatusBadge(professional.status)}</td>
                  <td className="p-4 text-sm font-light text-foreground">
                    {professional.totalClients}
                  </td>
                  <td className="p-4 text-sm font-light text-foreground">
                    {professional.totalSessions}
                  </td>
                  <td className="p-4 text-sm font-light text-muted-foreground">
                    {new Date(professional.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        {professional.status === "pending" && (
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                        )}
                        {professional.status === "active" && (
                          <DropdownMenuItem>Deactivate</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {professionals.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No professionals found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
