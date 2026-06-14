# Sierra Leone Pharmacy System

A web-based pharmacy management application for Sierra Leone. It helps pharmacies track medications, manage prescriptions, register patients, and view operational reports from a single dashboard.

Built by Limkokwing students.

## Overview

Sierra Leone Pharmacy System is a single-page web app designed for real-world pharmacy workflows: inventory control, prescription handling, patient records, and analytics. Staff can manage day-to-day operations; patients can sign in to view their own health records and prescription history.

## Features

### Dashboard
- Overview cards for total medications, active prescriptions, low-stock items, and registered patients
- Quick actions to add medications, prescriptions, or patients

### Inventory Management
- Add, edit, and delete medications
- Track name, category, stock level, and expiration date
- Low-stock highlighting when stock falls below 10 units

### Prescription Management
- Create prescriptions linked to patients and medications
- View, edit, and fill active prescriptions
- Automatic stock deduction when a prescription is filled
- Status tracking: active, filled, or cancelled

### Patient Management
- Register patients with contact and address details
- Optional email-based login for patient portal access
- Password reset emails for patients with registered email addresses

### Reports & Analytics
- **Inventory report** — totals, categories, low-stock alerts, and medications expiring within 30 days
- **Prescription report** — active vs. filled counts, top prescribed medications, and recent activity

### Role-Based Access
| Role | Access |
|------|--------|
| **Admin** | Full dashboard, inventory, prescriptions, patients, and reports |
| **Pharmacist** | Same as admin for pharmacy operations |
| **Patient** | Personal information and prescription history only |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, JavaScript, [Tailwind CSS](https://tailwindcss.com) (CDN) |
| Authentication | [Firebase Authentication](https://firebase.google.com/docs/auth) |
| Database | [Cloud Firestore](https://firebase.google.com/docs/firestore) |
| Hosting | Any static file host or local browser |

No PHP, MySQL, or local server backend is required. Data is stored in Firebase and synced in real time.

## Project Structure

```
pharmacy-site/
├── index.html      # Main UI, layout, and Firebase SDK setup
├── app.js          # Application logic, auth, and Firestore operations
├── requirements.md # Functional and non-functional requirements
├── design.md       # System design notes
└── README.md       # This file
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Internet connection (Firebase and Tailwind load from CDN)

### Run locally

1. Clone or download this repository.
2. Open `index.html` in your browser, or serve the folder with a local static server:

   ```bash
   npx serve .
   ```

3. Sign in with one of the demo accounts below.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@slpharmacy.sl` | `123admin` |
| Pharmacist | `pharmacist@slpharmacy.sl` | `123password` |

Demo users and sample medications are created automatically on first load when Firebase collections are empty.

### Patient login

When a pharmacist adds a patient **with an email address**, the system creates a Firebase Auth account. The default password follows this pattern:

```
123 + last name (lowercase)
```

Example: patient **John Doe** → password `123doe`

Credentials are shown in an alert after the patient is saved.

## Firebase Collections

| Collection | Purpose |
|------------|---------|
| `users` | Staff and patient accounts (role, email, linked patient ID) |
| `medications` | Drug inventory records |
| `patients` | Patient demographic and contact data |
| `prescriptions` | Prescription items, status, and instructions |

## Contact

- **Email:** support@slpharmacy.sl  
- **Phone:** +232 76 772 318  
- **Address:** 15 Siaka Stevens Street, Freetown, Sierra Leone  

## License

© 2025 Sierra Leone Pharmacy System. All rights reserved.
