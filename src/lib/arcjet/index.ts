import arcjet, {
  detectBot,
  shield,
  tokenBucket,
  validateEmail,
} from "@arcjet/next";

const ARCJET_KEY = process.env.ARCJET_KEY;

const mode = (process.env.ARCJET_MODE ?? "LIVE") as "LIVE" | "DRY_RUN";

if (!ARCJET_KEY) {
  console.warn(
    "[arcjet] ARCJET_KEY is not defined. Protection rules will be disabled."
  );
}

export const requestProtector = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      rules: [
        shield({ mode }),
        detectBot({
          mode,
          allow: [
            "CATEGORY:SEARCH_ENGINE",
            "CATEGORY:MONITOR",
            "CATEGORY:PREVIEW",
          ],
        }),
        tokenBucket({
          mode,
          refillRate: 10,
          interval: 10,
          capacity: 30,
        }),
      ],
    })
  : null;

export const emailValidator = ARCJET_KEY
  ? arcjet({
      key: ARCJET_KEY,
      rules: [
        validateEmail({
          mode,
          block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
      ],
    })
  : null;

export type ArcjetDecision = Awaited<
  ReturnType<NonNullable<typeof requestProtector>["protect"]>
>;

export function buildArcjetDenyResponse(
  decision: ArcjetDecision,
  fallbackStatus = 403
) {
  if (!decision.isDenied()) {
    return null;
  }

  const status = decision.reason.isRateLimit() ? 429 : fallbackStatus;

  const reason = decision.reason.type ?? "unknown";

  return {
    status,
    body: {
      error:
        decision.reason.isRateLimit() || decision.reason.isBot()
          ? decision.reason.type
          : "Forbidden",
      reason,
    },
  };
}

export async function ensureEmailIsValid(
  req: Request,
  email: string | undefined | null
) {
  if (!emailValidator || !email) {
    return;
  }

  const decision = await emailValidator.protect(req, { email });

  if (decision.isDenied()) {
    const message = decision.reason.type ?? "email_invalid";
    const error = new Error(message);
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
}
