"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ClientDetailsModal from "@/components/dashboard/ClientDetailsModal";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  lastSession: string;
  totalSessions: number;
  issueType: string;
  joinedDate: string;
}

// Mock data
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastSession: "2024-01-15",
    totalSessions: 12,
    issueType: "Anxiety Disorders",
    joinedDate: "2023-10-01",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    lastSession: "2024-01-14",
    totalSessions: 8,
    issueType: "Depression",
    joinedDate: "2023-11-15",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "+1 (555) 345-6789",
    status: "pending",
    lastSession: "-",
    totalSessions: 0,
    issueType: "Stress Management",
    joinedDate: "2024-01-10",
  },
  {
    id: "4",
    name: "David Thompson",
    email: "d.thompson@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    lastSession: "2024-01-12",
    totalSessions: 15,
    issueType: "Trauma & PTSD",
    joinedDate: "2023-09-20",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "j.martinez@example.com",
    phone: "+1 (555) 567-8901",
    status: "inactive",
    lastSession: "2023-12-01",
    totalSessions: 6,
    issueType: "Relationship Issues",
    joinedDate: "2023-08-15",
  },
  {
    id: "6",
    name: "Robert Kim",
    email: "robert.k@example.com",
    phone: "+1 (555) 678-9012",
    status: "active",
    lastSession: "2024-01-16",
    totalSessions: 20,
    issueType: "Anxiety Disorders",
    joinedDate: "2023-07-01",
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Extract unique issue types for filter
  const issueTypes = useMemo(() => {
    const types = new Set(MOCK_CLIENTS.map((client) => client.issueType));
    return Array.from(types);
  }, []);

  // Filter and search clients
  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;

      const matchesIssueType =
        issueTypeFilter === "all" || client.issueType === issueTypeFilter;

      return matchesSearch && matchesStatus && matchesIssueType;
    });
  }, [searchQuery, statusFilter, issueTypeFilter]);

  const getStatusBadge = (status: Client["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-light ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          My Clients
        </h1>
        <p className="text-muted-foreground font-light mt-2">
          Manage and view all your clients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            Total Clients
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {MOCK_CLIENTS.length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            Active Clients
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {MOCK_CLIENTS.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            Pending Clients
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {MOCK_CLIENTS.filter((c) => c.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm font-light text-muted-foreground">
            Total Sessions
          </p>
          <p className="text-2xl font-serif font-light text-foreground mt-2">
            {MOCK_CLIENTS.reduce((sum, c) => sum + c.totalSessions, 0)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl bg-card overflow-hidden">
        {/* Header - Always Visible */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-serif font-light text-foreground">
                Search & Filters
              </h2>
              {isFilterExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {(searchQuery ||
              statusFilter !== "all" ||
              issueTypeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setIssueTypeFilter("all");
                }}
                className="text-sm text-primary hover:text-primary/80 font-light transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active Filters Summary - Shows when collapsed */}
          {!isFilterExpanded &&
            (searchQuery ||
              statusFilter !== "all" ||
              issueTypeFilter !== "all") && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Search: {searchQuery}
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Status: {statusFilter}
                  </span>
                )}
                {issueTypeFilter !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-light">
                    Type: {issueTypeFilter}
                  </span>
                )}
              </div>
            )}
        </div>

        {/* Collapsible Content */}
        {isFilterExpanded && (
          <div className="px-6 pb-6 space-y-6 border-t border-border/40 pt-6">
            {/* Search Bar */}
            <div>
              <label className="text-sm font-light text-muted-foreground mb-2 block">
                Search Clients
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Client Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-light">All Statuses</span>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="font-light">Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                        <span className="font-light">Inactive</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="font-light">Pending</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issue Type Filter */}
              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Issue Type
                </label>
                <Select
                  value={issueTypeFilter}
                  onValueChange={setIssueTypeFilter}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Filter by issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="font-light">All Issue Types</span>
                    </SelectItem>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="font-light">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                  <span className="font-medium text-foreground">
                    {filteredClients.length}
                  </span>
                  <span>of {MOCK_CLIENTS.length} clients</span>
                </div>
                {filteredClients.length !== MOCK_CLIENTS.length && (
                  <span className="text-xs text-primary font-light">
                    Filters applied
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clients Table */}
      <div className="rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-light">Client Name</TableHead>
              <TableHead className="font-light">Contact</TableHead>
              <TableHead className="font-light">Status</TableHead>
              <TableHead className="font-light">Issue Type</TableHead>
              <TableHead className="font-light">Last Session</TableHead>
              <TableHead className="font-light">Total Sessions</TableHead>
              <TableHead className="font-light">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground font-light"
                >
                  No clients found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-light">
                    <div>
                      <p className="font-medium text-foreground">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(client.joinedDate)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-light">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {client.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell className="font-light">
                    <span className="text-sm">{client.issueType}</span>
                  </TableCell>
                  <TableCell className="font-light">
                    <span className="text-sm">
                      {formatDate(client.lastSession)}
                    </span>
                  </TableCell>
                  <TableCell className="font-light">
                    <span className="text-sm">{client.totalSessions}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(client)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Schedule session"
                      >
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Client Details Modal */}
      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        client={selectedClient}
      />
    </div>
  );
}
