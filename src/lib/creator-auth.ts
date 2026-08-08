"use server";

import { cookies } from "next/headers";
import { sign, verify } from "./jwt";

const CREATOR_JWT = process.env.CREATOR_JWT_SECRET || "kyno-creator-jwt-secret";
const COOKIE_NAME = "kyno_creator_session";

export interface CreatorSession {
  id: string;
  username: string;
  name: string;
  email: string;
  commission: number;
}

export async function setCreatorSession(creator: CreatorSession) {
  const token = await sign(creator, CREATOR_JWT);
  const cs = await cookies();
  cs.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 12 * 3600,
    path: "/",
  });
}

export async function clearCreatorSession() {
  const cs = await cookies();
  cs.delete(COOKIE_NAME);
}

export async function getCreatorSession(): Promise<CreatorSession | null> {
  const cs = await cookies();
  const token = cs.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verify(token, CREATOR_JWT);
  if (!payload) return null;
  return payload as unknown as CreatorSession;
}
