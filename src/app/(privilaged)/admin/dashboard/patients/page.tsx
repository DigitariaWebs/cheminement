"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

type PatientStatus = "active" | "pending" | "inactive";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: PatientStatus;
  matchedWith?: string;
  joinedDate: string;
  totalSessions: number;
  issueType: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Jean Pierre",
    email: "jean.pierre@email.com",
    phone: "+1 (514) 555-0123",
    status: "active",
    matchedWith: "Dr. Sarah Martin",
    joinedDate: "2024-01-15",
    totalSessions: 12,
    issueType: "Anxiety",
  },
  {
    id: "2",
    name: "Marie Tremblay",
    email: "marie.tremblay@email.com",
    phone: "+1 (514) 555-0456",
    status: "active",
    matchedWith: "Dr. Jean Dupont",
    joinedDate: "2024-02-10",
    totalSessions: 8,
    issueType: "Depression",
  },
  {
    id: "3",
    name: "Louis Gagnon",
    email: "louis.gagnon@email.com",
    phone: "+1 (514) 555-0789",
    status: "pending",
    joinedDate: "2024-12-05",
    totalSessions: 0,
    issueType: "Stress",
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.issueType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PatientStatus) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      inactive: "bg-gray-100 text-gray-700",
    };

    const icons = {
      active: CheckCircle2,
      pending: AlertCircle,
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
            Patients
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Manage all patients on the platform
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Patients
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockPatients.length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">Active</p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockPatients.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Pending Match
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockPatients.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <p className="text-sm font-light text-muted-foreground">
            Total Sessions
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {mockPatients.reduce((sum, p) => sum + p.totalSessions, 0)}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border/40">
        <div className="p-6 border-b border-border/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
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
                  Contact
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Issue Type
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-light text-muted-foreground">
                  Matched With
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
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-border/40 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-light text-foreground">{patient.name}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-light text-foreground">
                        {patient.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-light text-foreground">
                    {patient.issueType}
                  </td>
                  <td className="p-4">{getStatusBadge(patient.status)}</td>
                  <td className="p-4 text-sm font-light text-muted-foreground">
                    {patient.matchedWith || "-"}
                  </td>
                  <td className="p-4 text-sm font-light text-foreground">
                    {patient.totalSessions}
                  </td>
                  <td className="p-4 text-sm font-light text-muted-foreground">
                    {new Date(patient.joinedDate).toLocaleDateString()}
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
                        {patient.status === "pending" && (
                          <DropdownMenuItem>
                            Assign Professional
                          </DropdownMenuItem>
                        )}
                        {patient.status === "active" && (
                          <DropdownMenuItem>
                            Change Professional
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No patients found</p>
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
