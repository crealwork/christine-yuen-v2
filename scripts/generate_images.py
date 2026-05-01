"""Generate atmosphere images via OpenAI gpt-image-2.

Reads scripts/prompts.json, writes JPGs to public/images/atmosphere/.
Skips existing files unless --force. Caps at $20 cumulative via .image-gen-log.json.
"""
import base64
import json
import os
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "images" / "atmosphere"
LOG_PATH = ROOT / ".image-gen-log.json"
HARD_CAP_USD = 20.0
API_URL = "https://api.openai.com/v1/images/generations"


def load_key() -> str:
    keys_file = Path(os.path.expanduser("~/.config/env/.keys.txt"))
    if not keys_file.exists():
        sys.exit("ERROR: keys file missing")
    for line in keys_file.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip()
    sys.exit("ERROR: OPENAI_API_KEY missing in keys file")


def estimate_cost(quality: str, size: str) -> float:
    base = {"high": 0.18, "medium": 0.07, "low": 0.03}.get(quality, 0.18)
    return base * (1.4 if "1536" in size else 1.0)


def total_cost() -> float:
    if not LOG_PATH.exists():
        return 0.0
    entries = json.loads(LOG_PATH.read_text(encoding="utf-8"))
    return sum(e.get("costUSD", 0) for e in entries)


def append_log(entry: dict) -> None:
    existing = json.loads(LOG_PATH.read_text(encoding="utf-8")) if LOG_PATH.exists() else []
    existing.append(entry)
    LOG_PATH.write_text(json.dumps(existing, indent=2), encoding="utf-8")


def call_api(api_key: str, prompt: str, size: str, quality: str) -> str:
    body = json.dumps({
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": size,
        "quality": quality,
    }).encode("utf-8")
    req = Request(API_URL, data=body, method="POST", headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    })
    last_err = None
    for attempt in range(3):
        try:
            with urlopen(req, timeout=600) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
                return payload["data"][0]["b64_json"]
        except HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")[:300]
            last_err = f"HTTP {e.code}: {err_body}"
            if e.code in (500, 502, 503, 504):
                wait = 2 ** attempt
                print(f"  retry {attempt+1}/3 in {wait}s — {last_err}", flush=True)
                time.sleep(wait)
                continue
            raise RuntimeError(last_err)
        except Exception as e:
            last_err = str(e)
            wait = 2 ** attempt
            print(f"  retry {attempt+1}/3 in {wait}s — {last_err}", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"failed after retries: {last_err}")


def main() -> None:
    args = sys.argv[1:]
    force = "--force" in args
    only = None
    if "--only" in args:
        idx = args.index("--only")
        only = set(args[idx + 1].split(","))

    api_key = load_key()
    config = json.loads((ROOT / "scripts" / "prompts.json").read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for entry in config["images"]:
        slug = entry["slug"]
        if only and slug not in only:
            continue

        out_path = OUT_DIR / f"{slug}.jpg"
        if out_path.exists() and not force:
            print(f"SKIP  {slug} (exists, use --force)", flush=True)
            continue

        if total_cost() >= HARD_CAP_USD:
            sys.exit(f"COST CAP: ${total_cost():.2f} >= ${HARD_CAP_USD}")

        full_prompt = f"{config['stylePreset']}\n\n{entry['prompt']}"
        print(f"GEN   {slug} ({entry['quality']}, {entry['size']})", flush=True)
        try:
            b64 = call_api(api_key, full_prompt, entry["size"], entry["quality"])
            out_path.write_bytes(base64.b64decode(b64))
            cost = estimate_cost(entry["quality"], entry["size"])
            append_log({
                "slug": slug,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "size": entry["size"],
                "quality": entry["quality"],
                "costUSD": cost,
            })
            print(f"  OK -> {out_path.name} (~${cost:.3f}, total ${total_cost():.2f})", flush=True)
        except Exception as e:
            print(f"  FAIL {slug}: {e}", flush=True)


if __name__ == "__main__":
    main()
