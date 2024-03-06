import { PieceType, TeamType } from "../Types.ts";
import { Piece } from "./Pieces.ts";
import { Position } from "./Position.ts";

export class Pawn extends Piece{
    enPassant: boolean;
    constructor(position: Position, team: TeamType, hasMoved: boolean, enPassant: boolean, possibleMoves: Position[] = []){
        super(position, PieceType.PAWN, team, hasMoved, possibleMoves);
        this.enPassant = enPassant;
    }
    clone(): Pawn {
        return new Pawn(this.position.clone(),
         this.team, this.hasMoved, this.enPassant, this.possibleMoves?.map(m => m.clone()))
    }
}