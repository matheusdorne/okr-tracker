# OKRTracker

Personal web app to track OKRs (Objectives and Key Results). Single user, self-hosted, built to be simple and fast.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Vue 3 + Composition API + `<script setup>` |
| Styling | Plain CSS — no Tailwind, no preprocessors |
| State | `ref()` / `reactive()` — no Pinia |
| Router | Vue Router 4 |
| Backend / DB | PocketBase (single binary, REST API + admin UI) |
| Build | Vite |

No TypeScript. Plain `.vue` SFCs only.

## Data model

| Collection | Purpose |
|---|---|
| `users` | Auth — single user |
| `goals` | Objectives with quarter, year, status |
| `key_results` | Numeric KRs — current value vs. target |
| `key_results` (boolean) | Key Deliverables — done/not done |
| `checkins` | Daily value updates per KR |
| `weekly_reviews` | Wins, blockers, next steps per week |

## Architecture

```
views/          → orchestrate only, no API calls
composables/    → use-case layer: reactive state + calls to api/
api/            → only place pb.collection(...) lives
components/     → pure presentation, receive props, emit events
```

## Local dev

### 1. Start PocketBase

Download the binary from [pocketbase.io](https://pocketbase.io/docs/) and run:

```bash
./pocketbase serve
# Admin UI → http://127.0.0.1:8090/_/
```

Create the collections in the admin UI using the schema in the codebase context.

### 2. Create your user

```bash
node setup-user.js <admin-email> <admin-password> <your-email> <your-password>
```

Example:

```bash
node setup-user.js admin@local.dev secret123 matheus.dorne@gmail.com mypass456
```

### 3. Start the dev server

```bash
npm install
npm run dev
# App → http://localhost:5173
```

## Screens

| Route | View | Description |
|---|---|---|
| `/login` | `Login.vue` | Email + password sign-in |
| `/` | `Dashboard.vue` | All goals, metric cards, filter pills, weekly review prompt |
| `/goal/new` | `GoalForm.vue` | Create goal |
| `/goal/:id` | `GoalDetail.vue` | KRs, KDs, progress card, history tab |
| `/goal/:id/edit` | `GoalForm.vue` | Edit goal |
| `/checkin/:goalId` | `CheckIn.vue` | Daily check-in — update KR values and KD states |
| `/review/:goalId` | `WeeklyReview.vue` | Weekly review — wins, blockers, next steps |

## Design tokens

Primary brand: `#8B5CF6` (purple). Status colors: on track `#10B981` · at risk `#F59E0B` · completed purple. Full token set in `src/assets/main.css`.

## Future

- Docker + nginx + PocketBase in a single `docker-compose.yml`
- HTTP Basic Auth via nginx
- Let's Encrypt SSL on a VPS
