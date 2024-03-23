import './Home.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const navigate = useNavigate();
	const [id, setId] = useState('');
	const [choice, setChoice] = useState('');

	useEffect(() => {
		const roomID = Date.now().toFixed(0);
		setId(roomID);
	}, [id]);

	const handlePlayGame = () => {
		navigate('/game', { state: { id } });
	};

	const handleCopyID = () => {
		navigator.clipboard.writeText(id);
		alert(`Copied ID: ${id}`);
	};

	const createRoom = () => {
		setChoice('create');
	};

	const joinRoom = () => {
		setChoice('join');
	};

	return (
		<>
			<h1 className="title">Chess Game</h1>
			<div
				style={{
					display: choice === '' ? 'block' : 'none',
				}}
			>
				<button onClick={createRoom}>Create room</button>
				<button onClick={joinRoom}>Join room</button>
			</div>
			<div
				className="create-room"
				style={{
					display: choice === 'create' ? 'flex' : 'none',
				}}
			>
				<div>
					<label htmlFor="link">Your room ID: </label>
					<input readOnly={true} type="text" name="link" id="link" value={id} />
					<input type="button" value="Copy" onClick={handleCopyID} />
				</div>
				<button onClick={handlePlayGame}>Play Game</button>
			</div>

			<div
				className="join-room"
				style={{
					display: choice === 'join' ? 'flex' : 'none',
				}}
			>
				<div>
					<label htmlFor="join-id">Type room ID: </label>
					<input type="text" name="join-id" id="join-id" />
				</div>
				<button onClick={handlePlayGame}>Play Game</button>
			</div>
		</>
	);
}
