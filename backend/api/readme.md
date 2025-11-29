# Documentation API - Application de Livraison de Nourriture

## Vue d'ensemble

API REST Django pour une application de livraison de nourriture avec support multi-rôles (Client, Livreur, Gérant, Administrateur).

**Base URL:** `/api/`

---

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Inscription

**POST** `/auth/register/`

Crée un nouveau compte utilisateur.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password_confirm": "string",
  "first_name": "string",
  "last_name": "string",
  "role": "client|driver|manager|admin",
  "phone": "string",
  "address": "string",
  "restaurant_name": "string (requis pour manager)",
  "restaurant_address": "string (optionnel pour manager)",
  "restaurant_phone": "string (optionnel pour manager)"
}
```

**Réponse (201):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "client",
    ...
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbG...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbG..."
  }
}
```

### Connexion

**POST** `/auth/login/`

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse (200):**
```json
{
  "user": {...},
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

### Rafraîchir le token

**POST** `/auth/refresh/`

**Body:**
```json
{
  "refresh": "string"
}
```

### Profil utilisateur

**GET/PUT** `/auth/profile/`

 Authentification requise

**Réponse (GET):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "client",
  "phone": "+22912345678",
  "address": "Cotonou, Bénin",
  "avatar": "http://...",
  "is_available": true
}
```

### Déconnexion

**POST** `/auth/logout/`

 Authentification requise

---

## Catégories

### Lister les catégories

**GET** `/categories/`

**Réponse (200):**
```json
[
  {
    "id": 1,
    "name": "Pizza",
    "icon": "pizza",
    "image": "http://...",
    "image_url": "http://...",
    "is_active": true,
    "order": 1,
    "filter": "pizza",
    "emoji": "pizza_image.png"
  }
]
```

### Créer/Modifier une catégorie

**POST/PUT/PATCH/DELETE** `/categories/`

Admin uniquement

---

## Restaurants

### Lister les restaurants

**GET** `/restaurants/`

**Réponse (200):**
```json
[
  {
    "id": 1,
    "name": "Pizza Palace",
    "description": "Les meilleures pizzas de Cotonou",
    "image": "http://...",
    "image_url": "http://...",
    "cover_image": "http://...",
    "cover_image_url": "http://...",
    "address": "Cotonou, Bénin",
    "rating": 4.5,
    "rating_count": 120,
    "delivery_time": "30-45 min",
    "delivery_fee": 500,
    "minimum_order": 1000,
    "is_open": true,
    "categories": [...],
    "category": "pizza"
  }
]
```

### Détails d'un restaurant

**GET** `/restaurants/{id}/`

Inclut également la liste des produits du restaurant.

### Restaurants par catégorie

**GET** `/restaurants/by_category/?category_id={id}`

### Restaurants populaires

**GET** `/restaurants/featured/`

Retourne les restaurants avec une note >= 4.0

### Basculer l'état ouvert/fermé

**POST** `/restaurants/{id}/toggle_open/`

Gérant ou Admin uniquement

**Réponse (200):**
```json
{
  "is_open": true
}
```

### Upload d'image

**POST** `/restaurants/{id}/upload_image/`

 Gérant ou Admin uniquement

**Form-data:**
- `image`: fichier image

---

## Produits

### Lister les produits

**GET** `/products/`

**Réponse (200):**
```json
[
  {
    "id": 1,
    "restaurant": 1,
    "restaurant_name": "Pizza Palace",
    "category": 1,
    "category_name": "Pizza",
    "name": "Margherita",
    "description": "Tomate, mozzarella, basilic",
    "price": 3500,
    "image": "http://...",
    "image_url": "http://...",
    "is_available": true,
    "is_popular": true,
    "is_featured": false
  }
]
```

### Créer un produit

