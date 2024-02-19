import './App.css';
import Grid from './Grid';
import FillGrid from './FillGrid';
import { useState } from 'react';
import SetPoints from './SetPoints';
import ChooseAlgorithm from './ChooseAlgorithm';
import { BFS, DFS, Astar, BidirectionalSearch } from './algorithms';
const algorithms = {
  'BFS': BFS,
  'DFS': DFS,
  'Astar': Astar,
  'BidirectionalBFS' : BidirectionalSearch
};
const emptyCellColor = "#ccc";
const wallCellColor = "#50514F";
const visitedCell = "#FFE066";
const activeCell = "#66ff66";
const pathCell = "#F25F5C";
function App() {
  const rows = 20;
  const columns = 100;
  const [start, setStart] = useState(null);
  const [target, setTarget] = useState(null);
  const [canChangeGrid, setCanChangeGrid] = useState(true);
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0))
  );
  const [algorithm, setAlgorithm] = useState("BFS");
  function updateStart(newStart) {
    if (start) {
      updateCellColor(start.row, start.col, emptyCellColor);
    }
    setStart(newStart);
    updateCellColor(newStart.row, newStart.col, pathCell);
  }
  function updateTarget(newTarget) {
    if (target) {
      updateCellColor(target.row, target.col. emptyCellColor);
    }
    setTarget(newTarget);
    updateCellColor(newTarget.row, newTarget.col, pathCell);
  }
  function updateCellColor(row, column, color) {
    const cell = document.getElementById(`row${row}col${column}`);
    cell.style.backgroundImage = `linear-gradient(${color}, ${color})`;
    cell.style.backgroundSize = "100% 100%";
  }
  async function handlePlayClick() {
    setCanChangeGrid(false);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cell = document.getElementById(`row${i}col${j}`);
        if (grid[i][j] === 0 && !(i === start.row && j === start.col) && !(i === target.row && j === target.col)) {
          updateCellColor(i, j, emptyCellColor);
        } else if ((i === start.row && j === start.col) || (i === target.row && j === target.col)) {
          updateCellColor(i, j, pathCell);
        }
      }
    }
    await algorithms[algorithm].call(null, grid, start, target, updateCellColor);
    setCanChangeGrid(true);
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
    </div>
  );
}

export default App;
