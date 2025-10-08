import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Brain, TrendingUp, Plus } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const stats = {
    totalStudents: 45,
    activeAssignments: 8,
    pendingGrading: 12,
    averageClassScore: 82,
  };

  const recentSubmissions = [
    { id: "1", studentName: "Alice Johnson", assignment: "Algebra Quiz", submittedAt: "2 hours ago" },
    { id: "2", studentName: "Bob Smith", assignment: "Essay on Photosynthesis", submittedAt: "3 hours ago" },
    { id: "3", studentName: "Carol Davis", assignment: "History Assignment", submittedAt: "5 hours ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes and students</p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/assignments/create">
            <Button className="gap-2" data-testid="button-create-assignment">
              <Plus className="h-4 w-4" />
              New Assignment
            </Button>
          </Link>
          <Link href="/teacher/quizzes/create">
            <Button variant="outline" className="gap-2" data-testid="button-create-quiz">
              <Plus className="h-4 w-4" />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Active in your classes</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently open</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <Brain className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingGrading}</div>
            <p className="text-xs text-muted-foreground mt-1">Submissions to review</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.averageClassScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`submission-${submission.id}`}
              >
                <div>
                  <h4 className="font-medium">{submission.studentName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{submission.submittedAt}</Badge>
                  <Button size="sm" data-testid={`button-grade-${submission.id}`}>
                    Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
