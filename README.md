# Kozijn Lead Generator

Lead generation systeem voor kozijnvervanging gebouwd met Next.js 16, Neon Database, en Nederlandse data-APIs.

## Features

- 🏠 **BAG API Integratie** - Haalt adressen op per postcode
- ⚡ **EPA Register** - Analyseert energielabels voor isolatie data
- 📊 **Multi-factor Lead Scoring** - Berekent lead kwaliteit op basis van:
  - Bouwjaar
  - Energielabel
  - Enkel/dubbel glas
  - Renovatie geschiedenis
  - WOZ waarde
- 🎯 **Dashboard** - Overzicht van leads gesorteerd op score en waarde

## Tech Stack

- **Next.js 16** - React framework met App Router
- **Neon Database** - Serverless PostgreSQL (geen Prisma)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Setup

1. **Clone en installeer dependencies:**

```bash
npm install
```

2. **Database setup:**

Maak een Neon database aan op [neon.tech](https://neon.tech) en voer de migrations uit:

```bash
# Connect met je Neon database en voer uit:
psql $DATABASE_URL -f migrations/001_initial.sql
```

3. **Environment variables:**

Kopieer `.env.example` naar `.env.local` en vul in:

```bash
cp .env.example .env.local
```

Vul `DATABASE_URL` in met je Neon connection string.

4. **Run development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### `POST /api/leads`
Genereer leads voor een postcode

```json
{
  "postalCode": "3581XT"
}
```

### `GET /api/leads?postalCode=3581XT`
Haal leads op voor een postcode

### `GET /api/analysis/bag?postalCode=3581XT`
Haal BAG data op

### `GET /api/analysis/epa?address=...&postalCode=...`
Haal EPA energielabel op

## Database Schema

- `leads` - Hoofd tabel voor leads
- `lead_factors` - Factoren die bijdragen aan de score
- `lead_analysis` - Raw API responses en analyses

## Toekomstige Features

- [ ] Google Street View AI analyse
- [ ] Warmtescan data integratie
- [ ] Route planning voor verkopers
- [ ] Contactgegevens enrichment
- [ ] Automatische follow-ups

## Data Bronnen

- **BAG API**: https://api.bag.kadaster.nl/
- **EPA Register**: Per gemeente verschillend
- **Google Street View**: Voor kozijn detectie (toekomstig)

## License

MIT
