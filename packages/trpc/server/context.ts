import { CookieOptions, Request, Response } from "express";
import {
  setCookie as setCookieUtil,
  clearCookie as clearCookieUtil,
  getCookie as getCookieUtil,
} from "./utils/cookie";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
export interface TRPCCtxuser {
  id: string;
}
export interface TRPCContext {
  setCookie: (name: string, value: string, options: CookieOptions) => void;
  getCookie: (name: string) => string | undefined;
  clearCookie: (name: string) => void;
  user?: TRPCCtxuser;
}
export async function createContext({ req, res }: CreateExpressContextOptions) {
  const ctx: TRPCContext = {
    setCookie(name: string, value: string, options: CookieOptions) {
      setCookieUtil(res, name, value, options);
    },
    getCookie(name: string) {
      return getCookieUtil(req, name);
    },
    clearCookie(name: string) {
      clearCookieUtil(res, name);
    },
    user: undefined,
  };
  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
