# EXTEND - Plateforme de Formation et Parrainage

## Architecture Technique

### Structure du Projet
```
src/
├── app/                    # Pages et routes Next.js
│   ├── api/               # Endpoints API
│   ├── (auth)/           # Routes d'authentification
│   └── profile/          # Routes du profil utilisateur
├── components/            # Composants React réutilisables
├── contexts/             # Contextes React (état global)
├── lib/                  # Utilitaires et configurations
└── types/                # Types TypeScript
```

### Technologies Utilisées
- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: API Routes Next.js
- **Base de données**: MySQL avec SSL
- **Authentification**: JWT (JSON Web Tokens)
- **Sécurité**: HTTPS, CORS, CSP Headers

## API Documentation

### Authentification
#### POST `/api/auth/signin`
- **Description**: Authentification utilisateur
- **Body**: 
```json
{
  "email": "string",
  "password": "string"
}
```
- **Réponse**: JWT token dans un cookie HTTP-only

#### POST `/api/auth/signup`
- **Description**: Création de compte
- **Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone_number": "string",
  "referral_code": "string?"
}
```

#### POST `/api/auth/forgot-password`
- **Description**: Demande de réinitialisation de mot de passe
- **Body**: `{ "email": "string" }`

### Profil Utilisateur
#### GET `/api/profile`
- **Description**: Récupération des informations du profil
- **Auth**: Required
- **Réponse**: Informations complètes du profil

#### PUT `/api/profile`
- **Description**: Mise à jour du profil
- **Auth**: Required
- **Body**: Champs du profil à mettre à jour

#### DELETE `/api/profile`
- **Description**: Suppression du compte
- **Auth**: Required
- **Body**: `{ "password": "string" }`

### Formations
#### GET `/api/user-formations`
- **Description**: Liste des formations de l'utilisateur
- **Auth**: Required
- **Réponse**: Liste des formations avec statut d'inscription

#### POST `/api/formations/upload`
- **Description**: Upload d'image pour une formation
- **Auth**: Required
- **Body**: FormData avec `file` et `trainingId`

### Commissions
#### GET `/api/commissions`
- **Description**: Récupération des commissions
- **Auth**: Required
- **Réponse**: Liste des commissions et résumé

### Système de Parrainage
#### GET `/api/referrals`
- **Description**: Arbre de parrainage
- **Auth**: Required
- **Réponse**: Structure hiérarchique des parrainages

## Sécurité

### Chiffrement SSL
- Certificats SSL pour la base de données
- HTTPS forcé en production
- En-têtes de sécurité (HSTS, CSP, etc.)

### Protection des Données
- Mots de passe hashés avec bcrypt
- Tokens JWT avec expiration
- Validation des entrées
- Protection CSRF
- En-têtes de sécurité

## Modèles de Données

### Utilisateur
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  referral_code: string;
  profile_picture: string | null;
  created_at: Date;
}
```

### Formation
```typescript
interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed';
  thumbnail_image: string;
}
```

### Commission
```typescript
interface Commission {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'paid';
  generation: number;
  created_at: Date;
}
```

## Installation et Déploiement

### Prérequis
- Node.js 18+
- MySQL 8+
- Certificats SSL pour la production

### Configuration
1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement :
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Contribution
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
