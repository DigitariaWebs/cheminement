"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
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

const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Dr. Sarah Martin",
    email: "sarah.martin@email.com",
    specialty: "Psychologist",
    license: "PSY-12345",
    status: "active",
    joinedDate: "2024-01-15",
    totalClients: 12,
    totalSessions: 48,
  },
  {
    id: "2",
    name: "Dr. Jean Dupont",
    email: "jean.dupont@email.com",
    specialty: "Psychiatrist",
    license: "PSY-67890",
    status: "active",
    joinedDate: "2024-02-20",
    totalClients: 8,
    totalSessions: 32,
  },
  {
    id: "3",
    name: "Marie Leblanc",
    email: "marie.leblanc@email.com",
    specialty: "Therapist",
    license: "THR-54321",
    status: "pending",
    joinedDate: "2024-12-01",
    totalClients: 0,
    totalSessions: 0,
  },
];

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProfessionals = mockProfessionals.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || prof.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Professional
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Professionals
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockProfessionals.length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">Active</p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockProfessionals.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">Pending</p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockProfessionals.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Sessions
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockProfessionals.reduce((sum, p) => sum + p.totalSessions, 0)}
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
              {filteredProfessionals.map((professional) => (
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

          {filteredProfessionals.length === 0 && (
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
