# Setup Instructies

## Stap 1: Neon Database Aanmaken

1. Ga naar [neon.tech](https://neon.tech)
2. Maak een gratis account aan
3. Maak een nieuw project aan
4. Kopieer de **Connection String** (ziet eruit als: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`)

## Stap 2: Environment Variables Instellen

Maak een `.env.local` bestand in de root van het project:

```bash
# In de terminal:
touch .env.local
```

Voeg toe aan `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Vervang** de connection string met jouw Neon database URL.

## Stap 3: Database Schema Aanmaken

Voer de migration uit om de tabellen aan te maken:

### Optie A: Via Neon Dashboard (Aanbevolen)
1. Ga naar je Neon project dashboard
2. Klik op "SQL Editor"
3. Open het bestand `migrations/001_initial.sql`
4. Kopieer de hele inhoud
5. Plak in de SQL Editor en klik "Run"

### Optie B: Via Command Line
```bash
# Installeer psql als je die nog niet hebt (macOS):
# brew install postgresql

# Voer migration uit:
psql $DATABASE_URL -f migrations/001_initial.sql
```

## Stap 4: Development Server Starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stap 5: Testen

1. Voer een Nederlandse postcode in (bijv. `3581XT`)
2. Klik "Genereer Leads"
3. Je zou een lijst met leads moeten zien!

## Troubleshooting

### Database connection error?
- Check of `DATABASE_URL` correct is in `.env.local`
- Check of de database in Neon actief is
- Check of `sslmode=require` in de connection string staat

### Geen leads gevonden?
- BAG API werkt alleen met echte Nederlandse postcodes
- In development mode worden mock data gebruikt als BAG API faalt
- Check de browser console voor errors

### TypeScript errors?
```bash
npm install
```

## Volgende Stappen (Optioneel)

- Voeg Google Maps API key toe voor Street View (toekomstig)
- Configureer echte EPA register endpoints per gemeente
- Voeg meer data bronnen toe

