import { db } from "./db";
import { 
  users, insertUserSchema, 
  chatMessages, insertChatMessageSchema,
  assignments, insertAssignmentSchema,
  assignmentSubmissions, insertAssignmentSubmissionSchema,
  quizzes, insertQuizSchema,
  quizQuestions, insertQuizQuestionSchema,
  quizAttempts, insertQuizAttemptSchema,
  flashcards, insertFlashcardSchema,
  flashcardProgress,
  learningPaths,
  userProgress,
  achievements,
  userAchievements,
  feedback, insertFeedbackSchema,
  notifications, insertNotificationSchema,
  subscriptions,
  type User, type ChatMessage, type Assignment, type AssignmentSubmission,
  type Quiz, type QuizQuestion, type QuizAttempt, type Flashcard,
  type FlashcardProgress, type LearningPath, type UserProgress,
  type Achievement, type Feedback, type Notification, type Subscription,
  type InsertUser
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat operations
  getUserChatHistory(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: typeof insertChatMessageSchema._type): Promise<ChatMessage>;
  
  // Assignment operations
  getAssignments(filters?: { teacherId?: string; studentId?: string }): Promise<Assignment[]>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  createAssignment(assignment: typeof insertAssignmentSchema._type): Promise<Assignment>;
  submitAssignment(submission: typeof insertAssignmentSubmissionSchema._type): Promise<AssignmentSubmission>;
  gradeSubmission(submissionId: string, grade: number, feedback: string): Promise<AssignmentSubmission | undefined>;
  
  // Quiz operations
  getQuizzes(filters?: { teacherId?: string; grade?: number }): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  createQuiz(quiz: typeof insertQuizSchema._type): Promise<Quiz>;
  getQuizQuestions(quizId: string): Promise<QuizQuestion[]>;
  submitQuizAttempt(attempt: typeof insertQuizAttemptSchema._type): Promise<QuizAttempt>;
  
  // Flashcard operations
  getUserFlashcards(userId: string): Promise<Flashcard[]>;
  createFlashcard(flashcard: typeof insertFlashcardSchema._type): Promise<Flashcard>;
  getFlashcardProgress(userId: string, flashcardId: string): Promise<FlashcardProgress | undefined>;
  updateFlashcardProgress(userId: string, flashcardId: string, progress: Partial<FlashcardProgress>): Promise<void>;
  
  // Gamification operations
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  getLeaderboard(limit?: number): Promise<Array<UserProgress & { user: User }>>;
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  
  // Learning path operations
  getUserLearningPaths(userId: string): Promise<LearningPath[]>;
  
  // Feedback operations
  createFeedback(feedback: typeof insertFeedbackSchema._type): Promise<Feedback>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: typeof insertNotificationSchema._type): Promise<Notification>;
  markNotificationAsRead(notificationId: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    const newUser = result[0];
    
    // Create initial user progress
    await db.insert(userProgress).values({
      id: randomUUID(),
      userId: newUser.id,
      xp: 0,
      level: 1,
      streak: 0,
      totalAssignmentsCompleted: 0,
      totalQuizzesCompleted: 0,
      averageScore: 0,
    });
    
    return newUser;
  }

  async getUserChatHistory(userId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: typeof insertChatMessageSchema._type): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  async getAssignments(filters?: { teacherId?: string; studentId?: string }): Promise<Assignment[]> {
    let query = db.select().from(assignments);
    
    if (filters?.teacherId) {
      return db.select().from(assignments).where(eq(assignments.teacherId, filters.teacherId));
    }
    
    return db.select().from(assignments);
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const result = await db.select().from(assignments).where(eq(assignments.id, id));
    return result[0];
  }

  async createAssignment(assignment: typeof insertAssignmentSchema._type): Promise<Assignment> {
    const result = await db.insert(assignments).values([assignment as any]).returning();
    return result[0];
  }

  async submitAssignment(submission: typeof insertAssignmentSubmissionSchema._type): Promise<AssignmentSubmission> {
    const result = await db.insert(assignmentSubmissions).values([submission as any]).returning();
    return result[0];
  }

  async gradeSubmission(submissionId: string, grade: number, feedbackText: string): Promise<AssignmentSubmission | undefined> {
    const result = await db.update(assignmentSubmissions)
      .set({ grade, feedback: feedbackText, gradedAt: new Date() })
      .where(eq(assignmentSubmissions.id, submissionId))
      .returning();
    return result[0];
  }

  async getQuizzes(filters?: { teacherId?: string; grade?: number }): Promise<Quiz[]> {
    if (filters?.teacherId) {
      return db.select().from(quizzes).where(eq(quizzes.teacherId, filters.teacherId));
    }
    return db.select().from(quizzes);
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const result = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return result[0];
  }

  async createQuiz(quiz: typeof insertQuizSchema._type): Promise<Quiz> {
    const result = await db.insert(quizzes).values(quiz).returning();
    return result[0];
  }

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(quizQuestions.order);
  }

  async submitQuizAttempt(attempt: typeof insertQuizAttemptSchema._type): Promise<QuizAttempt> {
    const result = await db.insert(quizAttempts).values({
      ...attempt,
      completedAt: new Date(),
    }).returning();
    
    // Update user progress
    const progress = await this.getUserProgress(attempt.studentId);
    if (progress) {
      await this.updateUserProgress(attempt.studentId, {
        totalQuizzesCompleted: (progress.totalQuizzesCompleted || 0) + 1,
        xp: (progress.xp || 0) + Math.floor(attempt.score / 10),
      });
    }
    
    return result[0];
  }

  async getUserFlashcards(userId: string): Promise<Flashcard[]> {
    return db.select().from(flashcards).where(eq(flashcards.userId, userId));
  }

  async createFlashcard(flashcard: typeof insertFlashcardSchema._type): Promise<Flashcard> {
    const result = await db.insert(flashcards).values([flashcard as any]).returning();
    return result[0];
  }

  async getFlashcardProgress(userId: string, flashcardId: string): Promise<FlashcardProgress | undefined> {
    const result = await db.select().from(flashcardProgress)
      .where(and(
        eq(flashcardProgress.userId, userId),
        eq(flashcardProgress.flashcardId, flashcardId)
      ));
    return result[0];
  }

  async updateFlashcardProgress(userId: string, flashcardId: string, progress: Partial<FlashcardProgress>): Promise<void> {
    await db.update(flashcardProgress)
      .set(progress)
      .where(and(
        eq(flashcardProgress.userId, userId),
        eq(flashcardProgress.flashcardId, flashcardId)
      ));
  }

  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return result[0];
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const result = await db.update(userProgress)
      .set(updates)
      .where(eq(userProgress.userId, userId))
      .returning();
    return result[0];
  }

  async getLeaderboard(limit: number = 10): Promise<Array<UserProgress & { user: User }>> {
    const results = await db.select()
      .from(userProgress)
      .innerJoin(users, eq(userProgress.userId, users.id))
      .orderBy(desc(userProgress.xp))
      .limit(limit);
    
    return results.map(r => ({
      ...r.user_progress,
      user: r.users,
    })) as any;
  }

  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const results = await db.select({
      achievement: achievements,
    })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    
    return results.map(r => r.achievement);
  }

  async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    return db.select().from(learningPaths).where(eq(learningPaths.userId, userId));
  }

  async createFeedback(feedbackData: typeof insertFeedbackSchema._type): Promise<Feedback> {
    const result = await db.insert(feedback).values(feedbackData).returning();
    return result[0];
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: typeof insertNotificationSchema._type): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }
}

export const storage = new DbStorage();
