function outOfBounds(rows, columns, row, column) {
    return row >= rows || column >= columns || row < 0 || column < 0;
}
const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const dr = [-1,1,0,0];
const dc = [0,0,1,-1];
const visitedCell = "#FFE066";
const activeCell = "#66ff66";
const pathCell = "#F25F5C";
const delayTime = 10;
async function reconstructPath(parent, start, target, updateCellColor) {
    let row = parent[target.row][target.col][0];
    let col = parent[target.row][target.col][1];
    while (!(row === start.row && col === start.col)) {
        updateCellColor(row, col, pathCell);
        const nextRow = parent[row][col][0];
        const nextCol = parent[row][col][1];
        row = nextRow;
        col = nextCol;
        await delay(delayTime);
    }
    updateCellColor(start.row, start.col, pathCell);
}
async function reconstructBidirectionalPath(sParent, tParent, start, intersection, target, updateCellColor) {
    const path = [];
    path.push([intersection.row, intersection.col]);
    let row = intersection.row;
    let col = intersection.col;
    while (!(row === target.row && col === target.col)) {
        const newRow = tParent[row][col][0];
        const newCol = tParent[row][col][1];
        path.push([newRow, newCol]);
        row = newRow;
        col = newCol;
    }
    
  
    path.reverse();
    row = intersection.row;
    col = intersection.col;
    while (!(row === start.row && col === start.col)) {
        const newRow = sParent[row][col][0];
        const newCol = sParent[row][col][1];
        path.push([newRow, newCol]);
        row = newRow;
        col = newCol;
    }
    for (let i = 0; i < path.length; i++) {
        updateCellColor(path[i][0], path[i][1], pathCell);
        await delay(delayTime);
    } 
    
}
export async function BFS(grid, start, target,updateCellColor) {
    const rows = grid.length;
    const columns = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
    const parent = Array.from({ length: rows }, () => Array.from({ length: columns }, () => -1));
    visited[start.row][start.col] = true;
    const q = [];
    q.push([start.row, start.col]);
    updateCellColor(start.row, start.col, activeCell);
    let reachedTarget = false;
    while (q.length !== 0) {
        const currentCell = q[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        q.shift();
        
        updateCellColor(currentRow, currentCol, visitedCell);
        if (currentRow === target.row && currentCol === target.col) {
            reachedTarget = true;
            break;
        }
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + dr[i];
            const newCol = currentCol + dc[i];
    
            if (outOfBounds(rows, columns, newRow, newCol) || visited[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            visited[newRow][newCol] = true;
            updateCellColor(newRow, newCol, activeCell);
            await delay(delayTime);
            parent[newRow][newCol] = [currentRow, currentCol];
            q.push([newRow, newCol]);
        }
    }
    if (reachedTarget) {
       reconstructPath(parent, start, target, updateCellColor);
    }
}
export async function DFS(grid, start, target, updateCellColor) {
    const rows = grid.length;
    const columns = grid[0].length;
    
    const visited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
    const parent = Array.from({ length: rows }, () => Array.from({ length: columns }, () => -1));
    visited[start.row][start.col] = false;
    const stack = [];
    stack.push([start.row, start.col]);
    updateCellColor(start.row, start.col, activeCell);
    let reachedTarget = false;
    while (stack.length !== 0) {
        const currentCell = stack[stack.length-1];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        stack.pop();
  
        updateCellColor(currentRow, currentCol, visitedCell);
        
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + dr[i];
            const newCol = currentCol + dc[i];
    
            if (outOfBounds(rows, columns, newRow, newCol) || visited[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            visited[newRow][newCol] = true;
            updateCellColor(newRow, newCol, activeCell);
            await delay(delayTime);
            parent[newRow][newCol] = [currentRow, currentCol];
            if (newRow === target.row && newCol === target.col) {
                reachedTarget = true;
                break;
            }
            stack.push([newRow, newCol]);
        }
        if (reachedTarget) break;
    }
    if (reachedTarget) {
       reconstructPath(parent, start, target, updateCellColor);
    }
}

function getHValue(target, row, col) {
    return Math.abs(target.row - row) + Math.abs(target.col - col);
}
export async function Astar(grid, start, target, updateCellColor) {
    const rows = grid.length;
    const columns = grid[0].length;
    const closedList = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
    const cellDetails = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
        f: Infinity,
        g: Infinity,
        h: 0
    }))
);

    const parent = Array.from({ length: rows }, () => Array.from({ length: columns }, () => -1));

    let i, j;
 
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            cellDetails[i][j].h = getHValue(target, i, j);
        }
    }
  
    i = start.row
    j = start.col;
    cellDetails[i][j].f = 0;
    cellDetails[i][j].g = 0;
    cellDetails[i][j].h = 0;
    let reachedTarget = false;
    const openList = [];
    openList.push([i, j, 0]);
    updateCellColor(start.row, start.col, activeCell);
    while (openList.length !== 0) {
        const currentCell = openList[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        openList.shift();
        closedList[currentRow][currentCol] = true;
        updateCellColor(currentRow, currentCol, visitedCell);
        for (let i = 0; i < 4; i++) {
            let newRow = currentRow + dr[i];
            let newCol = currentCol + dc[i];
            if (outOfBounds(rows, columns, newRow, newCol) || closedList[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            if (newRow === target.row && newCol === target.col) {
                parent[newRow][newCol] = [currentRow, currentCol];
                reachedTarget = true;
                break;
            }
            
            let newG = cellDetails[currentRow][currentCol].g + 1;
            let newF = newG + cellDetails[newRow][newCol].h;
            if (newF < cellDetails[newRow][newCol].f) {
                openList.push([newRow, newCol, newF]);
                updateCellColor(currentRow, currentCol, activeCell);
            await delay(delayTime);
                cellDetails[newRow][newCol].f = newF;
                cellDetails[newRow][newCol].g = newG;
                parent[newRow][newCol] = [currentRow, currentCol];
                
            }
            
        }

        if (reachedTarget) {
            break;
        } else {
            openList.sort((a, b) => a[2] - b[2]);
        }
    }
    if (reachedTarget) {
        reconstructPath(parent, start, target, updateCellColor);
    }
}
export async function BidirectionalSearch(grid, start, target, updateCellColor) {
    const rows = grid.length;
    const columns = grid[0].length;
    let foundPath = false;
    let intersection = {};
    async function BFSTraversal(q, visited, visitedOtherDirection, parent) {
        const currentCell = q[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        q.shift();
        
        updateCellColor(currentRow, currentCol, visitedCell);
        if (visitedOtherDirection[currentRow][currentCol]) {
            foundPath = true;
            intersection.row = currentRow;
            intersection.col = currentCol;
            return;
        }
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + dr[i];
            const newCol = currentCol + dc[i];
    
            if (outOfBounds(rows, columns, newRow, newCol) || visited[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            visited[newRow][newCol] = true;
            updateCellColor(newRow, newCol, activeCell);
            await delay(delayTime);
            parent[newRow][newCol] = [currentRow, currentCol];
            q.push([newRow, newCol]);
        }
    }

    async function Search() {
        const sVisited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
        const tVisited = Array.from({ length: rows }, () => Array.from({ length: columns }, () => false));
        const sParent = Array.from({ length: rows }, () => Array.from({ length: columns }, () => -1));
        const tParent = Array.from({ length: rows }, () => Array.from({ length: columns }, () => -1));
        const sQueue = [];
        const tQueue = [];

        sQueue.push([start.row, start.col]);
        sVisited[start.row][start.col] = true;
        sParent[start.row][start.col] = [-1, -1];

        tQueue.push([target.row, target.col]);
        tVisited[target.row][target.col] = true;
        tParent[target.row][target.col] = [-1, -1];

        

        while (tQueue.length > 0 && sQueue.length > 0) {
            await BFSTraversal(sQueue, sVisited, tVisited, sParent);
            if (foundPath) break;
            await BFSTraversal(tQueue, tVisited, sVisited, tParent);
            if (foundPath) break;
        }
        if (foundPath) {
            //reconstructPath(sParent, start, intersection, updateCellColor);
            reconstructBidirectionalPath(sParent, tParent, start, intersection, target, updateCellColor);
        }
    }
    Search();
}
export async function BidirectionalSearchAStart(grid, start, target, updateCellColor) {
    
}