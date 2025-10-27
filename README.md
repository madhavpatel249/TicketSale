# Evently

Evently is a practice project inspired by Ticketmaster, built to strengthen my skills with the MERN stack (MongoDB, Express, React, Node.js). It simulates a real-world ticket-selling platform where users can browse, create, and buy tickets for events. This project helped me gain hands-on experience with full-stack development, authentication, and deployment. While it's my first full-stack app, it includes key features like filtering, role-based access, and a mock checkout flow.

 **Live Demo:** [ticketsale-xi.vercel.app](https://ticketsale-xi.vercel.app/)

---

## ✨ Features

###  Landing Page
- Highlights popular events by category (Music, Sports, etc.)
- Scrollable top events section
- "Create Event" button for logged-in hosts
- Footer with quick links

###  Authentication
- Secure login/register
- Navigation updates based on user role

###  Events Listing
- Browse all upcoming events
- Filter by date, category, and location
- Sort options in a top navbar
- Large, clean event tiles

###  Event Detail Page
- Shows event info: date, time, location, description
- "Buy Ticket" button with featured events below

###  Create Event (Hosts Only)
- Form for title, description, date/time, location, price
- Upload event image

###  Checkout
- Modify ticket quantity 
- Mock payment experience
- Responsive layout with summary sidebar

###  Dashboard
- View purchased tickets
- Hosts can manage created events
- Clean, tile-based design

---

##  Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend framework
- **React.js** – Frontend library
- **Node.js** – Server-side runtime
- **Vercel** – Deployment

---

## 💻 Run Locally

Follow the steps below to run the project on your local machine.

```bash
# Clone the repo
git clone https://github.com/madhavpatel249/TicketSale.git

# Install dependencies
cd ticketsale
npm install

# Set up environment variables
# (Add your own .env setup instructions here)

# Start the development server
npm run dev
