# 🪙 Numismatics Marketplace

A modern **Numismatics Collection & Marketplace Web App** built using **Next.js + TypeScript + Firebase (Auth & Firestore)**.
This platform allows collectors to **explore, list, and manage collectible coins, banknotes, and rare numismatic items**.

---


## 📌 Features

### 👤 Authentication

* User registration & login (Firebase Auth)
* Persistent sessions
* Protected routes

---

### 🛒 Marketplace

* Browse collectible coins
* Search coins by name, country, or year
* Filter by:

  * Country
  * Metal
  * Condition
  * Price range

---

### 🪙 Coin Listings

* Add new coins for sale
* Store listings in Firestore
* View detailed coin information

---

### ❤️ Wishlist

* Add/remove coins to wishlist
* Persistent storage using Firestore

---

### 📦 Collection Management

* Maintain personal collection
* Mark items as “For Sale”

---

### 💬 Messaging (UI Only)

* Chat interface between buyer & seller

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Zustand (State Management)
* shadcn/ui (UI Components)

---

### Backend (Firebase)

* Firebase Authentication
* Firestore Database

---

### Deployment

* Firebase Hosting

---

## 📂 Folder Structure

```
src/
 ├── app/
 │   ├── page.tsx
 │   ├── marketplace/
 │   ├── product/
 │   ├── sell/
 │   ├── profile/
 │   ├── wishlist/
 │   ├── login/
 │   └── register/
 │
 ├── components/
 │   ├── Navbar/
 │   ├── ProductCard/
 │   ├── Filters/
 │   ├── SearchBar/
 │
 ├── lib/
 │   ├── firebase.ts
 │   ├── auth.ts
 │   ├── db.ts
 │
 ├── services/
 │   ├── coinService.ts
 │   ├── wishlistService.ts
 │   ├── collectionService.ts
 │
 ├── store/
 │   └── authStore.ts
 │
 ├── data/
 │   └── coins.ts
 │
 ├── types/
 │   └── coin.ts
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/numismatics-marketplace.git
cd numismatics-marketplace
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Firebase

Create a Firebase project and enable:

* Authentication (Email/Password)
* Firestore Database

---

### 4. Add Firebase Config

Create:

```
src/lib/firebase.ts
```

```ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
```

---

### 5. Run Development Server

```bash
npm run dev
```

---

### 6. Build Project

```bash
npm run build
```

---

## 🚀 Deployment (Firebase Hosting)

### Install Firebase CLI

```bash
npm install -g firebase-tools
```

---

### Login

```bash
firebase login
```

---

### Initialize Hosting

```bash
firebase init
```

Select:

* Hosting
* Public directory: `out`
* Single-page app: Yes

---

### Deploy

```bash
firebase deploy
```

---

## 🔐 Firestore Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /coins/{coinId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null;
    }

    match /wishlist/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🎯 Future Enhancements

* Image upload using Cloudinary
* Auction system (bidding)
* AI-based coin recognition
* Price trend analytics
* Real-time chat system
* Backend migration to Node.js + PostgreSQL

---

## 🧠 Learnings

* Built scalable frontend architecture using Next.js
* Integrated Firebase Auth & Firestore
* Implemented state management with Zustand
* Designed real-world marketplace UX

---

## 🤝 Contributing

Pull requests are welcome!
Feel free to fork the repo and improve the project.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
