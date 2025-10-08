import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "parent", "admin"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["draft", "published", "submitted", "graded"]);
export const quizDifficultyEnum = pgEnum("quiz_difficulty", ["easy", "medium", "hard"]);
export const questionTypeEnum = pgEnum("question_type", ["multiple_choice", "true_false", "short_answer"]);
export const notificationTypeEnum = pgEnum("notification_type", ["assignment", "quiz", "achievement", "reminder", "system"]);
export const languageEnum = pgEnum("language", ["en", "si", "ta"]);

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  avatarUrl: text("avatar_url"),
  grade: integer("grade"),
  parentId: varchar("parent_id").references((): any => users.id),
  preferredLanguage: languageEnum("preferred_language").default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Progress & Gamification
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  totalAssignmentsCompleted: integer("total_assignments_completed").default(0),
  totalQuizzesCompleted: integer("total_quizzes_completed").default(0),
  averageScore: integer("average_score").default(0),
});

// Achievements/Badges
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  xpRequired: integer("xp_required"),
  condition: text("condition").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// AI Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  language: languageEnum("language").default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  grade: integer("grade").notNull(),
  dueDate: timestamp("due_date").notNull(),
  maxPoints: integer("max_points").default(100).notNull(),
  status: assignmentStatusEnum("status").default("draft").notNull(),
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id).notNull(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  content: text("content"),
  attachments: jsonb("attachments").$type<string[]>(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  grade: integer("grade"),
  feedback: text("feedback"),
  aiHints: text("ai_hints"),
  gradedAt: timestamp("graded_at"),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teacherId: varchar("teacher_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  grade: integer("grade").notNull(),
  difficulty: quizDifficultyEnum("difficulty").default("medium").notNull(),
  timeLimit: integer("time_limit"), // in minutes
  isAdaptive: boolean("is_adaptive").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>(), // for multiple choice
  correctAnswer: text("correct_answer").notNull(),
  points: integer("points").default(1).notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  answers: jsonb("answers").$type<Record<string, string>>(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at").notNull(),
});

// Flashcards
export const flashcards = pgTable("flashcards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  subject: text("subject").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const flashcardProgress = pgTable("flashcard_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flashcardId: varchar("flashcard_id").references(() => flashcards.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  easeFactor: integer("ease_factor").default(250), // spaced repetition
  interval: integer("interval").default(0), // days
  repetitions: integer("repetitions").default(0),
  nextReviewDate: timestamp("next_review_date").defaultNow().notNull(),
  lastReviewed: timestamp("last_reviewed"),
});

// Learning Paths
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  currentTopic: text("current_topic").notNull(),
  completedTopics: jsonb("completed_topics").$type<string[]>(),
  recommendedResources: jsonb("recommended_resources").$type<Array<{ title: string; url: string; type: string }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feedback & Ratings
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  targetType: text("target_type").notNull(), // 'assignment', 'quiz', 'teacher', 'system'
  targetId: varchar("target_id"),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  aiSuggestions: text("ai_suggestions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  relatedId: varchar("related_id"), // assignment/quiz/achievement ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions (PayHere)
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").notNull(), // 'free', 'premium', 'enterprise'
  status: text("status").notNull(), // 'active', 'cancelled', 'expired'
  payhereOrderId: text("payhere_order_id"),
  amount: integer("amount"),
  currency: text("currency").default("LKR"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, createdAt: true });
export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({ id: true, submittedAt: true, gradedAt: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({ id: true, startedAt: true, completedAt: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true, createdAt: true });
export const insertFeedbackSchema = createInsertSchema(feedback).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
export type FlashcardProgress = typeof flashcardProgress.$inferSelect;
export type LearningPath = typeof learningPaths.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
