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
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PatientProfileModal from "@/components/dashboard/PatientProfileModal";

interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  email: string;
  phone: string;
  requestDate: string;
  preferredDate: string;
  preferredTime: string;
  issueType: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "accepted" | "declined";
  isNewClient: boolean;
  mentalIllness?: string[];
  treatmentHistory?: {
    previousTherapists: number;
    currentMedications: string[];
    currentlyInTreatment: boolean;
    treatmentDuration?: string;
    previousDiagnoses?: string[];
  };
  message?: string;
  age?: number;
  gender?: string;
}

// Mock data
const MOCK_REQUESTS: AppointmentRequest[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1 (555) 111-2222",
    requestDate: "2024-01-16",
    preferredDate: "2024-01-20",
    preferredTime: "10:00 AM",
    issueType: "Anxiety Disorders",
    urgency: "high",
    status: "pending",
    isNewClient: true,
    age: 28,
    gender: "Female",
    mentalIllness: ["Generalized Anxiety Disorder", "Panic Disorder"],
    treatmentHistory: {
      previousTherapists: 0,
      currentMedications: [],
      currentlyInTreatment: false,
      previousDiagnoses: ["Generalized Anxiety Disorder"],
    },
    message:
      "I've been experiencing severe anxiety attacks and would like to start therapy as soon as possible.",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "James Anderson",
    email: "j.anderson@example.com",
    phone: "+1 (555) 222-3333",
    requestDate: "2024-01-16",
    preferredDate: "2024-01-22",
    preferredTime: "2:00 PM",
    issueType: "Depression",
    urgency: "medium",
    status: "pending",
    isNewClient: false,
    age: 35,
    gender: "Male",
    mentalIllness: ["Major Depressive Disorder"],
    treatmentHistory: {
      previousTherapists: 2,
      currentMedications: ["Sertraline 50mg", "Bupropion 150mg"],
      currentlyInTreatment: true,
      treatmentDuration: "3 years",
      previousDiagnoses: [
        "Major Depressive Disorder",
        "Persistent Depressive Disorder",
      ],
    },
    message:
      "Looking to continue therapy with a new therapist after relocating.",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 (555) 333-4444",
    requestDate: "2024-01-15",
    preferredDate: "2024-01-19",
    preferredTime: "4:00 PM",
    issueType: "Trauma & PTSD",
    urgency: "high",
    status: "pending",
    isNewClient: true,
    age: 32,
    gender: "Female",
    mentalIllness: ["Post-Traumatic Stress Disorder"],
    treatmentHistory: {
      previousTherapists: 1,
      currentMedications: ["Prazosin 1mg"],
      currentlyInTreatment: false,
      treatmentDuration: "6 months",
      previousDiagnoses: ["PTSD", "Acute Stress Disorder"],
    },
    message:
      "Need specialized trauma therapy. Previous therapist recommended EMDR.",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Michael Brown",
    email: "m.brown@example.com",
    phone: "+1 (555) 444-5555",
    requestDate: "2024-01-15",
    preferredDate: "2024-01-23",
    preferredTime: "11:00 AM",
    issueType: "Relationship Issues",
    urgency: "low",
    status: "pending",
    isNewClient: true,
    age: 42,
    gender: "Male",
    mentalIllness: [],
    treatmentHistory: {
      previousTherapists: 0,
      currentMedications: [],
      currentlyInTreatment: false,
    },
    message: "Seeking couples therapy for communication issues.",
  },
  {
    id: "5",
    patientId: "p5",
    patientName: "Olivia Davis",
    email: "olivia.d@example.com",
    phone: "+1 (555) 555-6666",
    requestDate: "2024-01-14",
    preferredDate: "2024-01-21",
    preferredTime: "3:00 PM",
    issueType: "Stress Management",
    urgency: "medium",
    status: "pending",
    isNewClient: false,
    age: 29,
    gender: "Female",
    mentalIllness: ["Adjustment Disorder"],
    treatmentHistory: {
      previousTherapists: 1,
      currentMedications: [],
      currentlyInTreatment: false,
      treatmentDuration: "1 year",
      previousDiagnoses: ["Adjustment Disorder with Anxiety"],
    },
    message:
      "Work-related stress is affecting my daily life. Need coping strategies.",
  },
  {
    id: "6",
    patientId: "p6",
    patientName: "Daniel Taylor",
    email: "d.taylor@example.com",
    phone: "+1 (555) 666-7777",
    requestDate: "2024-01-14",
    preferredDate: "2024-01-18",
    preferredTime: "9:00 AM",
    issueType: "Bipolar Disorder",
    urgency: "high",
    status: "pending",
    isNewClient: false,
    age: 38,
    gender: "Male",
    mentalIllness: ["Bipolar I Disorder"],
    treatmentHistory: {
      previousTherapists: 3,
      currentMedications: ["Lithium 900mg", "Quetiapine 200mg"],
      currentlyInTreatment: true,
      treatmentDuration: "8 years",
      previousDiagnoses: ["Bipolar I Disorder", "Generalized Anxiety Disorder"],
    },
    message:
      "Need ongoing therapy to manage bipolar disorder. Previous therapist retired.",
  },
];

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequest | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((request) => {
      const matchesSearch =
        request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.issueType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      const matchesClientType =
        clientTypeFilter === "all" ||
        (clientTypeFilter === "new" && request.isNewClient) ||
        (clientTypeFilter === "returning" && !request.isNewClient);

      const matchesUrgency =
        urgencyFilter === "all" || request.urgency === urgencyFilter;

      return (
        matchesSearch && matchesStatus && matchesClientType && matchesUrgency
      );
    });
  }, [searchQuery, statusFilter, clientTypeFilter, urgencyFilter]);

  const getUrgencyBadge = (urgency: AppointmentRequest["urgency"]) => {
    const styles = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[urgency]}`}
      >
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: AppointmentRequest["status"]) => {
    const styles = {
      pending: "bg-blue-100 text-blue-700",
      accepted: "bg-green-100 text-green-700",
      declined: "bg-gray-100 text-gray-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getClientTypeBadge = (isNewClient: boolean) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-light ${
          isNewClient
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {isNewClient ? "New" : "Returning"}
      </span>
    );
  };

  const handleViewProfile = (request: AppointmentRequest) => {
    setSelectedRequest(request);
    setIsProfileModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const stats = {
    total: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter((r) => r.status === "pending").length,
    newClients: MOCK_REQUESTS.filter((r) => r.isNewClient).length,
    highUrgency: MOCK_REQUESTS.filter((r) => r.urgency === "high").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-light text-foreground">
          My Requests
        </h1>
        <p className="text-muted-foreground font-light mt-1">
          Review and manage appointment requests from patients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Total Requests
              </p>
              <p className="text-3xl font-serif font-light text-foreground mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                Pending
              </p>
              <p className="text-3xl font-serif font-light text-foreground mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                New Clients
              </p>
              <p className="text-3xl font-serif font-light text-foreground mt-1">
                {stats.newClients}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 border border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-light text-muted-foreground">
                High Priority
              </p>
              <p className="text-3xl font-serif font-light text-foreground mt-1">
                {stats.highUrgency}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl bg-card p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, email, or issue type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-light"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
          >
            <Filter className="h-4 w-4" />
            {isFilterExpanded ? "Hide Filters" : "Show Filters"}
            {isFilterExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Filters */}
          {isFilterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Client Type
                </label>
                <Select
                  value={clientTypeFilter}
                  onValueChange={setClientTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new">New Clients</SelectItem>
                    <SelectItem value="returning">Returning Clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-light text-muted-foreground mb-2 block">
                  Urgency
                </label>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Urgency Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-light">Patient</TableHead>
                <TableHead className="font-light">Type</TableHead>
                <TableHead className="font-light">Issue</TableHead>
                <TableHead className="font-light">Preferred Date</TableHead>
                <TableHead className="font-light">Urgency</TableHead>
                <TableHead className="font-light">Status</TableHead>
                <TableHead className="font-light">Requested</TableHead>
                <TableHead className="font-light text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground font-light"
                  >
                    No requests found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif">
                          {request.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-light text-foreground">
                            {request.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground font-light">
                            {request.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getClientTypeBadge(request.isNewClient)}
                    </TableCell>
                    <TableCell className="font-light">
                      {request.issueType}
                    </TableCell>
                    <TableCell className="font-light">
                      <div className="text-sm">
                        {formatDate(request.preferredDate)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.preferredTime}
                      </div>
                    </TableCell>
                    <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="font-light text-sm text-muted-foreground">
                      {formatDate(request.requestDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewProfile(request)}
                          className="p-2 rounded-full hover:bg-muted transition-colors group"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              className="p-2 rounded-full hover:bg-green-100 transition-colors group"
                              title="Accept"
                            >
                              <Check className="h-4 w-4 text-muted-foreground group-hover:text-green-600" />
                            </button>
                            <button
                              className="p-2 rounded-full hover:bg-red-100 transition-colors group"
                              title="Decline"
                            >
                              <X className="h-4 w-4 text-muted-foreground group-hover:text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}