**POST** `/products/`

 Gérant ou Admin uniquement

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 3500,
  "category": 1,
  "is_available": true,
  "is_popular": false,
  "is_featured": false
}
```

Pour les gérants, le restaurant est automatiquement défini.

### Produits par restaurant

**GET** `/products/by_restaurant/?restaurant_id={id}`

### Produits populaires

**GET** `/products/popular/`

### Produits en vedette

**GET** `/products/featured/`

### Upload d'image

**POST** `/products/{id}/upload_image/`

 Gérant ou Admin uniquement

---

## Panier

### Voir le panier

**GET** `/cart/`

 Authentification requise

**Réponse (200):**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product": {...},
      "quantity": 2,
      "subtotal": 7000
    }
  ],
  "total": 7000,
  "item_count": 2,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Ajouter au panier

**POST** `/cart/items/`

 Authentification requise

**Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

### Modifier la quantité

**PUT** `/cart/items/`

 Authentification requise

**Body:**
```json
{
  "product_id": 1,
  "quantity": 3
}
```

Si `quantity` = 0, l'article est supprimé.

### Supprimer un article

**DELETE** `/cart/items/?product_id={id}`

 Authentification requise

### Vider le panier

**DELETE** `/cart/items/`

 Authentification requise

---

## Commandes

### Lister les commandes

**GET** `/orders/`

 Authentification requise

Retourne les commandes selon le rôle:
- **Client**: ses propres commandes
- **Gérant**: commandes de son restaurant
- **Livreur**: ses livraisons
- **Admin**: toutes les commandes

**Réponse (200):**
```json
[
  {
    "id": 1,
    "restaurant": 1,
    "restaurant_name": "Pizza Palace",
    "restaurant_image": "http://...",
    "driver": 5,
    "driver_name": "Jean Dupont",
    "status": "delivering",
    "status_display": "En livraison",
    "total": 7500,
    "delivery_fee": 500,
    "delivery_address": "Cotonou, Akpakpa",
    "customer_name": "Marie Claire",
    "customer_phone": "+22912345678",
    "notes": "Appeler en arrivant",
    "items": [
      {
        "id": 1,
        "product_name": "Margherita",
        "product_price": 3500,
        "quantity": 2,
        "subtotal": 7000
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
]
```

### Créer une commande depuis le panier

**POST** `/orders/create_from_cart/`

 Authentification requise

**Body:**
```json
{
  "delivery_address": "Cotonou, Akpakpa",
  "customer_name": "Marie Claire",
  "customer_phone": "+22912345678",
  "notes": "Appeler en arrivant"
}
```

**Réponse (201):**
Retourne la commande créée.

### Commandes en attente

**GET** `/orders/pending/`

 Gérant uniquement

Retourne les commandes avec statut: pending, accepted, preparing, ready

### Mettre à jour le statut

**POST** `/orders/{id}/update_status/`

 Authentification requise

**Body:**
```json
{
  "status": "accepted|preparing|ready|assigned|picked_up|delivering|delivered|cancelled",
  "driver_id": 5
}
```

---

## Livreurs

### Planning du livreur

**GET** `/driver/schedule/my_schedule/`

 Livreur uniquement

**Réponse (200):**
```json
[
  {
    "id": 1,
    "day": "monday",
    "day_display": "Lundi",
    "is_enabled": true,
    "start_time": "08:00:00",
    "end_time": "18:00:00"
  }
]
```

### Mettre à jour un jour

**POST** `/driver/schedule/update_day/`

 Livreur uniquement

**Body:**
```json
{
  "day": "monday",
  "is_enabled": true,
  "start_time": "09:00",
  "end_time": "17:00"
}
```

### Basculer la disponibilité

**POST** `/driver/schedule/toggle_availability/`

 Livreur uniquement

**Réponse (200):**
```json
{
  "is_available": true
}
```

### Missions du livreur

**GET** `/driver/missions/`

 Livreur uniquement

Retourne les commandes assignées + commandes prêtes sans livreur.

### Tableau de bord livreur

**GET** `/driver/dashboard/`

 Livreur uniquement

**Réponse (200):**
```json
{
  "total_deliveries": 45,
  "today_de
