# Backend Domaine Discover MVP

API NestJS + Prisma dédiée au site **DIASPORA IMO MATHIAM MBOW**.

## Démarrage local

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

L'API écoute sur `http://localhost:4010/api`.

Les photos des biens sont stockées en local dans `backend/uploads` et servies publiquement via `http://localhost:4010/uploads/...`.

Compte admin de développement :

- Email : `admin@diaspora-imo-mathiam-mbow.com`
- Mot de passe : `Admin123!`

Changez ces valeurs dans `.env` avant toute mise en ligne.

## Routes principales

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- `GET /api/properties`, `GET /api/properties/:id`
- `POST/PATCH/DELETE /api/properties` — administrateur
- `POST /api/inquiries` — public, `GET/PATCH /api/inquiries` — administrateur
- `POST /api/visits` — public, `GET/PATCH /api/visits` — administrateur
- `POST /api/reservations` — public, `GET/PATCH /api/reservations` — administrateur
