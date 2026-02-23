# Quiz-Game-Apk

This repository contains a real-time multiplayer quiz game application, divided into a client-side (React) and a server-side (Node.js with Express and Socket.IO). Players can create or join quiz games, answer questions, and compete for the highest score.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [How to Play](#how-to-play)
- [Socket.IO Communication](#socketio-communication)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- **Real-time Multiplayer:** Players can join games and compete against each other in real-time.
- **Game Creation:** Host can create a new game with a specified difficulty level (Easy, Medium, Hard).
- **Game Joining:** Players can join an existing game using a unique Game ID.
- **Dynamic Questions:** Questions are fetched from the Open Trivia Database API based on the chosen difficulty.
- **Score Tracking:** Real-time score updates for all players.
- **Timer per Question:** Each question has a time limit for answering.
- **Game End & Winner Declaration:** The game concludes after all questions, and a winner (or draw) is declared.
- **Persistent Player/Game ID:** Uses `localStorage` to remember player and game IDs for convenience.

## Technologies Used

### Client-side (Game-Client)

- **React.js:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web projects.
- **Socket.IO Client:** For real-time, bidirectional, event-based communication.
- **Material-UI (MUI):** A popular React UI framework for beautiful and responsive designs.
- **ESLint:** For maintaining code quality and consistency.

### Server-side (Game-Server)

- **Node.js:** JavaScript runtime environment.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **Socket.IO:** For real-time, bidirectional, event-based communication.
- **Nodemon:** A utility that monitors for any changes in your source and automatically restarts your server.
- **UUID:** For generating unique IDs.
- **CORS:** Middleware to enable Cross-Origin Resource Sharing.
- **Open Trivia Database API:** Source for quiz questions.

## Project Structure

```
Quiz-Game-Apk/
├───README.md
├───Game-Client/
│   ├───public/
│   ├───src/
│   │   ├───assets/
│   │   ├───component/
│   │   │   ├───QuestionCard.jsx
│   │   │   ├───ScoreButtion.jsx (NOTE: This is a misnamed Timer component)
│   │   │   └───Timer.jsx
│   │   ├───Context/
│   │   │   └───GameContext.jsx (NOTE: This file is currently empty/unused)
│   │   ├───Pages/
│   │   │   ├───Join.jsx
│   │   │   ├───Quiz.jsx
│   │   │   └───Result.jsx
│   │   ├───socket/
│   │   │   └───GameSocket.js
│   │   ├───App.css
│   │   ├───App.jsx
│   │   ├───index.css
│   │   └───main.jsx
│   ├───.gitignore
│   ├───eslint.config.js
│   ├───index.html
│   ├───package-lock.json
│   ├───package.json
│   └───vite.config.js
└───Game-Server/
    ├───services/
    │   ├───gameloop.services.js
    │   ├───gameSession.services.js
    │   ├───matchMaking.services.js
    │   └───quiz.services.js
    ├───socket/
    │   └───Game.socket.js
    ├───store/
    │   └───memoryStore.js
    ├───test/
    │   ├───playerA.js
    │   └───playerb.js
    ├───package-lock.json
    ├───package.json
    └───server.js
```

## Getting Started

Follow these instructions to set up and run the Quiz Game application on your local machine.

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Quiz-Game-Apk.git
    cd Quiz-Game-Apk
    ```

2.  **Install server dependencies:**
    ```bash
    cd Game-Server
    npm install
    cd ..
    ```

3.  **Install client dependencies:**
    ```bash
    cd Game-Client
    npm install
    cd ..
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    cd Game-Server
    npm start
    ```
    The server will typically run on `http://localhost:3000`.

2.  **Start the client:**
    Open a new terminal, navigate to the `Game-Client` directory, and run:
    ```bash
    cd Game-Client
    npm run dev
    ```
    The client application will open in your browser, usually at `http://localhost:5173`.

## How to Play

1.  **Open two browser windows/tabs** and navigate to the client application URL (e.g., `http://localhost:5173`).
2.  **In the first window (Host):**
    - Enter a Player ID.
    - Select a difficulty level.
    - Click "Create Game (Host)".
    - You will be taken to a "Waiting for Players..." screen with a Game ID.
3.  **In the second window (Player 2):**
    - Enter a Player ID (different from the host's).
    - Enter the Game ID provided by the host.
    - Click "Join Game".
4.  **The game will start automatically** once the second player joins.
5.  **Answer questions** within the given time limit.
6.  **View scores** in real-time.
7.  **After all questions**, the game will finish, and the results (winner and final scores) will be displayed.
8.  Click "Play Again" to start a new game.

## Socket.IO Communication

The application uses Socket.IO for real-time communication between the client and server.

### Client Emits

-   `create_game`: Sent by the host to create a new game session.
    -   Payload: `{ playerid: string, level: string }`
-   `Join_Game`: Sent by a player to join an existing game.
    -   Payload: `{ gameid: string, playerid: string }`
-   `Submit_answer`: Sent by a player when they submit an answer to a question.
    -   Payload: `{ gameid: string, playerid: string, questionid: number, answer: string }`

### Server Emits

-   `game_created`: Sent to the host after a game session is successfully created.
    -   Payload: `{ gameid: string }`
-   `error`: Sent to a client if an error occurs (e.g., game not found, invalid action).
    -   Payload: `{ message: string }`
-   `player_joined`: Sent to all players in a game room when a new player joins.
    -   Payload: `{ playerid: string, message: string }`
-   `Game_Started`: Sent to all players in a game room when the game officially begins (after two players join).
    -   Payload: `{ questions: Array<Object> }`
-   `new_questions`: Sent to all players with a new question.
    -   Payload: `{ questionNumber: number, question: Object }`
-   `score_update`: (Currently not explicitly emitted in `Game.socket.js` but implied by `answer_received` which contains score)
    -   Payload: `{ scores: Object }`
-   `answer_recived`: Sent to all players after an answer is submitted.
    -   Payload: `{ playerid: string, questionid: number, isCorrectans: boolean, score: number }`
-   `Game_finished`: Sent to all players when the game concludes.
    -   Payload: `{ scores: Object, winner: string }`

## API Reference

The server fetches quiz questions from the [Open Trivia Database API](https://opentdb.com/api.php).

Example API call for 10 easy multiple-choice questions:
`https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`

## Future Enhancements

-   **More Players:** Extend the game to support more than two players.
-   **Lobby System:** Implement a proper lobby system for game management.
-   **Spectator Mode:** Allow users to watch ongoing games.
-   **Leaderboards:** Track and display top scores.
-   **User Authentication:** Implement user accounts and profiles.
-   **Refactor `ScoreButtion.jsx`:** Rename and ensure it's not a duplicate of `Timer.jsx`.
-   **Implement `GameContext.jsx`:** Utilize React Context API for better state management if needed.
-   **Robust Error Handling:** More comprehensive error handling and user feedback.
-   **Styling Improvements:** Enhance UI/UX with more animations and polished designs.

## License

This project is licensed under the ISC License.