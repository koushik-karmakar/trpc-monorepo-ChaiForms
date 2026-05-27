import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";

import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  authenticationWithGoogleInputSchema,
  AuthenticationWithGoogleInputSchemaType,
  AuthenticationWithGoogleOutputSchemaType,
  authenticationWithGoogleOutputSchema,
  googleCallbackInputSchema,
  googleCallbackOutputSchema,
  getAuthenticationMethodOutputSchema,
} from "./model";
import { TRPCError } from "@trpc/server";
import { googleOAuth2Client } from "@repo/services/clients/google-oauth.service";
import { env } from "@repo/services/env";
const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  // procedure for google authentication
  authenticationWithGoogle: publicProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/google/callback"), tags: TAGS },
    })
    .input(googleCallbackInputSchema)
    .output(googleCallbackOutputSchema)
    .mutation(async ({ input, ctx }) => {
      let tokens;
      try {
        const response = await googleOAuth2Client.getToken(input.code);
        tokens = response.tokens;
      } catch (err) {
        console.error("Token exchange error:", err);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to exchange Google authorization code",
        });
      }

      googleOAuth2Client.setCredentials(tokens);
      let ticket;
      try {
        ticket = await googleOAuth2Client.verifyIdToken({
          idToken: tokens.id_token!,
          audience: env.GOOGLE_OAUTH_CLIENT_ID,
        });
      } catch (err) {
        console.error("verifyIdToken error:", err);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to verify Google ID token",
        });
      }

      const payload = ticket.getPayload();
      if (!payload) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Google token payload",
        });
      }

      if (!payload.email || !payload.sub || !payload.name) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incomplete profile data from Google",
        });
      }

      let result;
      try {
        result = await userService.authenticateWithGoogle({
          email: payload.email,
          googleId: payload.sub,
          name: payload.name,
          avatarImageUrl: payload.picture ?? undefined,
        });
      } catch (err) {
        console.error("userService.authenticateWithGoogle error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to authenticate user",
        });
      }

      if (!result.token || !result.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Authentication succeeded but returned incomplete data",
        });
      }

      ctx.setCookie("auth_token", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 10 * 24 * 60 * 60,
      });

      return { user: result.user };
    }),

  // procedure for authentication method
  getAuthenticationMethods: publicProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/methods"), tags: TAGS },
    })
    .input(z.void())
    .output(getAuthenticationMethodOutputSchema)
    .query(async () => {
      try {
        const methods = await userService.getAuthenticationMethods();
        return [...methods];
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch authentication methods",
        });
      }
    }),
});
