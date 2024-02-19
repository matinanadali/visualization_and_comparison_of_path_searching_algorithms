import React, { useEffect, useState } from 'react';
import './Grid.css';
const Grid = (props) => {
  const { rows, columns } = props;
  const [cellStyle, setCellStyle] = useState({});

  useEffect(() => {
    const grid = document.querySelector(".grid-container");
      const width = grid.getBoundingClientRect().width;
      console.log(width)
      const style = {
        width: `${width / columns}px`,
        height: `${width / columns}px`
      };
      setCellStyle(style);
  }, [rows, columns]);

  // Generate an array of indices for rows and columns
  const rowIndices = Array.from({ length: rows }, (_, index) => index);
  const columnIndices = Array.from({ length: columns }, (_, index) => index);

  return (
    <div className="grid-container">
      {rowIndices.map((rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {columnIndices.map((columnIndex) => (
            <div key={columnIndex} id={`row${rowIndex}col${columnIndex}`} className="grid-cell" style = {cellStyle}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
