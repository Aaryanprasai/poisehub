
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-extensions/Card";
import { Button } from "@/components/ui-extensions/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, TicketIcon, Search, Filter } from "lucide-react";

// Mock ticket data
const mockTickets = [
  {
    id: "T-2023-001",
    subject: "Payment not received",
    type: "payment",
    status: "open",
    createdAt: "2023-09-15T14:32:00Z",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    priority: "high"
  },
  {
    id: "T-2023-002",
    subject: "Track metadata issue",
    type: "metadata",
    status: "inProgress",
    createdAt: "2023-09-16T09:45:00Z",
    userName: "Alice Smith",
    userEmail: "alice.smith@example.com",
    priority: "medium"
  },
  {
    id: "T-2023-003",
    subject: "Distribution problem",
    type: "distribution",
    status: "resolved",
    createdAt: "2023-09-12T11:20:00Z",
    userName: "Bob Johnson",
    userEmail: "bob.johnson@example.com",
    priority: "low"
  },
  {
    id: "T-2023-004",
    subject: "Technical issue with upload",
    type: "technical",
    status: "open",
    createdAt: "2023-09-17T16:05:00Z",
    userName: "Emma Wilson",
    userEmail: "emma.wilson@example.com",
    priority: "high"
  },
  {
    id: "T-2023-005",
    subject: "Takedown request",
    type: "takedown",
    status: "inProgress",
    createdAt: "2023-09-14T10:15:00Z",
    userName: "Michael Brown",
    userEmail: "michael.brown@example.com",
    priority: "high"
  }
];

// Format date string to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get status badge based on ticket status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Open</Badge>;
    case "inProgress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Progress</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Get priority badge based on ticket priority
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">High</Badge>;
    case "medium":
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Medium</Badge>;
    case "low":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Get type badge based on ticket type
const getTypeBadge = (type: string) => {
  switch (type) {
    case "payment":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Payment</Badge>;
    case "metadata":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Metadata</Badge>;
    case "distribution":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Distribution</Badge>;
    case "technical":
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Technical</Badge>;
    case "takedown":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Takedown</Badge>;
    default:
      return <Badge>Other</Badge>;
  }
};

const AdminTickets = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tickets based on active tab and search query
  const filteredTickets = mockTickets.filter(ticket => {
    const matchesTab = activeTab === "all" || 
                      (activeTab === "open" && ticket.status === "open") ||
                      (activeTab === "inProgress" && ticket.status === "inProgress") ||
                      (activeTab === "resolved" && ticket.status === "resolved");
                      
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  // Calculate counts for each status
  const openCount = mockTickets.filter(ticket => ticket.status === "open").length;
  const inProgressCount = mockTickets.filter(ticket => ticket.status === "inProgress").length;
  const resolvedCount = mockTickets.filter(ticket => ticket.status === "resolved").length;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and respond to user support requests
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="relative">
                All Tickets
                <Badge className="ml-2 bg-slate-200 text-slate-800">{mockTickets.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="relative">
                Open
                <Badge className="ml-2 bg-blue-100 text-blue-800">{openCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="inProgress" className="relative">
                In Progress
                <Badge className="ml-2 bg-amber-100 text-amber-800">{inProgressCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="relative">
                Resolved
                <Badge className="ml-2 bg-green-100 text-green-800">{resolvedCount}</Badge>
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <TicketTable tickets={filteredTickets} />
          </TabsContent>
          <TabsContent value="open" className="space-y-4">
            <TicketTable tickets={filteredTickets} />
          </TabsContent>
          <TabsContent value="inProgress" className="space-y-4">
            <TicketTable tickets={filteredTickets} />
          </TabsContent>
          <TabsContent value="resolved" className="space-y-4">
            <TicketTable tickets={filteredTickets} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

interface TicketTableProps {
  tickets: typeof mockTickets;
}

const TicketTable = ({ tickets }: TicketTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <TicketIcon className="h-8 w-8 text-muted-foreground" />
                    <p>No tickets found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{getTypeBadge(ticket.type)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{ticket.userName}</span>
                      <span className="text-xs text-muted-foreground">{ticket.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminTickets;
