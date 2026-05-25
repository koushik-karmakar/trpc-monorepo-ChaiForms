import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  uniqueIndex,
  jsonb,
  integer,
  index,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ======================================================================
// USER TABLE
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    googleId: varchar("google_id", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    avatarImageUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("users_google_id_idx").on(table.googleId),
    uniqueIndex("users_email_idx").on(table.email),
  ],
);

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

// ======================================================================
// SESSEION TABLE
export const sessionsTable = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 512 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_idx").on(table.token),
    index("sessions_user_id_idx").on(table.userId),
  ],
);

export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
//  ======================================================================
// THEME TABLE
export const themeCategoryEnum = pgEnum("theme_category", [
  "anime",
  "gaming",
  "os",
  "minimal",
  "startup",
  "movie",
  "community",
]);

export const themesTable = pgTable(
  "themes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    category: themeCategoryEnum("category").notNull().default("anime"),
    colors: jsonb("colors").notNull(),
    typography: jsonb("typography"),
    background: jsonb("background"),
    isSystem: boolean("is_system").notNull().default(true),
    createdBy: uuid("created_by").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("themes_slug_idx").on(table.slug)],
);
export type SelectTheme = typeof themesTable.$inferSelect;
export type InsertTheme = typeof themesTable.$inferInsert;

//  ==================================================================
// FORM TABLE
export const formStatusEnum = pgEnum("form_status", ["draft", "published", "archived"]);
export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"]);

export const formsTable = pgTable(
  "forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    status: formStatusEnum("status")!.notNull().default("draft"),
    visibility: formVisibilityEnum("visibility")!.notNull().default("unlisted"),
    themeId: uuid("theme_id").references(() => themesTable.id, {
      onDelete: "set null",
    }),
    settings: jsonb("settings").notNull().default({}),
    responseCount: integer("response_count").notNull().default(0),
    responseLimit: integer("response_limit"),
    expiresAt: timestamp("expires_at"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("forms_slug_idx").on(table.slug),
    index("forms_user_id_idx").on(table.userId),
    index("forms_status_visibility_idx").on(table.status, table.visibility),
  ],
);
export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;

//  ==================================================================
// FORM FIELDS TABLE
export const fieldTypeEnum = pgEnum("field_type", [
  "short_text",
  "long_text",
  "email",
  "number",
  "single_select",
  "multi_select",
  "checkbox",
  "rating",
  "date",
]);
export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),
    type: fieldTypeEnum("type").notNull(),
    label: varchar("label", { length: 500 }).notNull(),
    placeholder: varchar("placeholder", { length: 500 }),
    description: text("description"),
    options: jsonb("options"),
    validation: jsonb("validation"),
    required: boolean("required").notNull().default(false),
    orderIndex: integer("order_index").notNull(),
    conditionalLogic: jsonb("conditional_logic"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("form_fields_form_id_idx").on(table.formId),
    index("form_fields_form_id_order_idx").on(table.formId, table.orderIndex),
  ],
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;

//  ==================================================================
// FORM RESPONSES TABLE
export const responseStatusEnum = pgEnum("response_status", ["complete", "partial"]);

export const formResponsesTable = pgTable(
  "form_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),
    respondentEmail: varchar("respondent_email", { length: 255 }),
    respondentIp: varchar("respondent_ip", { length: 45 }),
    userAgent: text("user_agent"),
    status: responseStatusEnum("status").notNull().default("complete"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("form_responses_form_id_idx").on(table.formId),
    index("form_responses_submitted_at_idx").on(table.submittedAt),
    index("form_responses_form_id_submitted_at_idx").on(table.formId, table.submittedAt),
  ],
);

export type SelectFormResponse = typeof formResponsesTable.$inferSelect;
export type InsertFormResponse = typeof formResponsesTable.$inferInsert;

