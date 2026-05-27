import z from "zod";
export const authenticationWithGoogleInputSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  avatarImageUrl: z.url().optional(),
  googleId: z.string(),
});

export type AuthenticationWithGoogleInputSchemaType = z.infer<
  typeof authenticationWithGoogleInputSchema
>;
export const authenticationWithGoogleOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    avatarImageUrl: z.string().nullable(),
    googleId: z.string(),
  }),
});

export type AuthenticationWithGoogleOutputSchemaType = z.infer<
  typeof authenticationWithGoogleOutputSchema
>;
export const googleCallbackInputSchema = z.object({
  code: z.string().min(1),
});

export const googleCallbackOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    avatarImageUrl: z.string().nullable(),
  }),
});

export const getAuthenticationMethodOutputSchema = z.array(
  z.object({
    provider: z.enum(["GOOGLE_OAUTH"]),
    displayName: z.string().optional(),
    displayText: z.string().optional(),
    authUrl: z.string().url(),
  }),
);

export type GetAuthenticationMethodOutputSchemaType = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;
