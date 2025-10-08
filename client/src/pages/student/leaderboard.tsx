import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const leaderboardData = [
  { id: "1", rank: 1, name: "Alice Johnson", xp: 5240, level: 12, streak: 45, avatar: "" },
  { id: "2", rank: 2, name: "Bob Smith", xp: 4890, level: 11, streak: 32, avatar: "" },
  { id: "3", rank: 3, name: "Carol Davis", xp: 4650, level: 11, streak: 28, avatar: "" },
  { id: "4", rank: 4, name: "David Wilson", xp: 4320, level: 10, streak: 21, avatar: "" },
  { id: "5", rank: 5, name: "Eve Martinez", xp: 4100, level: 10, streak: 19, avatar: "" },
  { id: "6", rank: 6, name: "You", xp: 3850, level: 9, streak: 15, isCurrentUser: true, avatar: "" },
  { id: "7", rank: 7, name: "Frank Brown", xp: 3720, level: 9, streak: 14, avatar: "" },
];

const achievements = [
  { id: "1", name: "Perfect Score", description: "Got 100% on a quiz", icon: "🎯", unlocked: true },
  { id: "2", name: "Week Warrior", description: "7-day streak", icon: "🔥", unlocked: true },
  { id: "3", name: "Quick Learner", description: "Complete 10 assignments", icon: "⚡", unlocked: true },
  { id: "4", name: "Master Mind", description: "Reach Level 10", icon: "🧠", unlocked: false },
  { id: "5", name: "Dedicated Student", description: "30-day streak", icon: "💎", unlocked: false },
];

export default function Leaderboard() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-gamification-xp" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-gamification-streak" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">Compete with other students and earn achievements</p>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly" data-testid="tab-weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-monthly">This Month</TabsTrigger>
          <TabsTrigger value="allTime" data-testid="tab-all-time">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gamification-xp" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      user.isCurrentUser 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "hover-elevate"
                    }`}
                    data-testid={`leaderboard-row-${user.rank}`}
                  >
                    <div className="w-12 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        {user.isCurrentUser && <Badge>You</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-chart-2" />
                        <span className="text-2xl font-bold text-gamification-xp">{user.xp}</span>
                        <span className="text-sm text-muted-foreground">XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Monthly leaderboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allTime" className="mt-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">All-time leaderboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gamification-badge" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  achievement.unlocked ? "bg-gamification-badge/10 border-gamification-badge/30" : "opacity-50"
                }`}
                data-testid={`achievement-${achievement.id}`}
              >
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge className="bg-gamification-badge hover:bg-gamification-badge">Unlocked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
