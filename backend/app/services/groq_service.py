"""Groq LLM API service for eligibility reasoning and explanation generation."""
from __future__ import annotations

import json
import logging
from typing import Optional

from groq import Groq

from app.config import settings

logger = logging.getLogger(__name__)

_client: Optional[Groq] = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Please configure it in your .env file."
            )
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


# ---------------------------------------------------------------------------
# Prompt builders
# ---------------------------------------------------------------------------

def _build_eligibility_prompt(
    age: int,
    income: int,
    occupation: str,
    location: str,
    situation: Optional[str],
    schemes: list[dict],
) -> str:
    schemes_text = json.dumps(schemes, ensure_ascii=False, indent=2)

    situation_line = (
        f"Situation: {situation.title()}" if situation else "Situation: General / Not specified"
    )

    return f"""You are an expert on Indian government welfare schemes. Your task is to analyze a citizen's profile and determine which government schemes they are eligible for.

## Citizen Profile
- Age: {age} years
- Annual Income: ₹{income:,}
- Occupation: {occupation.title()}
- Location: {location.title()}
- {situation_line}

## Available Schemes (JSON)
{schemes_text}

## Instructions
1. Carefully evaluate each scheme's eligibility rules against the citizen profile.
2. **If a specific situation is stated (not "General / Not specified"), only recommend schemes that are directly relevant to that situation** — e.g. if the situation is "Education", recommend only education-related schemes; if it is "Healthcare", only healthcare-related schemes. Do not include schemes unrelated to the stated situation.
3. Select ONLY the schemes the citizen is likely eligible for, satisfying BOTH their occupation/income/age profile AND the stated situation.
4. For each selected scheme, write a short, friendly eligibility reason in 1–2 sentences that clearly explains WHY they qualify.
5. Also write a brief overall summary (2–3 sentences) highlighting the most impactful schemes.
6. Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.

## Required JSON Output Format
{{
  "recommended_schemes": [
    {{
      "scheme_id": <integer>,
      "scheme_name": "<string>",
      "reason": "<1-2 sentence plain-language explanation>"
    }}
  ],
  "ai_summary": "<2-3 sentence overall summary>"
}}

Important: If no schemes match, return an empty list for recommended_schemes and explain in ai_summary."""


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_eligibility_recommendations(
    age: int,
    income: int,
    occupation: str,
    location: str,
    situation: Optional[str],
    schemes: list[dict],
) -> dict:
    """
    Call Groq LLM to evaluate scheme eligibility for the given user profile.

    Returns a dict with keys:
        - recommended_schemes: list of {scheme_id, scheme_name, reason}
        - ai_summary: overall narrative
        - raw_response: raw LLM text (for audit)
    """
    prompt = _build_eligibility_prompt(
        age=age,
        income=income,
        occupation=occupation,
        location=location,
        situation=situation,
        schemes=schemes,
    )

    client = _get_client()

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful, accurate, and empathetic government scheme advisor for India. "
                        "You always respond with valid JSON only, with no additional text outside the JSON object."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            model=settings.GROQ_MODEL,
            temperature=0.2,
            max_tokens=2048,
        )
    except Exception as exc:
        logger.error("Groq API call failed: %s", exc)
        raise RuntimeError(f"AI service unavailable: {exc}") from exc

    raw_text = chat_completion.choices[0].message.content.strip()

    # Strip markdown code fences if the model wraps output in ```json ... ```
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(
            line for line in lines if not line.strip().startswith("```")
        )

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Groq JSON response: %s\nRaw: %s", exc, raw_text)
        # Graceful degradation: return empty result rather than crashing
        parsed = {
            "recommended_schemes": [],
            "ai_summary": "AI analysis could not be completed. Please try again.",
        }

    parsed["raw_response"] = raw_text
    return parsed
