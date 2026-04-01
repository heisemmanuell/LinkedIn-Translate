# LinkedIn Translate 

> *Say what you mean. Sound like a LinkedIn influencer. An AI-powered translator that turns your casual thoughts into professional, over-the-top corporate speak instantly.*

Transform simple, mundane daily updates like "I ate a sandwich" into 150-word agile, leveraged, synergy-packed thought leadership posts with AI.

## Architecture

This project is built as a highly robust, scalable **Full-Stack Monorepo** utilizing `pnpm workspaces`. It perfectly decouples the frontend logic from the backend AI processing, ensuring security and seamless deployments across different serverless architectures.

- **Frontend:** React + Vite (Tailwind CSS, Radix UI). Fast, modern, completely client-side.
- **Backend API:** Node.js + Express. Handles LLM rate limiting (express-rate-limit), payload sanitization, and API key containment.
- **Shared Libraries (`/lib`):**
  - `@workspace/api-zod`: A shared Zod schema validating the contract between the frontend and backend.
  - `@workspace/api-client-react`: A custom generic Orval data-fetching wrapper synced to the API endpoint.
- **Database (Optional):** Pre-equipped with a decoupled Drizzle ORM + Postgres module inside `lib/db` for future scaling (currently stateless for privacy).

## Getting Started Locally

### Prerequisites
- Node.js (v20 or higher)
- `pnpm` (run `npm install -g pnpm`)
- A [Groq API Key](https://console.groq.com)

### 1. Installation
Clone the repo and deeply install dependencies across all workspaces:
```bash
git clone https://github.com/heisemmanuell/LinkedIn-Translate.git
cd LinkedIn-Translate
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add your Groq API key (to power the translations):
```bash
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

### 3. Run the Monorepo
You will need two terminal windows to run both the API Server and the Frontend simultaneously.

**Terminal 1 (Backend API):**
```bash
# Starts the Express backend on localhost:3000
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 (Frontend Client):**
```bash
# Starts the Vite React frontend
pnpm --filter @workspace/linkedin-translate run dev
```

Visit `http://localhost:5173` to start translating!

## Production Deployment

This monorepo is completely platform agnostic and natively supports decoupled production deployments. 

### Step 1: Deploy Backend (Render / Railway)
1. Link your repo to your backend provider of choice.
2. Set the build command to explicitly include compilers:
   `NODE_ENV=development pnpm install && pnpm run build`
3. Set the start command to:
   `pnpm --filter @workspace/api-server run start`
4. Provide the exact same `.env` variables (including `FRONTEND_URL` for strict CORS).

### Step 2: Deploy Frontend (Vercel / Netlify)
1. Link the same repository in Vercel.
2. Vercel natively detects the `pnpm` workspace. Make sure to select `Vite` as the framework preset and explicitly target `artifacts/linkedin-translate` as the root build directory.
3. Supply `VITE_API_URL` pointing to your shiny new Backend URL so the frontend knows where to send requests in the wild!
