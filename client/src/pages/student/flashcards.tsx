import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, RotateCw, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const flashcardSets = [
  {
    id: "1",
    subject: "Mathematics",
    title: "Algebra Formulas",
    count: 15,
    reviewed: 10,
    isAiGenerated: false,
  },
  {
    id: "2",
    subject: "Science",
    title: "Biology Terms",
    count: 25,
    reviewed: 18,
    isAiGenerated: true,
  },
  {
    id: "3",
    subject: "English",
    title: "Vocabulary",
    count: 30,
    reviewed: 22,
    isAiGenerated: false,
  },
];

const sampleFlashcard = {
  front: "What is the quadratic formula?",
  back: "x = (-b ± √(b² - 4ac)) / 2a",
};

export default function Flashcards() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const { toast } = useToast();

  const handleCreateFlashcard = () => {
    toast({
      title: "Flashcard Created",
      description: "Your flashcard has been added to the set.",
    });
  };

  const handleGenerateAI = () => {
    toast({
      title: "Generating Flashcards",
      description: "AI is creating flashcards from your lesson...",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground">Create and study flashcards with spaced repetition</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" data-testid="button-ai-generate">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Flashcards with AI</DialogTitle>
                <DialogDescription>Paste your lesson or notes, and AI will create flashcards for you</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson">Lesson Content</Label>
                  <Textarea
                    id="lesson"
                    placeholder="Paste your lesson notes here..."
                    className="min-h-[200px]"
                    data-testid="textarea-lesson-content"
                  />
                </div>
                <Button onClick={handleGenerateAI} className="w-full" data-testid="button-confirm-generate">
                  Generate Flashcards
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-flashcard">
                <Plus className="h-4 w-4" />
                Create Flashcard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Mathematics" data-testid="input-subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="front">Front (Question)</Label>
                  <Textarea id="front" placeholder="Enter question..." data-testid="textarea-front" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="back">Back (Answer)</Label>
                  <Textarea id="back" placeholder="Enter answer..." data-testid="textarea-back" />
                </div>
                <Button onClick={handleCreateFlashcard} className="w-full" data-testid="button-confirm-create">
                  Create Flashcard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {flashcardSets.map((set) => (
          <Card key={set.id} className="hover-elevate" data-testid={`flashcard-set-${set.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{set.title}</CardTitle>
                    {set.isAiGenerated && (
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{set.subject}</span>
                    <span>•</span>
                    <span>{set.count} cards</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Progress: </span>
                    <span className="font-medium">{set.reviewed}/{set.count}</span>
                  </div>
                  <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${(set.reviewed / set.count) * 100}%` }}
                    />
                  </div>
                </div>
                <Dialog open={isPracticing} onOpenChange={setIsPracticing}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid={`button-practice-${set.id}`}>
                      <BookOpen className="h-4 w-4" />
                      Practice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{set.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-8">
                      <div 
                        className="relative h-64 cursor-pointer perspective-1000"
                        onClick={() => setIsFlipped(!isFlipped)}
                        data-testid="flashcard-container"
                      >
                        <div className={`absolute inset-0 transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                          <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-8">
                            <p className="text-2xl text-center font-medium">{sampleFlashcard.front}</p>
                          </Card>
                          <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 bg-primary text-primary-foreground">
                            <p className="text-2xl text-center font-medium">{sampleFlashcard.back}</p>
                          </Card>
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-4">Click to flip</p>
                    </div>
                    <div className="flex justify-between gap-4">
                      <Button variant="outline" className="flex-1" data-testid="button-hard">
                        Hard
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-medium">
                        Medium
                      </Button>
                      <Button className="flex-1" data-testid="button-easy">
                        Easy
                      </Button>
                    </div>
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
