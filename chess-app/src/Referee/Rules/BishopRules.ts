import {  TeamType, samePosition } from "../../Constants.ts";
import { Piece, Position } from "../../models/index.ts";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules.ts";

export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
    //Movement
    for(let i = 1; i < 8; i++){
        //Up-right
        if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y){
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y + i);
            if(samePosition(passedPosition, desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }
        //Down-right
        if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y){
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y - i);
            if(samePosition(passedPosition, desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }
        //Up-left
        if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y){
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y + i);
            if(samePosition(passedPosition, desiredPosition)){
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)){
                    return true;
                }
            }else{
                if(tileIsOccupied(passedPosition, boardState)){
                    break;
                }
            }
        }
        //Down-left
        if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y){
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y - i);
            if(samePosition(passedPosition, desiredPosition)){
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

export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    //Up-right
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x + i, bishop.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down-right
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x + i, bishop.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Down-left
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y - i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    //Top-left
    for(let i = 1; i < 8; i++){
        const destination = new Position(bishop.position.x - i, bishop.position.y + i);
        if(!tileIsOccupied(destination, boardState)){
            possibleMoves.push(destination);
        }else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        }else{
            break;
        }
    }
    return possibleMoves;
}
