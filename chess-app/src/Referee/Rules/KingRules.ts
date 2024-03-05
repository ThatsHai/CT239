import { TeamType } from "../../Types.ts";
import { Piece, Position } from "../../models/index.ts";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules.ts";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    for(let i = 1; i < 2; i++){
        
        let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
        let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;
        let passedPosition: Position = new Position(initialPosition.x + (i * multiplierX), initialPosition.y + (i * multiplierY))

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
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves : Position[] = [];
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x, king.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x, king.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Left
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x - i, king.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Right
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x + i, king.position.y);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Up-right
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x + i, king.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down-right
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x + i, king.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down-left
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x - i, king.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Top-left
    for(let i = 1; i < 2; i++){
        const destination: Position = new Position(king.position.x - i, king.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, king.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return possibleMoves;
}