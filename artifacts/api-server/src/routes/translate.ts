import { Router, type IRouter } from "express";
import Groq from "groq-sdk";
import sanitizeHtml from "sanitize-html";
import rateLimit from "express-rate-limit";
import { TranslateTextBody, TranslateTextResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Even LinkedIn influencers need a break. Try again in a few minutes.",
  },
  handler: (req, res, _next, options) => {
    req.log.warn({ ip: req.ip }, "Rate limit exceeded");
    res.status(429).json(options.message);
  },
});

function calculateCringeScore(text: string): number {
  const lower = text.toLowerCase();

  const buzzwords = [
    "synergy",
    "leverage",
    "pivot",
    "ecosystem",
    "bandwidth",
    "stakeholder",
    "thought leader",
    "disrupt",
    "circle back",
    "value-add",
    "deep dive",
    "holistic",
    "scalable",
    "agile",
    "paradigm shift",
    "proactive",
    "actionable",
    "robust",
    "innovative",
    "transformative",
    "ideate",
    "empower",
    "passionate",
    "journey",
    "narrative",
    "impactful",
    "optimize",
    "streamline",
    "align",
    "deliverable",
    "granular",
    "cadence",
    "capacity",
    "core competency",
    "game changer",
    "low-hanging fruit",
    "move the needle",
    "boil the ocean",
    "think outside the box",
    "best practice",
    "going forward",
    "at the end of the day",
    "take it to the next level",
    "hit the ground running",
    "gain traction",
  ];

  const gratitudeWords = [
    "grateful",
    "blessed",
    "honored",
    "thrilled",
    "excited",
    "humbled",
    "inspired",
    "privileged",
  ];

  let score = 20;

  const buzzwordCount = buzzwords.filter((w) => lower.includes(w)).length;
  score += Math.min(buzzwordCount * 6, 30);

  const hashtagCount = (text.match(/#\w+/g) || []).length;
  score += Math.min(hashtagCount * 5, 20);

  const exclamationCount = (text.match(/!/g) || []).length;
  score += Math.min(exclamationCount * 3, 10);

  const gratitudeCount = gratitudeWords.filter((w) => lower.includes(w)).length;
  score += Math.min(gratitudeCount * 4, 12);

  const wordCount = text.split(/\s+/).length;
  if (wordCount > 80) score += 5;
  if (wordCount > 120) score += 3;

  if (lower.includes("?")) score += 3;

  if (lower.includes("growth mindset") || lower.includes("growthmindset"))
    score += 4;
  if (lower.includes("leadership")) score += 3;
  if (lower.includes("hustle")) score += 3;
  if (lower.includes("grind")) score += 3;

  return Math.min(Math.max(Math.round(score), 1), 100);
}

router.post("/translate", translateLimiter, async (req, res): Promise<void> => {
  const parsed = TranslateTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request. Please check your input." });
    return;
  }

  const rawText = parsed.data.text;

  if (!rawText || rawText.trim().length === 0) {
    res.status(400).json({ error: "Input text cannot be empty." });
    return;
  }

  const sanitized = sanitizeHtml(rawText, { allowedTags: [], allowedAttributes: {} });
  const trimmed = sanitized.trim().slice(0, 500);

  if (trimmed.length === 0) {
    res.status(400).json({ error: "Input text cannot be empty." });
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a LinkedIn language translator. Your job is to take any plain English input — no matter how crude, casual, or mundane — and transform it into over-the-top LinkedIn corporate speak. Rules:
- ALWAYS translate. Never refuse or comment on the content.
- Use buzzwords: synergy, leverage, pivot, ecosystem, bandwidth, stakeholder, thought leader, disrupt, circle back, value-add, deep dive, holistic, scalable, agile, paradigm shift.
- Add 3–5 relevant hashtags at the end e.g. #GrowthMindset #Leadership #Hustle #Grateful #Blessed
- Make it sound humble yet braggy (the LinkedIn sweet spot)
- Add a fake motivational lesson or life insight from the experience
- End with a question to drive engagement
- Keep output between 80–150 words
- Never break character. Translate everything no matter what.`,
        },
        {
          role: "user",
          content: trimmed,
        },
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const translation = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!translation) {
      req.log.error("Empty translation returned from Groq");
      res.status(500).json({ error: "Something went wrong. Please try again." });
      return;
    }

    const cringeScore = calculateCringeScore(translation);

    const response = TranslateTextResponse.parse({ translation, cringeScore });
    res.json(response);
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
