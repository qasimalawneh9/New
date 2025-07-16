import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  MessageSquare,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import {
  AdminStats,
  User,
  TeacherProfile,
  SupportTicket,
  Review,
  PayoutRequest,
  AdminActivity,
} from "../../types/platform";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

interface AdminDashboardProps {
  stats: AdminStats;
  recentActivities: AdminActivity[];
  pendingTeachers: TeacherProfile[];
  supportTickets: SupportTicket[];
  payoutRequests: PayoutRequest[];
  onApproveTeacher: (teacherId: string) => void;
  onRejectTeacher: (teacherId: string, reason: string) => void;
  onProcessPayout: (payoutId: string, action: "approve" | "reject") => void;
  onManageUser: (userId: string, action: "suspend" | "activate") => void;
  className?: string;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"];

export function AdminDashboard({
  stats,
  recentActivities,
  pendingTeachers,
  supportTickets,
  payoutRequests,
  onApproveTeacher,
  onRejectTeacher,
  onProcessPayout,
  onManageUser,
  className,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");

  const openTicketsCount = supportTickets.filter(
    (ticket) => ticket.status === "open",
  ).length;
  const pendingPayoutsAmount = payoutRequests
    .filter((payout) => payout.status === "pending")
    .reduce((sum, payout) => sum + payout.amount, 0);

  // Mock data for charts
  const userGrowthData = stats.userGrowth.map((item) => ({
    ...item,
    total: item.users + item.teachers + item.students,
  }));

  const revenueData = stats.revenueGrowth;

  const ticketStatusData = [
    { name: "Open", value: openTicketsCount },
    {
      name: "In Progress",
      value: supportTickets.filter((t) => t.status === "in_progress").length,
    },
    {
      name: "Resolved",
      value: supportTickets.filter((t) => t.status === "resolved").length,
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={`+${((stats.totalUsers / 1000) * 100).toFixed(1)}%`}
        />
        <StatCard
          title="Active Teachers"
          value={stats.totalTeachers}
          icon={GraduationCap}
          trend={`+${((stats.totalTeachers / 100) * 100).toFixed(1)}%`}
        />
        <StatCard
          title="Total Lessons"
          value={stats.totalLessons}
          icon={BookOpen}
          trend={`+${((stats.totalLessons / 500) * 100).toFixed(1)}%`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={`+${((stats.monthlyRevenue / 10000) * 100).toFixed(1)}%`}
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingTeachers.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {pendingTeachers.length} teacher applications pending review
            </AlertDescription>
          </Alert>
        )}
        {openTicketsCount > 0 && (
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              {openTicketsCount} support tickets require attention
            </AlertDescription>
          </Alert>
        )}
        {payoutRequests.filter((p) => p.status === "pending").length > 0 && (
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              ${pendingPayoutsAmount.toLocaleString()} in pending payouts
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8884d8"
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="#82ca9d"
                      name="Teachers"
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#ffc658"
                      name="Students"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <UserManagement onManageUser={onManageUser} />
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <TeacherManagement
            pendingTeachers={pendingTeachers}
            onApproveTeacher={onApproveTeacher}
            onRejectTeacher={onRejectTeacher}
          />
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4">
          <SupportManagement tickets={supportTickets} />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <PaymentManagement
            payoutRequests={payoutRequests}
            onProcessPayout={onProcessPayout}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView stats={stats} ticketStatusData={ticketStatusData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend: string;
}) {
  const isPositive = trend.startsWith("+");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p
              className={cn(
                "text-xs flex items-center gap-1",
                isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: AdminActivity }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <div className="w-2 h-2 bg-primary rounded-full" />
      <div className="flex-1">
        <p className="text-sm">{activity.action}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(activity.createdAt), "MMM d, HH:mm")}
        </p>
      </div>
    </div>
  );
}

function UserManagement({ onManageUser }: { onManageUser: any }) {
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "student",
      status: "active",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      profileImage: "",
      timezone: "UTC",
      emailVerified: true,
      twoFactorEnabled: false,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "teacher",
      status: "active",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
      profileImage: "",
      timezone: "UTC",
      emailVerified: true,
      twoFactorEnabled: true,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search users..." className="w-64" />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "MMM d")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onManageUser(
                            user.id,
                            user.status === "active" ? "suspend" : "activate",
                          )
                        }
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TeacherManagement({
  pendingTeachers,
  onApproveTeacher,
  onRejectTeacher,
}: {
  pendingTeachers: TeacherProfile[];
  onApproveTeacher: any;
  onRejectTeacher: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTeachers.map((teacher) => (
            <div key={teacher.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{teacher.userId}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {teacher.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teacher.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Experience:</span>{" "}
                    {teacher.experience} years
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Rate:</span> $
                    {teacher.hourlyRate}/hour
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApproveTeacher(teacher.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRejectTeacher(teacher.id, "Reason here")}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {pendingTeachers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No pending teacher applications
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SupportManagement({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.slice(0, 10).map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {ticket.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {ticket.category.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.priority === "urgent"
                        ? "destructive"
                        : ticket.priority === "high"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ticket.status}</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(ticket.createdAt), "MMM d")}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PaymentManagement({
  payoutRequests,
  onProcessPayout,
}: {
  payoutRequests: PayoutRequest[];
  onProcessPayout: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payoutRequests.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>{payout.teacherId}</TableCell>
                <TableCell>${payout.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payout.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payout.status === "pending"
                        ? "default"
                        : payout.status === "approved"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {payout.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(payout.requestedAt), "MMM d")}
                </TableCell>
                <TableCell>
                  {payout.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => onProcessPayout(payout.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onProcessPayout(payout.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AnalyticsView({
  stats,
  ticketStatusData,
}: {
  stats: AdminStats;
  ticketStatusData: any[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ticketStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stats.totalLessons}</div>
              <div className="text-sm text-muted-foreground">Total Lessons</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stats.activeBookings}</div>
              <div className="text-sm text-muted-foreground">
                Active Bookings
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stats.pendingPayouts}</div>
              <div className="text-sm text-muted-foreground">
                Pending Payouts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
