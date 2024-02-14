import { PieceType, TeamType, Piece } from "../Chessboard/Chessboard.tsx";

export default class Referee{
    titleIsOccupied(x: number, y: number, boardState: Piece[]): boolean{
        const piece = boardState.find(p => p.x === x && p.y === y)
        if(piece){
            return true;
        }else{
            return false;
        }
    }
    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team)
        if(piece){
            return true;
        }else{
            return false;
        }
    }

    isEnPassantMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;;
        if(type === PieceType.PAWN){
            if((x - px === -1 || x - px === 1) && y - py === pawnDirection){
                
            }
        }
        const piece = boardState.find((p) => p.x === x && p.y === y + pawnDirection);
        return false;
    }
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        console.log("Checking");
        console.log(`Previous location: (${px}, ${py})`)
        console.log(`New location: (${x}, ${y})`)
        console.log(`Piece type: (${type})`)
        console.log(`Piece type: (${team})`)

        if(type === PieceType.PAWN){
            
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
            //Movement
            if(px === x && y - py === 2*pawnDirection && py === specialRow){
                if(!this.titleIsOccupied(x, y, boardState) && !this.titleIsOccupied(x, y - pawnDirection, boardState)){
                    return true;
                }
            }else if(px === x && y - py === pawnDirection){
                if(!this.titleIsOccupied(x, y, boardState)){
                    return true;
                }
            }
            //Attack
            else if(x - px === -1 && y - py === pawnDirection){
                if(this.tileIsOccupiedByOpponent(x, y, boardState, team)){
                    return true;
                }
            }else if(x - px === 1 && y - py === pawnDirection){
                if(this.tileIsOccupiedByOpponent(x, y, boardState, team)){
                    return true;
                }
            }
        }
        
        return false;
    }
}