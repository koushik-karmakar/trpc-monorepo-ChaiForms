import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { env } from "../env";
import JWT from "jsonwebtoken";
import { generateGoogleAuthUrl, googleOAuth2Client } from "../clients/google-oauth.service";
import {
  GetAuthenticationMethodOutputSchema,
  authenticationWithGoogleInputSchema,
  AuthenticationWithGoogleInputSchemaType,
  generateTokenInputSchema,
  GenerateTokenInputSchemaType,
} from "./model";

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = generateGoogleAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Continue with Google to ChaiForms",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }

  async #generateToken(payload: GenerateTokenInputSchemaType) {
    const { userId, email } = payload;
    const token = JWT.sign(
      {
        userId,
        email,
      },
      env.JWT_TOKEN_SECRET,
      {
        expiresIn: "10d",
      },
    );
    if (!token) {
      throw new Error("Failed to generate token");
    }
    return { token };
  }

  public async authenticateWithGoogle(payload: AuthenticationWithGoogleInputSchemaType) {
    const { email, googleId, name, avatarImageUrl } = payload;
    if (!email || !googleId || !name) {
      throw new Error("Invalid Credentials");
    }
    const userExists = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (userExists.length === 0) {
      // insert user
      const result = await db
        .insert(usersTable)
        .values({
          email,
          googleId,
          name,
          avatarImageUrl: avatarImageUrl ?? null,
        })
        .returning();
      //  now create token to give user for cookie
      const { token } = await this.#generateToken({ email, userId: result[0]!.id });
      return {
        user: result[0],
        token,
      };
    } else {
      // user already exists just generate token
      const { token } = await this.#generateToken({
        email,
        userId: userExists[0]!.id,
      });
      return {
        user: userExists[0],
        token,
      };
    }
  }

  public async getUserInfoByID(id: string) {
    
  }
  public async verifyAndDecodeUser(token: string) {
    try {
      const result = JWT.verify(token, env.JWT_TOKEN_SECRET) as GenerateTokenInputSchemaType;
      if (!result) throw new Error("Fail to parse token");
      return result;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default UserService;
