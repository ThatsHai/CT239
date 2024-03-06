import { TeamType } from "../../Types.ts";
import { Piece, Position } from "../../models/index.ts";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules.ts";

export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    if(initialPosition.x === desiredPosition.x){
        for(let i = 1; i < 8; i++){
            let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;

            let passedPosition: Position = new Position(initialPosition.x, initialPosition.y + (i*multiplier));
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }
    }
    if(initialPosition.y === desiredPosition.y){
        for(let i = 1; i < 8; i++){
            let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

            let passedPosition: Position = new Position(initialPosition.x + (i*multiplier), initialPosition.y);
            if(passedPosition.samePosition(desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }
    }
return false;
}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves : Position[] = [];
    //Up
    for(let i = 1; i < 8; i++){
        //Check to sure that rook doesn't move outside the board
        if(rook.position.y + i > 7) break;
        //
        const destination: Position = new Position(rook.position.x, rook.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down
    for(let i = 1; i < 8; i++){
        //Check to sure that rook doesn't move outside the board
        if(rook.position.y - i < 0) break;
        //
        const destination: Position = new Position(rook.position.x, rook.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Left
    for(let i = 1; i < 8; i++){
        //Check to sure that rook doesn't move outside the board
        if(rook.position.x - i < 0) break;
        //
        const destination: Position = new Position(rook.position.x - i, rook.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Right
    for(let i = 1; i < 8; i++){
        //Check to sure that rook doesn't move outside the board
        if(rook.position.x + i > 7) break;
        //
        const destination: Position = new Position(rook.position.x + i, rook.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return possibleMoves;
}