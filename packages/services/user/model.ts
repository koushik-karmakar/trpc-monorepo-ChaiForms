import { z } from "zod";

export const getAuthenticationMethodOutputSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH"]),
  displayName: z.string().describe("the display name of the authentication method").optional(),
  displayText: z.string().describe("the display text of the authentication method").optional(),
  authUrl: z.string().describe("the auth url of the authentication method"),
});
export type GetAuthenticationMethodOutputSchema = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;

export const authenticationWithGoogleInputSchema = z.object({
  email: z.email().describe("the email of the user"),
  name: z.string().describe("the name of the user").optional(),
  avatarImageUrl: z.url().describe("the avatar image url of the user").optional(),
  googleId: z.string().describe("the google id of the user"),
});

export type AuthenticationWithGoogleInputSchemaType = z.infer<
  typeof authenticationWithGoogleInputSchema
>;

export const generateTokenInputSchema = z.object({
  userId: z.string().describe("the user id of the user"),
  email: z.email().describe("the email of the user"),
});
export type GenerateTokenInputSchemaType = z.infer<typeof generateTokenInputSchema>;
