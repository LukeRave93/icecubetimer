# IceCubeTimer — Churn Retention Flow

A voice-powered churn cancellation flow built with React + ElevenLabs Conversational AI.

## Quick start

```bash
npm install
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Create React App** (auto-detected)
4. Click Deploy — done

## Configuration

Open `src/App.jsx` and update the two constants at the top:

```js
const AGENT_ID    = "agent_8201kjbxrhm2e55ae19ba8nm4f8z"; // your ElevenLabs agent
const WEBHOOK_URL = "YOUR_WEBHOOK_URL";                    // receives { reason, transcript, outcomes }
```

The webhook payload looks like:
```json
{
  "reason": "budget",
  "transcript": "...",
  "outcomes": {
    "primary": "runway_extension",
    "secondary": "olive_branch",
    "insight": "User is scaling a home bar setup, cost at scale is the blocker"
  }
}
```

## Powered by TalkBack
