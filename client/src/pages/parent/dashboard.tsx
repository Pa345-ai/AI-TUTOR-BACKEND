import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BookOpen, Trophy, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ParentDashboard() {
  const children = [
    { id: "1", name: "Emma Davis", grade: 7 },
    { id: "2", name: "Liam Davis", grade: 5 },
  ];

  const selectedChild = children[0];

  const childStats = {
    averageScore: 85,
    assignmentsCompleted: 24,
    currentStreak: 7,
    upcomingDeadlines: 3,
  };

  const recentActivity = [
    { id: "1", type: "assignment", title: "Mathematics Homework", score: 92, date: "Yesterday" },
    { id: "2", type: "quiz", title: "Science Quiz", score: 78, date: "2 days ago" },
    { id: "3", type: "assignment", title: "English Essay", score: 88, date: "3 days ago" },
  ];

  const alerts = [
    { id: "1", type: "deadline", message: "Science assignment due in 2 days", priority: "medium" },
    { id: "2", type: "achievement", message: "Earned 'Week Warrior' badge!", priority: "low" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your child's learning progress</p>
        </div>
        <Select defaultValue={selectedChild.id}>
          <SelectTrigger className="w-[200px]" data-testid="select-child">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name} - Grade {child.grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{childStats.averageScore}%</div>
            <Progress value={childStats.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childStats.assignmentsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed this month</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-gamification-streak" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gamification-streak">{childStats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <AlertCircle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childStats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending deadlines</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  data-testid={`alert-${alert.id}`}
                >
                  <p className="text-sm">{alert.message}</p>
                  <Badge variant={alert.priority === "medium" ? "default" : "outline"}>
                    {alert.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`activity-${activity.id}`}
              >
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-chart-2">{activity.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
