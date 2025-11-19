# Guide de Déploiement - MedTracker

## Table des matières
1. [Prérequis](#prérequis)
2. [Installation locale](#installation-locale)
3. [Configuration](#configuration)
4. [Déploiement sur Vercel](#déploiement-sur-vercel)
5. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
6. [Maintenance](#maintenance)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** 18.17 ou plus récent ([télécharger](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** ([télécharger](https://git-scm.com/))
- Un compte **GitHub** (pour la gestion du code)
- Un compte **Vercel** (optionnel, pour le déploiement en ligne)

## Installation locale

### 1. Cloner le dépôt
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/medtracker.git
cd medtracker
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
# ou avec yarn
yarn install
\`\`\`

### 3. Démarrer l'application en développement
\`\`\`bash
npm run dev
# ou avec yarn
yarn dev
\`\`\`

L'application sera accessible à `http://localhost:3000`

## Configuration

### Variables d'environnement
MedTracker utilise **localStorage** pour la persistence des données, aucune variable d'environnement n'est nécessaire pour le fonctionnement de base.

**Fichier `.env.local` (optionnel pour le développement) :**
\`\`\`
NEXT_PUBLIC_APP_NAME=MedTracker
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`

### Structure des données
Les données sont stockées dans le localStorage du navigateur avec les clés suivantes :
- `medtracker_users` - Liste des utilisateurs enregistrés
- `medtracker_medications_{username}` - Médicaments de l'utilisateur
- `medtracker_doserecords_{username}` - Historique des prises de médicaments

## Déploiement sur Vercel

### Méthode 1 : Interface Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Connectez votre dépôt GitHub
4. Sélectionnez le dépôt `medtracker`
5. Vercel détectera automatiquement Next.js
6. Cliquez sur "Deploy"

### Méthode 2 : CLI Vercel

1. Installez la CLI Vercel :
\`\`\`bash
npm install -g vercel
\`\`\`

2. Depuis le dossier du projet, exécutez :
\`\`\`bash
vercel
\`\`\`

3. Suivez les instructions du CLI

### Configuration Vercel
- **Framework Preset** : Next.js (automatiquement détecté)
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

**Après le déploiement :**
- Votre application sera disponible à `https://medtracker-[random].vercel.app`
- Vous pouvez ajouter un domaine personnalisé dans les paramètres Vercel

## Déploiement sur GitHub Pages

**Note :** GitHub Pages héberge des sites statiques. Pour MedTracker (une application Next.js), Vercel est la solution recommandée.

Si vous souhaitez quand même utiliser GitHub Pages :

1. Modifiez `next.config.mjs` pour l'export statique :
\`\`\`javascript
const nextConfig = {
  output: 'export',
  basePath: '/medtracker',
  assetPrefix: '/medtracker/',
};
export default nextConfig;
\`\`\`

2. Créez un workflow GitHub Actions (`.github/workflows/deploy.yml`) :
\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: './out'
      - uses: actions/deploy-pages@v2
\`\`\`

3. Activez GitHub Pages dans les paramètres du dépôt (Settings > Pages > Deploy from a branch > `gh-pages`)

## Maintenance

### Mise à jour de l'application

1. Apportez vos modifications localement
2. Testez en développement :
\`\`\`bash
npm run dev
\`\`\`

3. Build pour la production :
\`\`\`bash
npm run build
\`\`\`

4. Committez et poussez vers GitHub :
\`\`\`bash
git add .
git commit -m "feat: description de la modification"
git push origin main
\`\`\`

5. Vercel redéploiera automatiquement

### Bonnes pratiques

- **Sauvegardez régulièrement** : Exportez vos données utilisateur si nécessaire
- **Testez avant de déployer** : Utilisez `npm run build` localement
- **Utilisez des branches** : Créez des branches pour les nouvelles fonctionnalités
- **Documenter les changements** : Maintenez un CHANGELOG.md

### Commandes utiles

\`\`\`bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Tests (si disponible)
npm test
\`\`\`

## Troubleshooting

### L'application n'affiche pas mes données après le déploiement
- Les données sont stockées dans le localStorage du navigateur
- Chaque navigateur/appareil a son propre localStorage isolé
- Assurez-vous que les cookies et le stockage local ne sont pas désactivés

### Le déploiement Vercel échoue
1. Vérifiez que tous les fichiers sont committés
2. Vérifiez les logs de build sur le dashboard Vercel
3. Assurez-vous que `package.json` est à la racine du projet

### Les images ne s'affichent pas
- Vérifiez que les images sont dans le dossier `/public`
- Utilisez les chemins relatifs `/images/nom-du-fichier.jpg`

## Support et Ressources

- **Documentation Next.js** : https://nextjs.org/docs
- **Vercel Docs** : https://vercel.com/docs
- **Problèmes GitHub** : Créez une issue sur le dépôt
- **Community** : Rejoignez la communauté Vercel

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025
