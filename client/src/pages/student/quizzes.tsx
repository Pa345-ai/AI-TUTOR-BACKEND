import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Trophy, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const quizzes = [
  {
    id: "1",
    title: "Algebra Basics",
    subject: "Mathematics",
    difficulty: "easy",
    questions: 10,
    timeLimit: 15,
    attempts: 0,
  },
  {
    id: "2",
    title: "Cell Biology",
    subject: "Science",
    difficulty: "medium",
    questions: 15,
    timeLimit: 20,
    attempts: 1,
    bestScore: 85,
  },
  {
    id: "3",
    title: "Shakespeare Literature",
    subject: "English",
    difficulty: "hard",
    questions: 20,
    timeLimit: 30,
    attempts: 2,
    bestScore: 90,
  },
];

const sampleQuestions = [
  {
    id: "1",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    id: "2",
    question: "Which planet is closest to the sun?",
    options: ["Venus", "Mars", "Mercury", "Earth"],
    correctAnswer: "Mercury",
  },
];

export default function Quizzes() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleSubmitQuiz = () => {
    toast({
      title: "Quiz Submitted",
      description: "Your quiz has been submitted for grading.",
    });
    setQuizStarted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-chart-2 hover:bg-chart-2";
      case "medium": return "bg-chart-4 hover:bg-chart-4";
      case "hard": return "bg-destructive hover:bg-destructive";
      default: return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge and track your progress</p>
      </div>

      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover-elevate" data-testid={`quiz-card-${quiz.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{quiz.subject}</span>
                    <span>•</span>
                    <span>{quiz.questions} questions</span>
                    <span>•</span>
                    <span>{quiz.timeLimit} min</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {quiz.bestScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-gamification-badge" />
                      <div>
                        <p className="text-xs text-muted-foreground">Best Score</p>
                        <p className="text-xl font-bold text-chart-2">{quiz.bestScore}%</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                      <p className="text-xl font-bold">{quiz.attempts}</p>
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2" onClick={handleStartQuiz} data-testid={`button-start-quiz-${quiz.id}`}>
                      <Brain className="h-4 w-4" />
                      {quiz.attempts > 0 ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{quiz.title}</DialogTitle>
                    </DialogHeader>
                    {quizStarted ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Question {currentQuestion + 1} of {sampleQuestions.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">14:32</span>
                          </div>
                        </div>
                        <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{sampleQuestions[currentQuestion].question}</h3>
                          <RadioGroup 
                            value={answers[sampleQuestions[currentQuestion].id]} 
                            onValueChange={(value) => setAnswers({ ...answers, [sampleQuestions[currentQuestion].id]: value })}
                          >
                            {sampleQuestions[currentQuestion].options.map((option, index) => (
                              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover-elevate">
                                <RadioGroupItem value={option} id={`option-${index}`} data-testid={`radio-option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            data-testid="button-previous-question"
                          >
                            Previous
                          </Button>
                          {currentQuestion < sampleQuestions.length - 1 ? (
                            <Button
                              onClick={() => setCurrentQuestion(currentQuestion + 1)}
                              data-testid="button-next-question"
                            >
                              Next
                            </Button>
                          ) : (
                            <Button onClick={handleSubmitQuiz} data-testid="button-submit-quiz">
                              Submit Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Click the button below to start the quiz</p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