//  ==================================================================
// FORM RESPONSES ANSWERS TABLE
export const responseAnswersTable = pgTable(
  "response_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    responseId: uuid("response_id")
      .notNull()
      .references(() => formResponsesTable.id, { onDelete: "cascade" }),
    fieldId: uuid("field_id")
      .notNull()
      .references(() => formFieldsTable.id, { onDelete: "cascade" }),
    value: jsonb("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("response_answers_response_id_idx").on(table.responseId),
    index("response_answers_field_id_idx").on(table.fieldId),
  ],
);

export type SelectResponseAnswer = typeof responseAnswersTable.$inferSelect;
export type InsertResponseAnswer = typeof responseAnswersTable.$inferInsert;

//  ==================================================================
// FORM ANALYTICS TABLE
export const formAnalyticsTable = pgTable(
  "form_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    views: integer("views").notNull().default(0),
    starts: integer("starts").notNull().default(0),
    completions: integer("completions").notNull().default(0),
    deviceBreakdown: jsonb("device_breakdown").notNull().default({}),
    countryBreakdown: jsonb("country_breakdown").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // one row per form per day — enforced at DB level
    uniqueIndex("form_analytics_form_id_date_idx").on(table.formId, table.date),
    index("form_analytics_form_id_idx").on(table.formId),
    index("form_analytics_date_idx").on(table.date),
  ],
);

export type SelectFormAnalytics = typeof formAnalyticsTable.$inferSelect;
export type InsertFormAnalytics = typeof formAnalyticsTable.$inferInsert;

//  ==================================================================
// RATE LIMITS TABLE
export const rateLimitActionEnum = pgEnum("rate_limit_action", ["form_submit", "form_view"]);

export const rateLimitsTable = pgTable(
  "rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    action: rateLimitActionEnum("action").notNull(),
    count: integer("count").notNull().default(1),
    windowStart: timestamp("window_start").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [
    index("rate_limits_identifier_action_idx").on(table.identifier, table.action),
    index("rate_limits_expires_at_idx").on(table.expiresAt),
  ],
);

export type SelectRateLimit = typeof rateLimitsTable.$inferSelect;
export type InsertRateLimit = typeof rateLimitsTable.$inferInsert;

//==========================================================
// RELATIONS
export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  forms: many(formsTable),
  createdThemes: many(themesTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const themesRelations = relations(themesTable, ({ one, many }) => ({
  createdBy: one(usersTable, {
    fields: [themesTable.createdBy],
    references: [usersTable.id],
  }),
  forms: many(formsTable),
}));

export const formsRelations = relations(formsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [formsTable.userId],
    references: [usersTable.id],
  }),
  theme: one(themesTable, {
    fields: [formsTable.themeId],
    references: [themesTable.id],
  }),
  fields: many(formFieldsTable),
  responses: many(formResponsesTable),
  analytics: many(formAnalyticsTable),
}));

export const formFieldsRelations = relations(formFieldsTable, ({ one, many }) => ({
  form: one(formsTable, {
    fields: [formFieldsTable.formId],
    references: [formsTable.id],
  }),
  answers: many(responseAnswersTable),
}));

export const formResponsesRelations = relations(formResponsesTable, ({ one, many }) => ({
  form: one(formsTable, {
    fields: [formResponsesTable.formId],
    references: [formsTable.id],
  }),
  answers: many(responseAnswersTable),
}));

export const responseAnswersRelations = relations(responseAnswersTable, ({ one }) => ({
  response: one(formResponsesTable, {
    fields: [responseAnswersTable.responseId],
    references: [formResponsesTable.id],
  }),
  field: one(formFieldsTable, {
    fields: [responseAnswersTable.fieldId],
    references: [formFieldsTable.id],
  }),
}));

export const formAnalyticsRelations = relations(formAnalyticsTable, ({ one }) => ({
  form: one(formsTable, {
    fields: [formAnalyticsTable.formId],
    references: [formsTable.id],
  }),
}));
