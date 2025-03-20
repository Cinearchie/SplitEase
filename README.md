

# SplitEase-Expense-Manager

SplitEase is a group expense tracker app that simplifies managing and settling expenses within a group. Users can create a room, invite friends using a room ID and password, and add expenses individually. The app automatically calculates and displays who owes whom, providing a seamless expense management experience.  


## Overview

- SplitEase helps groups manage shared expenses effortlessly.  
- Users can create or join rooms with secure authentication and session management.  
- Expenses are tracked in real-time, and settlements are calculated automatically.
  
## Features

- **User Authentication** – Secure login and signup using Passport.js  
- **Room Creation & Joining** – Create and join rooms with a room ID and password  
- **Expense Tracking** – Add and manage expenses individually  
- **Real-time Settlement** – Automatically calculates and displays who owes whom  
- **Session Management** – Maintains user sessions for a seamless experience  
- **Responsive UI** – Built with EJS and Tailwind CSS for an attractive design  

## Dependencies

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- Passport.js  
- EJS  
- Tailwind CSS  
- Express-Session  
- Connect-Mongo

## Git-Setup

Clone the repository:

```bash
git clone https://github.com/Cinearchie/SplitEase
cd SplitEase
```

Install the dependencies:
```bash
npm install
```

Run :
```bash
node app.js
```


Install the dependencies:
```bash
npm install
```

Create a .env file:
```bash
MONGO_URI=
SESSION_SECRET=
PORT=
```

4. Run Server:
```bash
node app.js
```
## Usage

Access the app in your web browser at `http://localhost:10000/`.
