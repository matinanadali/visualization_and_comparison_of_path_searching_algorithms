function outOfBounds(rows, columns, row, column) {
    return row >= rows || column >= columns || row < 0 || column < 0;
}
const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
//4 directions [UP, DOWN, RIGHT, LEFT]
const dr = [-1, 1, 0, 0];
const dc = [0, 0, 1, -1];

//colors corresponding to different cell states
const visitedCell = "#FFE066";
const activeCell = "#66ff66";
const pathCell = "#F25F5C";

//delay between each visit of a new cell in milliseconds
const delayTime = 10;

//function to display path from source to target after one-directional searches
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
//function to display path from source to target after bidirectional searches
async function reconstructBidirectionalPath(sParent, tParent, start, intersection, target, updateCellColor) {
    const path = [];
    path.push([intersection.row, intersection.col]);
    let row = intersection.row;
    let col = intersection.col;
    //fill path from intersection to target
    while (!(row === target.row && col === target.col)) {
        const newRow = tParent[row][col][0];
        const newCol = tParent[row][col][1];
        path.push([newRow, newCol]);
        row = newRow;
        col = newCol;
    }
    //reverse path so that it is directed from target to intersection
    path.reverse();
    row = intersection.row;
    col = intersection.col;
    //fill path from intersection to source
    while (!(row === start.row && col === start.col)) {
        const newRow = sParent[row][col][0];
        const newCol = sParent[row][col][1];
        path.push([newRow, newCol]);
        row = newRow;
        col = newCol;
    }
    //display path
    for (let i = 0; i < path.length; i++) {
        updateCellColor(path[i][0], path[i][1], pathCell);
        await delay(delayTime);
    }

}
export async function BFS(grid, start, target, updateCellColor, handleNoPathFound) {
    const rows = grid.length;
    const columns = grid[0].length;

    //2D array: visited[rows][columns] = {false}
    const visited = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => false));
    //2D array: parent[rows][columns] = {{-1, -1}} to keep track of the parent cell of each cell 
    //that is part of the path
    const parent = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => [-1, -1]));

    const q = [];
    //mark source cell as visited and push it into the queue
    visited[start.row][start.col] = true; 
    q.push([start.row, start.col]);
    updateCellColor(start.row, start.col, activeCell);
    
    let reachedTarget = false;
    while (q.length !== 0) {
        const currentCell = q[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        q.shift();

        updateCellColor(currentRow, currentCol, visitedCell);

        //explore neighbors
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + dr[i];
            const newCol = currentCol + dc[i];

            if (outOfBounds(rows, columns, newRow, newCol) || visited[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            
            visited[newRow][newCol] = true;
            updateCellColor(newRow, newCol, activeCell);
            await delay(delayTime);

            parent[newRow][newCol] = [currentRow, currentCol];
            q.push([newRow, newCol]);
            if (newRow === target.row && newCol === target.col) {
                reachedTarget = true;
                break;
            }
        }
        if (reachedTarget) break;
    }
    //display path if it exists or handle failure to find path
    if (reachedTarget) {
        reconstructPath(parent, start, target, updateCellColor);
    } else {
        handleNoPathFound();
    }
}
export async function DFS(grid, start, target, updateCellColor, handleNoPathFound) {
    const rows = grid.length;
    const columns = grid[0].length;
    
    //2D array: visited[rows][columns]
    const visited = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => false));
    //2D array: parent[rows][columns] = {{-1, -1}} to keep track of the parent cell of each cell 
    //that is part of the path
    const parent = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => [-1, -1]));

    const stack = [];
    
    //mark source cell as visited and push it into the stack
    visited[start.row][start.col] = true;
    stack.push([start.row, start.col]);
    updateCellColor(start.row, start.col, activeCell);
    
    let reachedTarget = false;
    while (stack.length !== 0) {
        const currentCell = stack[stack.length - 1];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        stack.pop();

        updateCellColor(currentRow, currentCol, visitedCell);

        //explore neighbors
        for (let i = 0; i < 4; i++) {
            const newRow = currentRow + dr[i];
            const newCol = currentCol + dc[i];

            if (outOfBounds(rows, columns, newRow, newCol) || visited[newRow][newCol] || grid[newRow][newCol] === 1) continue;
            
            visited[newRow][newCol] = true;
            updateCellColor(newRow, newCol, activeCell);
            await delay(delayTime);
            
            parent[newRow][newCol] = [currentRow, currentCol];
            stack.push([newRow, newCol]);
            if (newRow === target.row && newCol === target.col) {
                reachedTarget = true;
                break;
            }
            
        }
        if (reachedTarget) break;
    }
    //display path if it exists or handle failure to find path
    if (reachedTarget) {
        reconstructPath(parent, start, target, updateCellColor);
    } else {
        handleNoPathFound();
    }
}
//function to get heuristic value of each cell (Manhattan's distance)
function getHValue(target, row, col) {
    return Math.abs(target.row - row) + Math.abs(target.col - col);
}
export async function Astar(grid, start, target, updateCellColor, handleNoPathFound) {
    const rows = grid.length;
    const columns = grid[0].length;

    //2D array: closedList[rows][columns]
    const closedList = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => false));
    //2D array: cellDetails[rows][columns] to store f, g and h values of each cell we visit
    const cellDetails = Array.from({
            length: rows
        }, () =>
        Array.from({
            length: columns
        }, () => ({
            f: Infinity,
            g: Infinity,
            h: 0
        }))
    );
    
    //2D array: parent[rows][columns] = {{-1, -1}} to keep track of the parent cell of each cell 
    //that is part of the path
    const parent = Array.from({
        length: rows
    }, () => Array.from({
        length: columns
    }, () => -1));

    let i, j;

    //calculate heuristic value for each cell
    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            cellDetails[i][j].h = getHValue(target, i, j);
        }
    }

    i = start.row
    j = start.col;
    //cost to reach starting cell is 0
    cellDetails[i][j].f = 0;
    cellDetails[i][j].g = 0;
    cellDetails[i][j].h = 0;

    //priority queue to explore cells with priority 
    //depending on their fValue = (estimated cost to target) + (cost to reach cell) = h + g
    const openList = [];
    openList.push([i, j, 0]);
    updateCellColor(start.row, start.col, activeCell);

    let reachedTarget = false;
    while (openList.length !== 0) {
        const currentCell = openList[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        openList.shift();
        closedList[currentRow][currentCol] = true;
        updateCellColor(currentRow, currentCol, visitedCell);
        
        //explore neighbors
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
            //update fValue and cell details if newF smaller than current fValue 
            //and push neighbor into the priority queue
            if (newF < cellDetails[newRow][newCol].f) {
                openList.push([newRow, newCol, newF]);
                updateCellColor(currentRow, currentCol, activeCell);
                await delay(delayTime);
                cellDetails[newRow][newCol].f = newF;
                cellDetails[newRow][newCol].g = newG;
                parent[newRow][newCol] = [currentRow, currentCol];

            }

        }
        //end process if path found or sort the openList based on the fValues of the cells in it
        if (reachedTarget) {
            break;
        } else {
            openList.sort((a, b) => a[2] - b[2]);
        }
    }
    //display path if it exists or handle failure to find path
    if (reachedTarget) {
        reconstructPath(parent, start, target, updateCellColor);
    } else {
        handleNoPathFound();
    }
}
export async function BidirectionalSearch(grid, start, target, updateCellColor, handleNoPathFound) {
    const rows = grid.length;
    const columns = grid[0].length;

    let foundPath = false;
    let intersection = {};
    //function to perform a BFS traversal either from source or target cell
    async function BFSTraversal(q, visited, visitedOtherDirection, parent) {
        const currentCell = q[0];
        const currentRow = currentCell[0];
        const currentCol = currentCell[1];
        q.shift();

        updateCellColor(currentRow, currentCol, visitedCell);
        //intersection found
        if (visitedOtherDirection[currentRow][currentCol]) {
            foundPath = true;
            intersection.row = currentRow;
            intersection.col = currentCol;
            return;
        }
        //explore neighbors
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
        //2D array : sVisited[rows][columns] -> visited cells on the way from source to target
        const sVisited = Array.from({
            length: rows
        }, () => Array.from({
            length: columns
        }, () => false));
        //2D array : tVisited[rows][columns] -> visited cells on the way from target to source
        const tVisited = Array.from({
            length: rows
        }, () => Array.from({
            length: columns
        }, () => false));
        //2D array : sParent[rows][columns]
        const sParent = Array.from({
            length: rows
        }, () => Array.from({
            length: columns
        }, () => -1));
        //2D array : tParent[rows][columns]
        const tParent = Array.from({
            length: rows
        }, () => Array.from({
            length: columns
        }, () => -1));

        const sQueue = [];
        const tQueue = [];

        sQueue.push([start.row, start.col]);
        sVisited[start.row][start.col] = true;
        sParent[start.row][start.col] = [-1, -1];

        tQueue.push([target.row, target.col]);
        tVisited[target.row][target.col] = true;
        tParent[target.row][target.col] = [-1, -1];

        //perform BFS Traversals from source to target and from target to source alternately
        while (tQueue.length > 0 && sQueue.length > 0) {
            await BFSTraversal(sQueue, sVisited, tVisited, sParent);
            if (foundPath) break;
            await BFSTraversal(tQueue, tVisited, sVisited, tParent);
            if (foundPath) break;
        }
         //display path if it exists or handle failure to find path
        if (foundPath) {
            reconstructBidirectionalPath(sParent, tParent, start, intersection, target, updateCellColor);
        } else {
            handleNoPathFound();
        }
    }
    Search();
}