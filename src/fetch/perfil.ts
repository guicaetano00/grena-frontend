import { api } from "../api";
import type { UserProfile } from "../types";

export async function getPerfil(): Promise<UserProfile> {
  return api.get<UserProfile>("/api/perfil");
}

export async function atualizarPerfil(
  payload: Partial<UserProfile>
): Promise<UserProfile> {
  return api.put<UserProfile>("/api/perfil", payload);
}