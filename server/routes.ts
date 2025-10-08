import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema, insertAssignmentSchema, insertQuizSchema, insertFlashcardSchema, insertFeedbackSchema } from "@shared/schema";
import OpenAI from "openai";
import bcrypt from "bcryptjs";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ Authentication Routes ============
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    // TODO: Implement session-based auth
    res.json({ user: null });
  });

  // ============ AI Chat Routes ============
  app.get("/api/chat/history", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });
      
      const messages = await storage.getUserChatHistory(userId);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { userId, content, language = "en" } = req.body;
      
      // Save user message
      await storage.createChatMessage({
        userId,
        role: "user",
        content,
        language,
      });
      
      // Get chat history for context
      const history = await storage.getUserChatHistory(userId);
      const messages = history.slice(-10).map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));
      
      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an AI tutor helping students from grades 1-13 with all subjects. Provide clear, step-by-step explanations. Support code snippets and math formulas. Answer in ${language === "si" ? "Sinhala" : language === "ta" ? "Tamil" : "English"}.`,
          },
          ...messages,
        ],
        max_completion_tokens: 8192,
      });
      
      const aiResponse = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        userId,
        role: "assistant",
        content: aiResponse,
        language,
      });
      
      res.json({ message: aiMessage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Assignment Routes ============
  app.get("/api/assignments", async (req, res) => {
    try {
      const { teacherId, studentId } = req.query;
      const assignments = await storage.getAssignments({
        teacherId: teacherId as string,
        studentId: studentId as string,
      });
      res.json({ assignments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const assignmentData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(assignmentData);
      res.json({ assignment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/assignments/:id/submit", async (req, res) => {
    try {
      const { studentId, content, attachments } = req.body;
      const submission = await storage.submitAssignment({
        assignmentId: req.params.id,
        studentId,
        content,
        attachments,
      });
      res.json({ submission });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/assignments/submissions/:id/grade", async (req, res) => {
    try {
      const { grade, feedback } = req.body;
      const submission = await storage.gradeSubmission(req.params.id, grade, feedback);
      res.json({ submission });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============ Quiz Routes ============
  app.get("/api/quizzes", async (req, res) => {
    try {
      const { teacherId, grade } = req.query;
      const quizzes = await storage.getQuizzes({
        teacherId: teacherId as string,
        grade: grade ? parseInt(grade as string) : undefined,
      });
      res.json({ quizzes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.json({ quiz });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/quizzes/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions(req.params.id);
      res.json({ questions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/quizzes/:id/submit", async (req, res) => {
    try {
      const { studentId, answers, score, maxScore } = req.body;
      const attempt = await storage.submitQuizAttempt({
        quizId: req.params.id,
        studentId,
        score,
        maxScore,
        answers,
      });
      res.json({ attempt });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/quizzes/generate", async (req, res) => {
    try {
      const { topic, difficulty, count = 5, language = "en" } = req.body;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert quiz generator. Generate ${count} ${difficulty} difficulty questions about ${topic}. Return JSON with array of questions, each with: question, options (array of 4), correctAnswer. Answer in ${language === "si" ? "Sinhala" : language === "ta" ? "Tamil" : "English"}.`,
          },
          {
            role: "user",
            content: `Generate ${count} ${difficulty} quiz questions about ${topic}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });
      
      const questions = JSON.parse(completion.choices[0].message.content || "{}");
      res.json({ questions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Flashcard Routes ============
  app.get("/api/flashcards", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ error: "userId required" });
      
      const flashcards = await storage.getUserFlashcards(userId);
      res.json({ flashcards });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/flashcards", async (req, res) => {
    try {
      const flashcardData = insertFlashcardSchema.parse(req.body);
      const flashcard = await storage.createFlashcard(flashcardData);
      res.json({ flashcard });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/flashcards/generate", async (req, res) => {
    try {
      const { userId, content, subject, language = "en" } = req.body;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are a flashcard generator. Create flashcards from the given content. Return JSON with array of flashcards, each with: front (question), back (answer). Answer in ${language === "si" ? "Sinhala" : language === "ta" ? "Tamil" : "English"}.`,
          },
          {
            role: "user",
            content: `Generate flashcards from: ${content}`,
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });
      
      const result = JSON.parse(completion.choices[0].message.content || "{}");
      const flashcards = [];
      
      for (const card of result.flashcards || []) {
        const flashcard = await storage.createFlashcard({
          userId,
          front: card.front,
          back: card.back,
          subject,
          isAiGenerated: true,
        });
        flashcards.push(flashcard);
      }
      
      res.json({ flashcards });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Gamification Routes ============
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json({ progress });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json({ achievements });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json({ achievements });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Learning Path Routes ============
  app.get("/api/learning-paths/:userId", async (req, res) => {
    try {
      const paths = await storage.getUserLearningPaths(req.params.userId);
      res.json({ paths });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Feedback Routes ============
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.json({ feedback });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============ Notification Routes ============
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.params.userId);
      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ WebSocket for Real-time Chat ============
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Save user message
          await storage.createChatMessage({
            userId: message.userId,
            role: "user",
            content: message.content,
            language: message.language || "en",
          });
          
          // Get history and call AI
          const history = await storage.getUserChatHistory(message.userId);
          const messages = history.slice(-10).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));
          
          const completion = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: `You are an AI tutor. Provide clear explanations for ${message.language === "si" ? "Sinhala" : message.language === "ta" ? "Tamil" : "English"}.`,
              },
              ...messages,
            ],
            max_completion_tokens: 8192,
          });
          
          const aiResponse = completion.choices[0].message.content || "No response";
          
          // Save AI response
          const aiMessage = await storage.createChatMessage({
            userId: message.userId,
            role: "assistant",
            content: aiResponse,
            language: message.language || "en",
          });
          
          // Send back to client
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'chat',
              message: aiMessage,
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', error: 'Failed to process message' }));
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
