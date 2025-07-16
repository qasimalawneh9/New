import React, { useState, useEffect } from "react";
import {
  adminDashboardService,
  type AdminTeacherApplication,
} from "@/api/services/admin-dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileText,
  Star,
  ArrowLeft,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AdminTeachers() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AdminTeacherApplication[]>(
    [],
  );
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    AdminTeacherApplication[]
  >([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedApplication, setSelectedApplication] =
    useState<AdminTeacherApplication | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, teachers, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [applicationsData, teachersData] = await Promise.all([
        adminDashboardService.getTeacherApplications(),
        adminDashboardService.getTeachers(),
      ]);

      setApplications(applicationsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Failed to load teacher data:", error);
      toast({
        title: "Error",
        description: "Failed to load teacher data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredApps = applications;
    let filteredTeach = teachers;

    // Apply search filter
    if (searchTerm) {
      filteredApps = filteredApps.filter(
        (app) =>
          app.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.teacherEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      filteredTeach = filteredTeach.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter for applications
    if (statusFilter !== "all") {
      filteredApps = filteredApps.filter((app) => app.status === statusFilter);
      filteredTeach = filteredTeach.filter(
        (teacher) => teacher.status === statusFilter,
      );
    }

    setFilteredApplications(filteredApps);
    setFilteredTeachers(filteredTeach);
  };

  const handleReviewApplication = async (
    application: AdminTeacherApplication,
    action: "approve" | "reject",
  ) => {
    try {
      const success =
        action === "approve"
          ? await adminDashboardService.approveTeacher(application.teacherId)
          : await adminDashboardService.rejectTeacher(
              application.teacherId,
              rejectionReason,
            );

      if (success) {
        toast({
          title: "Success",
          description: `Teacher application ${action}d successfully`,
        });
        await loadData();
      } else {
        throw new Error(`Failed to ${action} application`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} application`,
        variant: "destructive",
      });
    }

    setReviewDialogOpen(false);
    setSelectedApplication(null);
    setReviewAction(null);
    setRejectionReason("");
  };

  const openReviewDialog = (
    application: AdminTeacherApplication,
    action: "approve" | "reject",
  ) => {
    setSelectedApplication(application);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading teacher data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Teacher Management</h1>
            <p className="text-muted-foreground">
              Review applications and manage teachers
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">
                  {applications.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">
                  {teachers.filter((t) => t.status === "approved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">
                  {teachers.filter((t) => t.status === "rejected").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Teachers</p>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Applications and Teachers */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">
            Pending Applications ({filteredApplications.length})
          </TabsTrigger>
          <TabsTrigger value="teachers">
            All Teachers ({filteredTeachers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Application Data</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {application.teacherName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.teacherEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              application.submittedAt,
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          {application.status === "pending" && (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                onClick={() =>
                                  openReviewDialog(application, "approve")
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  openReviewDialog(application, "reject")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>All Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(teacher.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              Rating: {teacher.rating || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Lessons: {teacher.totalLessons || 0}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              ${teacher.earnings || 0}
                            </div>
                            <div className="text-muted-foreground">
                              Total earned
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Lessons
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend Teacher
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Application Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve"
                ? "Approve Teacher"
                : "Reject Teacher"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? `Are you sure you want to approve ${selectedApplication?.teacherName} as a teacher?`
                : `Are you sure you want to reject ${selectedApplication?.teacherName}'s application?`}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === "reject" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={() =>
                selectedApplication &&
                reviewAction &&
                handleReviewApplication(selectedApplication, reviewAction)
              }
              disabled={reviewAction === "reject" && !rejectionReason.trim()}
            >
              {reviewAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
