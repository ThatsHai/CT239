import React, { useRef, useState } from 'react';

import Tile from "../Tile/Tile.tsx";
import "./Chessboard.css";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from '../../Constants.ts';
import { Piece, Position } from "../../models/index.ts";
import { TeamType } from '../../Types.ts';

interface Props{
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
  team: TeamType | undefined;
  totalTurns: number;
}

export default function Chessboard({playMove, pieces, team, totalTurns}: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const chessboardRef = useRef<HTMLDivElement>(null);


  function grabPiece(e: React.MouseEvent){  
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if(element.classList.contains("chess-piece") && chessboard){
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
      
      const pos = new Position(grabX, grabY)
      let currentPiece = pieces.find(p => p.samePosition(pos));
      if (currentPiece) {
        if (team === TeamType.OUR && totalTurns % 2 !== 1) return;
        if (team === TeamType.OPPONENT && totalTurns % 2 !== 0) return;
      }
      setGrabPosition(pos);

      // setGrabPosition(new Position(grabX, grabY));
      // Resolve image offset
      const x = e.clientX - GRID_SIZE/2;
      const y = e.clientY - GRID_SIZE/2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent){
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard){
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      //Constraint keeping the pieces on the board 
      if(x < minX){
        activePiece.style.left = `${minX}px`;
      }else if(x > maxX){
        activePiece.style.left = `${maxX}px`;
      }else{
        activePiece.style.left = `${x}px`
      }

      if(y < minY){
        activePiece.style.top = `${minY}px`;
      }else if(y > maxY){
        activePiece.style.top = `${maxY}px`;
      }else{
        activePiece.style.top = `${y}px`
      }
    }
  }

  function dropPiece(e: React.MouseEvent){
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard){
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)); //-800 to revert the mouse to correctly render from the bottom left up
     
      const currentPiece = pieces.find(p => p.samePosition(grabPosition));
      if(currentPiece){
        var success = playMove(currentPiece.clone(), new Position(x, y));
        
        if(!success){
          activePiece.style.position = 'relative';
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }
      setActivePiece(null);
    }
  }


  //type PieceImage = NonNullable<Piece['image']>;
  let board: JSX.Element[] = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
          const number = j + i + 2;
          const piece = pieces.find(p => p.samePosition(new Position(i, j)));
          let image = piece ? piece.image : undefined;

          //If let go of the piece, the move preview of the piece will be gone
          let currentPiece = activePiece != null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
          let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;

          board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight}/>);
      }
    }
  
    return (
    <>
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
        >
          {board}
      </div>
    </>
    );
  }