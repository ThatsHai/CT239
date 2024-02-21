import React from 'react';
import "./Tile.css";
// 9:44
interface Props {
  image?: string;
  number: number;
  highlight: boolean;
}

export default function Tile({ number, image, highlight }: Props) {
  const className: string = ["tile", number % 2 === 0 && "black-tile", number % 2 !== 0 && "white-tile", highlight && "tile-highlight", image && "chess-piece-tile"].filter(Boolean).join(' ');

  return (
    <div className={className}>
      {/* render image only if the tile is not null */}
      {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece'></div>}
    </div>
  );
}
