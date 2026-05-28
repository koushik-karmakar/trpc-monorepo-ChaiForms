import z from "zod";
export const authenticationWithGoogleInputSchema = z.object({
  email: z.email().describe("The email of the user"),
  name: z.string().optional().describe("The name of the user"),
  avatarImageUrl: z.url().optional().describe("The avatar image URL of the user"),
  googleId: z.string().describe("The Google ID of the user"),
});

export type AuthenticationWithGoogleInputSchemaType = z.infer<
  typeof authenticationWithGoogleInputSchema
>;
export const authenticationWithGoogleOutputSchema = z.object({
  user: z.object({
    id: z.string().describe("The ID of the user"),
    email: z.string().describe("The email of the user"),
    name: z.string().nullable().describe("The name of the user"),
    avatarImageUrl: z.string().nullable().describe("The avatar image URL of the user"),
    googleId: z.string().describe("The Google ID of the user"),
  }),
});

export type AuthenticationWithGoogleOutputSchemaType = z.infer<
  typeof authenticationWithGoogleOutputSchema
>;
export const googleCallbackInputSchema = z.object({
  code: z.string().min(1).describe("The code of the user"),
});

export const googleCallbackOutputSchema = z.object({
  user: z.object({
    id: z.string().describe("The ID of the user"),
    email: z.string().describe("The email of the user"),
    name: z.string().describe("The name of the user"),
    avatarImageUrl: z.string().nullable().describe("The avatar image URL of the user"),
  }),
});

export const getAuthenticationMethodOutputSchema = z.array(
  z.object({
    provider: z.enum(["GOOGLE_OAUTH"]),
    displayName: z.string().optional().describe("The display name of the authentication method"),
    displayText: z.string().optional().describe("The display text of the authentication method"),
    authUrl: z.string().url().describe("The auth URL of the authentication method"),
  }),
);

export type GetAuthenticationMethodOutputSchemaType = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;

export const getLoggedInUserInfoInputSchema = z.undefined();
export const getLoggedInUserInfoOutputSchema = z.object({
  id: z.string().describe("The ID of the user"),
  email: z.string().describe("The email of the user"),
  name: z.string().describe("The name of the user"),
  avatarImageUrl: z.string().nullable().describe("The avatar image URL of the user"),
});
