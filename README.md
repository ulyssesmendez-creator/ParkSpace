# ParkSpace

ParkSpace is a full stack, location based parking platform that allows users to discover and list parking spaces through an interactive map interface.

---

# Goal

Instead of treating parking as a static list, ParkSpace models availability as a location aware resource that users can explore visually in real time.

---

## Tech Stack

### Frontend
- React
- JavaScript
- MapLibre GL
- Chakra UI

### Backend
- Node.js
- Express
- MongoDB (Mongoose)

### Authentication
- Firebase Authentication (Email + OAuth)

---

## Features

- Interactive map based search
- Listing rendering based on map viewport
- User authentication (signup / login)
- Create and manage parking listings
- RESTful API architecture
- Component based frontend structure

---

## Architecture Overview

ParkSpace follows a client server architecture:

- React frontend manages UI state and map interactions
- Express backend exposes RESTful APIs
- MongoDB stores parking listings and user data
- Firebase handles authentication and session management

The system separates:
- UI logic  
- API routing  
- Data persistence  
- Authentication flow  
