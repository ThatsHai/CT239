import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Chessboard from "./components/Chessboard/Chessboard.tsx";
import Referee from './components/Referee/Referee.tsx';
import Home from './components/Home/Home.tsx';

function App() {
	return (
		<div id="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/game" element={<Referee />} />
				</Routes>
			</BrowserRouter>
			{/* <Chessboard/> */}
		</div>
	);
}

export default App;
