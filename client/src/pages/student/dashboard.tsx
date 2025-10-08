import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, TrendingUp, BookOpen, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudentDashboard() {
  // Mock data - will be replaced with real data from backend
  const stats = {
    xp: 1250,
    level: 5,
    streak: 7,
    assignmentsCompleted: 12,
    quizzesCompleted: 8,
    averageScore: 85,
  };

  const upcomingAssignments = [
    { id: "1", title: "Mathematics: Algebra Chapter 3", dueDate: "2025-10-12", subject: "Mathematics" },
    { id: "2", title: "Science: Photosynthesis Essay", dueDate: "2025-10-15", subject: "Science" },
  ];

  const recentActivity = [
    { id: "1", type: "quiz", title: "English Grammar Quiz", score: 90, date: "2 hours ago" },
    { id: "2", type: "assignment", title: "History Assignment", score: 85, date: "1 day ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Star className="h-4 w-4 text-gamification-xp" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gamification-xp">{stats.xp}</div>
            <p className="text-xs text-muted-foreground mt-1">Level {stats.level}</p>
            <Progress value={50} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-gamification-streak" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gamification-streak">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/chat">
          <Button className="w-full h-24 flex flex-col gap-2 hover-elevate" variant="outline">
            <Brain className="h-6 w-6" />
            <span>Ask AI Tutor</span>
          </Button>
        </Link>
        <Link href="/assignments">
          <Button className="w-full h-24 flex flex-col gap-2 hover-elevate" variant="outline">
            <FileText className="h-6 w-6" />
            <span>My Assignments</span>
          </Button>
        </Link>
        <Link href="/flashcards">
          <Button className="w-full h-24 flex flex-col gap-2 hover-elevate" variant="outline">
            <BookOpen className="h-6 w-6" />
            <span>Study Flashcards</span>
          </Button>
        </Link>
      </div>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`assignment-${assignment.id}`}
              >
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Due {assignment.dueDate}</p>
                  <Button size="sm" variant="outline" className="mt-2" data-testid={`button-start-${assignment.id}`}>
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-4 rounded-lg border"
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
