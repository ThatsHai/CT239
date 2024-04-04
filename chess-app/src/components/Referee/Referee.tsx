import React, { useRef, useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom'
import { initialBoard } from '../../Constants.ts';
import Chessboard from '../Chessboard/Chessboard.tsx';
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove} from "../../Referee/Rules/index.ts";
import { Piece, Position } from "../../models/index.ts";
import { PieceType, TeamType } from '../../Types.ts';
import { Pawn } from '../../models/Pawn.ts';
import { Board } from '../../models/Board.ts';

import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';
const socket = io(SERVER_URL)

export default function Referee(){
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);
    //Update possible move on the first move
    
    const { state } = useLocation();
		const { gameID } = state;
    const [team, setTeam] = useState<TeamType>()

		useEffect(() => {
      if (!team) {
        socket.emit('join', { gameID: gameID }, ({ error, color }) => {
          if (error) console.log(error);
          if (color) setTeam(color === 'w' ? TeamType.OUR : TeamType.OPPONENT)
        });
      }

			socket.on('welcome', ({ message, opponent }) => {
				console.log({ message, opponent });
			});
			socket.on('opponentJoin', ({ message, opponent }) => {
				console.log({ message, myId: socket.id, opponent });
			});

			socket.on('opponentMove', ({ from, to }) => {
				const piece = board.pieces.find((p) => p.position.samePosition(from));
        console.log(piece)
				if (piece) {
          let enPassantMove = false
          const pawnDirection = (piece.team === TeamType.OUR) ? 1 : -1;
          if(piece.type === PieceType.PAWN){
              if((to.x - piece.position.x === -1 || to.x - piece.position.x === 1) && to.y - piece.position.y === pawnDirection){
                  const piece = board.pieces.find((p) => p.position.x === to.x && p.position.y === to.y - pawnDirection && p.isPawn && (p as Pawn).enPassant);
                  if(piece){
                    enPassantMove = true
                  }
              }
          }

					setBoard(() => {
						const clonedBoard = board.clone();
						clonedBoard.totalTurns += 1;

						// Playing the move
						clonedBoard.playMove(enPassantMove, true, piece, to);

						if (clonedBoard.winningTeam !== undefined) {
							checkmateModalRef.current?.classList.remove('hidden');
						}
						return clonedBoard;
					});

          // This is for promoting a pawn
					let promotionRow = piece.team === TeamType.OUR ? 7 : 0;
					if (to.y === promotionRow && piece.isPawn) {
						setPromotionPawn(() => {
							const clonedPlayedPiece = piece.clone();
							clonedPlayedPiece.position = to;
							return clonedPlayedPiece;
						});
					}
				}
			});

			socket.on('message', ({ message }) => {
				console.log({ message });
			});

      socket.on('promotion', (pieceType) => {
        setBoard((previousBoard) => {
          const clonedBoard = board.clone();
          clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
            if(promotionPawn && piece.samePiecePosition(promotionPawn)){
              results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
            }else{
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          clonedBoard.calculateAllMoves();
          return clonedBoard;
          //If stop only return board, React doesn't recognize it as it expect a new obj
          //so it is needed to make a new value
        })
			});
		}, [board, gameID, team, promotionPawn]);

    function pieceMovedAudio() {
      let audio = new Audio("assets/sound/final_chess_move_sound.mp3");
      audio.play()
   }
    function pawnPromotionAudio() {
      let audio = new Audio("assets/sound/promotion.mp3");
      audio.play()
   }
    
    function playMove(playedPiece: Piece, destination: Position): boolean {
      // If the playing piece doesn't have any moves return
      if (playedPiece.possibleMoves === undefined) return false;

      // Prevent the inactive team from playing
      // if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) return false;
      // if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) return false;
      if (playedPiece.team !== team) return false;

      let playedMoveIsValid = false;

      const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

      if (!validMove) return false;

      const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team
      );
      setBoard(() => {
        const clonedBoard = board.clone();
        clonedBoard.totalTurns += 1;

        // send move data
        socket.emit('move', { gameID: gameID, from: playedPiece.position, to: destination });
        // Playing the move
        playedMoveIsValid = clonedBoard.playMove(enPassantMove,
            validMove, playedPiece,
            destination);
        
        if(clonedBoard.winningTeam !== undefined) {
            checkmateModalRef.current?.classList.remove("hidden");
        }
        pieceMovedAudio();
        return clonedBoard;
    })

      // This is for promoting a pawn
      let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

      if (destination.y === promotionRow && playedPiece.isPawn) {
          modalRef.current?.classList.remove("hidden");
          setPromotionPawn((previousPromotionPawn) => {
              const clonedPlayedPiece = playedPiece.clone();
              clonedPlayedPiece.position = destination.clone();
              return clonedPlayedPiece;
          });
      }

      return playedMoveIsValid;
  }
    
  //eslint-disable-next-line
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
      let validMove = false;
      switch(type){
          case PieceType.PAWN:
              validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
              break;
          case PieceType.KNIGHT:
              validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
              break;
          case PieceType.BISHOP:
              validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
              break;
          case PieceType.ROOK:
              validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
              break;
          case PieceType.QUEEN:
              validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
              break;
          case PieceType.KING:
              validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
              break;
      }
      return validMove;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
      const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
      if(type === PieceType.PAWN){
          if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
              const piece = board.pieces.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.isPawn && (p as Pawn).enPassant);
              if(piece){
                  return true;
              }
          }
      }
      return false;
    }

    function promotePawn(pieceType: PieceType){
      if(promotionPawn === undefined){
        return;
      }
      setBoard((previousBoard) => {
        const clonedBoard = board.clone();
        clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
          if(piece.samePiecePosition(promotionPawn)){
            socket.emit('promotion', { pieceType, gameID });

            results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
          }else{
            results.push(piece);
          }
          return results;
        }, [] as Piece[]);
        clonedBoard.calculateAllMoves();
        pawnPromotionAudio();
        return clonedBoard;
        //If stop only return board, React doesn't recognize it as it expect a new obj
        //so it is needed to make a new value
      })
  
      modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType(){
      return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }
    
    function restartGame(){
      checkmateModalRef.current?.classList.add("hidden");
      setBoard(initialBoard.clone());
    }
    
    return(
    <>
        <p style={{color: "white", fontSize: "24px", textAlign: "center"}}>
          Total turns: {board.totalTurns}
        </p>
        <div className='modal hidden' ref={modalRef}>
            <div className="modal-body"> 
                {/* modal-body is used to prevent user from selecting the background pieces */}
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} alt=''/>
            </div>
        </div>
        <div className='modal hidden' ref={checkmateModalRef}>
          <div className='modal-body'>
            <div className='checkmate-body'>
              <span>The winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}</span>
              <button onClick={restartGame}>Play again</button>
            </div>
          </div>
        </div>
        <Chessboard playMove={playMove} pieces={board.pieces} team={team} totalTurns={board.totalTurns}/>
    </>)
}