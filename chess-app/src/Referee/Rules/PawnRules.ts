import { TeamType, samePosition } from "../../Constants.ts";
import { Piece, Position } from "../../models/index.ts";
//Temporarily remove PieceType import from Constants.ts
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules.ts";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
    //Movement
    if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === 2*pawnDirection && initialPosition.y === specialRow){
        if(!tileIsOccupied(desiredPosition, boardState) && !tileIsOccupied(new Position(desiredPosition.x, desiredPosition.y - pawnDirection), boardState)){
            return true;
        }
    }else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
        if(!tileIsOccupied(desiredPosition, boardState)){
            return true;
        }
    }
    //Attack
    else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)){
            return true;
        }
    }else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection){
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)){
            return true;
        }
    }
    return false;
}

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] =>{
    const possibleMoves: Position[] = [];
    const specialRow = (pawn.team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (pawn.team === TeamType.OUR) ? 1 : -1;
    const normalMove: Position = new Position(pawn.position.x, pawn.position.y + pawnDirection);
    const specialMove: Position = new Position(pawn.position.x, normalMove.y + pawnDirection);
    const upperLeftAttack: Position = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
    const upperRightAttack: Position = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
    const leftPosition: Position = new Position(pawn.position.x - 1, pawn.position.y);
    const rightPosition: Position = new Position(pawn.position.x + 1, pawn.position.y);

    if(!tileIsOccupied(normalMove, boardState)){
        possibleMoves.push(normalMove);
        if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)){
            possibleMoves.push(specialMove);
        }
    }
    if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)){
        possibleMoves.push(upperLeftAttack);
    }else if(!tileIsOccupied(upperLeftAttack, boardState)){
        const leftPiece = boardState.find(p => samePosition(p.position, leftPosition));
        if(leftPiece != null && leftPiece.enPassant){
            possibleMoves.push(upperLeftAttack);
        }
    }
    if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)){
        possibleMoves.push(upperRightAttack);
    }else if(!tileIsOccupied(upperRightAttack, boardState)){
        const rightPiece = boardState.find(p => samePosition(p.position, rightPosition));
        if(rightPiece != null && rightPiece.enPassant){
            possibleMoves.push(upperRightAttack);
        }
    }

    return possibleMoves;
}