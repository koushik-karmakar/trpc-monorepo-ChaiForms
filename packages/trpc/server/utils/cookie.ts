import { CookieOptions, type Request, type Response } from "express";

export function setCookie(res: Response, name: string, value: string, options: CookieOptions) {
  res.cookie(name, value, options);
}

export function getCookie(req: Request, name: string): string | undefined {
  return req.cookies?.[name];
}

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name);
}
