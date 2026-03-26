# SharkSense

Predictive shark risk intelligence platform for NSW ocean users. See `SHARKSENSE.md` for the full project brief.

## Quick Reference

### Stack
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- Mapbox GL JS for maps
- SunCalc for sunrise/sunset/moon phase
- Deployed on Vercel (free tier)
- No backend database — client-side with localStorage caching

### Key Architectural Decisions
- **Three risk levels only**: GREEN / AMBER / RED (traffic light)
- **Species-specific branching**: Bull shark (rainfall-driven) and white shark (upwelling-driven) scored independently, final score = max of both
- **Client-side data fetching** with 30-min localStorage cache
- **WaterNSW proxy**: `/api/waternsw/route.ts` edge function because WaterNSW doesn't support CORS
- **5 pilot beaches**: Manly, Dee Why, Nielsen Park, Bondi, Newcastle/Nobbys

### APIs (all free, no keys except Mapbox)
- Open-Meteo Weather: rainfall, temp, wind
- Open-Meteo Marine: SST, waves, swell
- WaterNSW: river discharge (via proxy)
- SunCalc: client-side, no API

### Risk Algorithm Weights
**Bull shark**: rainfall 0.30, discharge 0.25, estuary proximity 0.15, temp 0.10, visibility 0.10, time-of-day 0.10
**White shark**: upwelling 0.30, detection 0.20, temp 0.20, historical 0.15, season 0.15

### Commands
```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build
npm run lint    # ESLint
```
