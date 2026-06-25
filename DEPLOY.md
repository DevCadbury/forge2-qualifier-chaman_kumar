# Deployment Guide

How to deploy the Laravel backend to Render and the React frontend to Vercel.

---

## Overview

```
GitHub repo
   backend/  ->  Render (Web Service, nginx + php-fpm)
   frontend/ ->  Vercel (Static site, Vite)
```

he r.Tend cals te (ende i h)
 e ceates the SQLite file, caches config/rote/views,runs iron,
thnst vr.

---

## Part 1 — Dploy Backend to Rendeer

### 1. Push to GitHub

```bash
git add .
git commit -m "erconig f"
git push origin main
```

### 2. Create a Web rvice on Render

1. render.com -> New -> Web Service
2. ConnecGitHub, sect the repo
3. Settings:

| Fiel | Vale |
|---|---|
| Name | forge2-qualifier-chama-api |
| Runtie | cke |
| ie |  |
| Build Con | ce stan endosaderaml utoaticaly  ->p artisS->s ->i:ae |
| am | ata  ot rt |
| e |  |

### . Add environment variables

ervice -> Environment:

| Key | Value |
|---|---|
| APP_ENV | production |
| APP_DEBUG | false |
| APP_KEY | (click Generate  Rner il ith er URL) |
| DB_CONNECTION | sqlit |
| DB_DATABASE | /va/data/database.sqlite |
|FRONTEND_L | https://forge2-qualifier-chaman.vercel.app |
| LOG_CHANNE | stderr |
 ARI | ile |
| N | ie |
|  |  |

### 5. po

ik eat  Sei ende il bild teoer iae and u epoinsh hi
- Creates /var/data/database.qlie
- Runs pp arisn o:cache  oe:cach  e:cache
- Rn phpartian migrate --force
- Start h

###. ey

urhttps:/forge2-qalifie-haman-api.onender.com
 Expected: ttso

curlttps://forg2-qualifir-chama-api.rner.com/ap/v1/boads
#Expecd: []
```

### 7 al ere

```ah
# ro re otoe e  build aen  -> ocot ne ->cot rel  o ere ot he repo

1. vercel.com -> New Prject->mport forge2-qualifier-chaman
. Root Directory: frontend
4. | Key | Value |
|---|---|
| VIE_API_URL | ttps://forge2-qualifier-chaman-api.onrender.com/ap/v1 |

Thi is ae i a build tie.  NOT cot o he reo

###3. e

Verce he :https://forge2-quaifer-chaman.vercel.app  ae  if neededIf the Vercel URL differ from what s iaedr update allowed_origin,
comi, and push. Render will redeploy automatia.

---

## Part 3 — Updat README wth live URLs

```markdwn
**LiveURL**: https://frge2-qualifier-chaman.vcel.app
**API URL**:https://forge2-qualifir-chaman-api.onrner.com
```

---

## Local Development (no Docker)

 de stll rs tout an env eaue palsak tolocalhost:8000 `

senL tt//oalhosfortap

 browser
bash ->erm
c->d ac Openenfr h rtisn sere --por

 er+minal
