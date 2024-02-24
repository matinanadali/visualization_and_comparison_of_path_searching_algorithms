import './App.css';
import Grid from './Grid';
import FillGrid from './FillGrid';
import { useState, useEffect } from 'react';
import SetPoints from './SetPoints';
import ChooseAlgorithm from './ChooseAlgorithm';
import { BFS, DFS, Astar, BidirectionalSearch } from './algorithms';
import { clearGrid } from './FillGrid';
const algorithms = {
  'BFS': BFS,
  'DFS': DFS,
  'Astar': Astar,
  'BidirectionalBFS' : BidirectionalSearch
};
const emptyCellColor = "#ccc";
const pathCellColor = "#F25F5C";
function App() {
  let rows, columns;

//effect to add event listener on component mount
useEffect(() => {
  window.addEventListener('resize', handleViewportResize);

  //clean up function to remove event listener on component unmount
  return () => {
      window.removeEventListener('resize', handleViewportResize);
  };
}, [handleViewportResize]); 

//state variables for start and target cells
const [start, setStart] = useState(null);
const [target, setTarget] = useState(null);

//canChangeGrid == false when an algorithm is running
const [canChangeGrid, setCanChangeGrid] = useState(true);
//initialize grid to an empty grid
const [grid, setGrid] = useState(
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
);
//set default algorithm choice to BFS
const [algorithm, setAlgorithm] = useState("BFS");

function updateStart(newStart) {
  if (start) {
    updateCellColor(start.row, start.col, emptyCellColor);
  }
  setStart(newStart);
  updateCellColor(newStart.row, newStart.col, pathCellColor);
}
function updateTarget(newTarget) {
  if (target) {
    updateCellColor(target.row, target.col, emptyCellColor);
  }
  setTarget(newTarget);
  updateCellColor(newTarget.row, newTarget.col, pathCellColor);
}
function updateCellColor(row, column, color) {
  const cell = document.getElementById(`row${row}col${column}`);
  cell.style.backgroundImage = `linear-gradient(${color}, ${color})`;
  cell.style.backgroundSize = "100% 100%";
}
async function handlePlayClick() {
  //grid cannot change while algorithm is running
  setCanChangeGrid(false);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j] === 0 && !(i === start.row && j === start.col) && !(i === target.row && j === target.col)) {
        updateCellColor(i, j, emptyCellColor);
      } else if ((i === start.row && j === start.col) || (i === target.row && j === target.col)) {
        updateCellColor(i, j, pathCellColor);
      }
    }
  }
  //call chosen function
  await algorithms[algorithm].call(null, grid, start, target, updateCellColor, handleNoPathFound);
  //enable grid change
  setCanChangeGrid(true);
}

//state variables to get viewport's dimensions and adjust grid size accordingly
const [viewportWidth, setViewportWidth] = useState(window.innerWidth || document.documentElement.clientWidth);
const [viewportHeight, setViewportHeight] = useState(window.innerHeight || document.documentElement.clientHeight);
if (viewportHeight > viewportWidth) {
  rows = 20;
  columns = 20;
} else {
  rows = 20;
  columns = 100;
}

//update viewport dimensions on resize
function handleViewportResize() {
  clearGrid(rows, columns, setGrid,setStart,setTarget)
  setViewportWidth(window.innerWidth || document.documentElement.clientWidth);
  setViewportHeight(window.innerHeight || document.documentElement.clientHeight);
  
  if (viewportHeight > viewportWidth) {
    rows = 50;
    columns = 20;
  } else {
    rows = 20;
    columns = 100;
  }

}
//function to make "impossible" div appear when algorithm return failure
function handleNoPathFound() {
  const impossible = document.querySelector(".impossible");
  impossible.style.backgroundSize = "100% 100%";
}

return (
  <div className="App">
    <div className='steps'>
      
      <FillGrid className="step" rows = {rows} columns =  {columns} updateGrid = {setGrid} updateStart = {setStart} updateTarget = {setTarget} disabled = {!canChangeGrid}/>
      <SetPoints className="step" rows = {rows} columns = {columns} updateStart = {updateStart} updateTarget = {updateTarget} grid = {grid} disabled = {!canChangeGrid}/>
      <ChooseAlgorithm className="step" setAlgorithm = {setAlgorithm} disabled = {!canChangeGrid}/>
      <button className=
      {(start && target && grid) ? "" : "disabled"} 
      disabled = {!(start && target && grid)}
      onClick={handlePlayClick}>Play!</button>
      </div>
      <Grid rows = {rows} columns = {columns} />
      
    <div className = "impossible">No path found!</div>
  </div>
);
}

export default App;
