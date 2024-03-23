const games = {};

class Player {
	constructor(playerID, gameID, color) {
		this.playerID = playerID;
		this.gameID = gameID;
		this.color = color;
	}
}

const addPlayer = ({ gameID, playerID }) => {
	if (!games[gameID]) {
		const player = new Player(playerID, gameID, 'w');
		games[gameID] = [player];
		return {
			message: 'Joined successfully',
			opponent: null,
			player,
		};
	}

	if (games[gameID].length >= 2) {
		return { error: 'This game is full' };
	}

	const player = new Player(playerID, gameID, 'b');
	games[gameID].push(player);

	return {
		message: 'Added successfully',
		opponent: games[gameID][0],
		player,
	};
};

const game = (id) => games[id];

const removePlayer = (playerID) => {
	for (const game in games) {
		let players = games[game];
		const index = players.findIndex((pl) => pl.playerID === playerID);

		if (index !== -1) {
			return players.splice(index, 1)[0];
		}
	}
};

module.exports = {
    addPlayer,
    game,
    removePlayer,
};
