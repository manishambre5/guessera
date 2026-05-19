import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type { Player, PartySettings as Party } from "@guessera/types";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Open for LAN testing
    methods: ["GET", "POST"]
  }
});

// In-memory data store for live party rooms
const parties: Record<string, Party> = {};

// Helper to generate a unique 4-character party room code
const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

// CENTRALIZED EXIT HANDLER (for both Disconnects and Manual exits)
const handlePlayerLeave = (socketId: string, io: any) => {
  for (const code in parties) {
    const party = parties[code];
    const playerIndex = party.players.findIndex(p => p.id === socketId);

    if (playerIndex !== -1) {
      const removedPlayer = party.players[playerIndex];
      party.players.splice(playerIndex, 1); // Remove from tracking array

      console.log(`Removed ${removedPlayer.name} from room ${code}.`);

      // Case A: Delete Room if empty
      if (party.players.length === 0) {
        delete parties[code];
        console.log(`Room ${code} deleted because it is empty.`);
      } 
      // Case B: Room not empty
      else {
        // Promote next player in line to host if the host exits the room
        if (removedPlayer.isHost) {
          party.players[0].isHost = true;
          party.hostName = party.players[0].name;
          console.log(`Host left room ${code}. Promoted ${party.players[0].name} to Host.`);
        }        
        // Notify everyone else in the room
        io.to(code).emit("party_updated", party);
      }
      break;
    }
  }
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // CREATE PARTY
  socket.on("create_party", ({ hostName, partyName }: { hostName: string; partyName: string }) => {
    const partyCode = generateRoomCode();
    
    const hostPlayer: Player = { 
      id: socket.id, 
      name: hostName, 
      isHost: true, 
      score: 0,
      isPlaying: false,
      guesses: []
    };

    const newParty: Party = {
      partyCode,
      partyName,
      hostName,
      players: [hostPlayer],
      gameStarted: false
    };

    parties[partyCode] = newParty;
    socket.join(partyCode);
    
    console.log(`Party created: ${partyCode} by ${hostName}`);
    socket.emit("party_created", newParty);
  });

  // JOIN PARTY
  socket.on("join_party", ({ partyCode, playerName }: { partyCode: string; playerName: string }) => {
    const code = partyCode.toUpperCase();
    const party = parties[code];

    if (!party) {
      socket.emit("error_message", "Can't find Party! Double check your code.");
      return;
    }

    if (party.gameStarted) {
      socket.emit("error_message", "This party is in the midst of a game! Please try later. Or after the developer has added spectator support.");
      return;
    }

    const guestPlayer: Player = {
      id: socket.id,
      name: playerName,
      isHost: false,
      score: 0,
      isPlaying: false,
      guesses: []
    };

    party.players.push(guestPlayer);
    socket.join(code);

    console.log(`Player ${playerName} joined party ${code}`);
    io.to(code).emit("party_updated", party);
  });

  // START GAME
  socket.on("start_game", ({ partyCode, settings }) => {
    const code = partyCode.toUpperCase();
    const party = parties[code];

    if (party) {
      // Prevent new players from joining an ongoing game
      party.gameStarted = true;

      // Flag all player in the room into active gameplay state
      party.players.forEach((player) => {
        player.isPlaying = true;
        player.score = 0; // Reset any old scores
      });

      console.log(`Starting a multiplayer game for room: ${code}`);

      // Tell everyone in the room
      io.to(code).emit("game_started", settings);
    }
  })

  // SCORE SUBMISSION
  socket.on("submit_score", ({ partyCode, report }) => {
    const code = partyCode.toUpperCase();
    const party = parties[code];

    if (!party) return;

    // find the player who just submitted their score
    const player = party.players.find(p => p.id === socket.id);
    if (player) {
      player.score = report.finalScore;
      player.guesses = report.roundGuessDetails;
      player.isPlaying = false;
      console.log(`Player ${player.name} from party room ${code} has finished and submitted report.`);
    }

    // check if everyone else has finished their round
    const allFinished = party.players.every(p => !p.isPlaying);

    if (allFinished) {
      console.log(`All players in party room ${code} have finished the round. Generating final leaderboard report...`);

      const finalLeaderboard = [...party.players].sort((a, b) => b.score - a.score);

      // broadcast the final leaderboard standings to the entire room simultaneously
      io.to(code).emit("game_over_leaderboard", finalLeaderboard);
    }
  })

  // MANUAL EXIT PARTY ROOM
  socket.on("leave_party", () => {
    console.log(`Manual leave triggered by client: ${socket.id}`);
    
    // Process list tracking removal of player
    handlePlayerLeave(socket.id, io);

    // Converting the socket.rooms Set into an Array before unlinking channel
    const activeRooms = Array.from(socket.rooms);
    activeRooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`Socket ${socket.id} safely left channel: ${room}`);
      }
    });
  });

  // UNINTENTIONAL DISCONNECT & ROOM CLEANUP
  socket.on("disconnect", () => {
    console.log(`User disconnected naturally: ${socket.id}`);
    handlePlayerLeave(socket.id, io);
  });
});




const PORT = 3001;
httpServer.listen(PORT, "0.0.0.0" , () => {
  console.log(`Server running and listening on all interfaces on port ${PORT}`);
});