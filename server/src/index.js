const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const cors = require('cors');
const { addPlayer, game, removePlayer } = require('./game');

const app = express();
app.use(cors());

const PORT = 5000;
const server = http.createServer(app);
const io = new socketio.Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	socket.on('join', ({ gameID }, callback) => {
		const { error, player, opponent } = addPlayer({
			gameID,
			playerID: socket.id,
		});
		console.log(`Player connected: ${socket.id}`);
		if (error) {
			return callback({ error });
		}
		socket.join(gameID);
		callback({ color: player.color });

		socket.emit('welcome', {
			message: `Welcome to the game`,
			opponent,
		});

		// Tell player2 that player1 has joined the game.
		socket.broadcast.to(player.gameID).emit('opponentJoin', {
			message: `Opponent has joined the game.`,
			opponent: player,
		});

		if (game(gameID).length >= 2) {
			io.to(gameID).emit('message', {
				message: `Let's start the game. ${
					game(gameID)[0].playerID
				} player goes first`,
			});
		}
	});

	socket.on('move', ({ from, to, gameID }) => {
		console.log({ from, to });
		socket.broadcast.to(gameID).emit('opponentMove', { from, to });
	});

	socket.on('promotion', ({ pieceType, gameID }) => {
		socket.broadcast.to(gameID).emit('promotion', pieceType);
	});

	socket.on('disconnect', () => {
		const player = removePlayer(socket.id);

		if (player) {
			io.to(player.game).emit('message', {
				message: `Player with ID: ${socket.id} has left the game.`,
			});
			socket.broadcast.to(player.game).emit('opponentLeft');
		}
	});
});

server.listen(PORT, () => console.log('Server running on port ' + PORT));
