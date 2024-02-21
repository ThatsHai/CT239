import React, { useEffect, useRef, useState } from 'react';
import { PieceType, TeamType, initialBoardState, samePosition } from '../../Constants.ts';
import Chessboard from '../Chessboard/Chessboard.tsx';
import { getPossiblePawnMoves, bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove, getPossibleKnightMoves, getPossibleBishopMoves, getPossibleRookMoves, getPossibleQueenMoves, getPossibleKingMoves } from "../../Referee/Rules/index.ts";
import { Piece, Position } from "../../models/index.ts";

export default function Referee(){
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    //Update possible move on the first move
    useEffect(() =>{
        updatePossibleMoves();
    });
    // }, []); Change to this line in case of error;


    function updatePossibleMoves(){
        setPieces((currentPieces) =>{
            return currentPieces.map(p =>{
              p.possibleMoves = getValidMove(p, currentPieces);
              return p;
            });
        });
    }

    function playMove(playedPiece: Piece, destination: Position): boolean{
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        const pawnDirection = (playedPiece.team === TeamType.OUR) ? 1 : -1;;
        if(enPassantMove){
          const updatedPieces = pieces.reduce((results, piece) => {
            if(samePosition(piece.position, playedPiece.position)){
              piece.enPassant = Math.abs(destination.y - 2) === 2 && piece.type === PieceType.PAWN; 
            //   In case doesn't work, change piece.type to playedPiece.type
              piece.position.x = destination.x;
              piece.position.y = destination.y;
              results.push(piece);
            }else if(!(samePosition(piece.position, new Position(destination.x, destination.y - pawnDirection)))){
              if(piece.type === PieceType.PAWN){
                piece.enPassant = false;
              }
              results.push(piece); 
            }
            return results;
          }, [] as Piece[]);
          updatePossibleMoves();
          setPieces(updatedPieces);
        }else if(validMove){

          //Update position and remove piece
          const updatedPieces = pieces.reduce((results, piece) =>{
            if(samePosition(piece.position, playedPiece.position)){
              if(Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN){
                //EnPassant check
                piece.enPassant = true;
              }else{
                piece.enPassant = false;
              }
              piece.position.x = destination.x;
              piece.position.y = destination.y;
              results.push(piece);

              let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;
              if(destination.y === promotionRow && piece.type === PieceType.PAWN){
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }

            }else if(!samePosition(piece.position, new Position(destination.x, destination.y))){
              if(piece.type === PieceType.PAWN){
                piece.enPassant = false;
              }
              results.push(piece);
            }
            

            return results;
          }, [] as Piece[]);
          updatePossibleMoves();
          setPieces(updatedPieces);

        }else{
          //Reset piece position
          return false;
        }
        return true;
    }

    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        let validMove = false;
        switch(type){
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, pieces);
                break;
        }
        return validMove;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType){
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
        if(type === PieceType.PAWN){
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = pieces.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant);
                if(piece){
                    return true;
                }
            }
        }
        return false;
    }
    
    function getValidMove(piece: Piece, boardState: Piece[]): Position[]{
        switch(piece.type){
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    function promotePawn(pieceType: PieceType){
        if(promotionPawn === undefined){
          return;
        }
        const updatedPieces = pieces.reduce((results, piece) => {
          if(samePosition(piece.position, promotionPawn.position)){
            piece.type = pieceType;
            const teamType = (piece.team === TeamType.OUR) ? "w" : "b";
            let image = "";
            switch(pieceType){
              case PieceType.ROOK: {
                image = "rook";
                break;
              }
              case PieceType.BISHOP: {
                image = "bishop";
                break;
              }
              case PieceType.KNIGHT: {
                image = "knight";
                break;
              }
              case PieceType.QUEEN: {
                image = "queen";
                break;
              }
            }
            piece.image = `assets/images/${image}_${teamType}.png`;
          }
          results.push(piece);
          return results;
        }, [] as Piece[])
        updatePossibleMoves();
        setPieces(updatedPieces);
    
        modalRef.current?.classList.add("hidden");
      }

      function promotionTeamType(){
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
      }
    
    
    return(
    <>
        <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
            <div className="modal-body"> 
                {/* modal-body is used to prevent user from selecting the background pieces */}
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} alt=''/>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} alt=''/>
            </div>
        </div>
        <Chessboard playMove={playMove} pieces={pieces}/>
    </>)
}