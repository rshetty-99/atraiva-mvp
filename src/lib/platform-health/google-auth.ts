import { google } from "googleapis";

import { platformHealthConfig } from "./config";

const authClients = new Map<string, Promise<google.auth.JWT>>();

const scopeKey = (scopes: string[]) => scopes.slice().sort().join("|");

export const getGoogleAuthClient = async (scopes: string[]) => {
  const key = scopeKey(scopes);
  const existing = authClients.get(key);
  if (existing) {
    return existing;
  }

  const {
    gcp: { clientEmail, privateKey },
  } = platformHealthConfig;

  if (!clientEmail || !privateKey) {
    throw new Error("GCP credentials are not configured for platform health");
  }

  const authPromise = (async () => {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes,
    });
    await auth.authorize();
    return auth;
  })();

  authClients.set(key, authPromise);
  return authPromise;
};
