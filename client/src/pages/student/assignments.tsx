import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const assignments = [
  {
    id: "1",
    title: "Algebra: Quadratic Equations",
    subject: "Mathematics",
    dueDate: "2025-10-12",
    status: "pending",
    points: 100,
    description: "Solve the given quadratic equations and show your work.",
  },
  {
    id: "2",
    title: "Photosynthesis Essay",
    subject: "Science",
    dueDate: "2025-10-15",
    status: "pending",
    points: 50,
    description: "Write a 500-word essay on the process of photosynthesis.",
  },
  {
    id: "3",
    title: "Shakespeare Analysis",
    subject: "English",
    dueDate: "2025-10-05",
    status: "graded",
    points: 80,
    grade: 85,
    description: "Analyze the themes in Hamlet Act 3.",
  },
];

export default function Assignments() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Assignment Submitted",
      description: "Your assignment has been submitted successfully.",
    });
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return assignment.status === "pending";
    if (selectedTab === "graded") return assignment.status === "graded";
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and submit your assignments</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
          <TabsTrigger value="graded" data-testid="tab-graded">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid gap-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover-elevate" data-testid={`assignment-card-${assignment.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{assignment.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                    {assignment.status === "pending" ? (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Due {assignment.dueDate}
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-chart-2 hover:bg-chart-2">
                        <CheckCircle className="h-3 w-3" />
                        Graded: {assignment.grade}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                  {assignment.status === "pending" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-2" data-testid={`button-submit-${assignment.id}`}>
                          <Upload className="h-4 w-4" />
                          Submit Assignment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{assignment.title}</DialogTitle>
                          <DialogDescription>{assignment.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="submission">Your Answer</Label>
                            <Textarea
                              id="submission"
                              placeholder="Write your answer here..."
                              className="min-h-[200px]"
                              data-testid="textarea-submission"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="file">Attach Files (Optional)</Label>
                            <input
                              id="file"
                              type="file"
                              multiple
                              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                              data-testid="input-file-upload"
                            />
                          </div>
                          <Button onClick={handleSubmit} className="w-full" data-testid="button-confirm-submit">
                            Submit Assignment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button variant="outline" data-testid={`button-view-feedback-${assignment.id}`}>
                        View Feedback
                      </Button>
                      {assignment.grade && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Score:</span>
                          <span className="text-2xl font-bold text-chart-2">{assignment.grade}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
