const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const wallCellColor = "#50514F";
const wallCellPercentage = 0.3;

//function to clear grid - reset
export function clearGrid(rows, columns, updateGrid, updateStart, updateTarget) {
    //reset 2D array grid
    updateGrid(() => {
        const emptyGrid = Array.from({
            length: rows
        }, () => Array.from({
            length: columns
        }, () => 0));
        return emptyGrid;
    })
    //reset cell colors
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = document.getElementById(`row${i}col${j}`);
            if (cell) {
                cell.style.backgroundImage = `linear-gradient(${wallCellColor}, ${wallCellColor})`;
                cell.style.backgroundSize = "0% 0%";
            }
        }
    }
    //hide impossible div
    const impossible = document.querySelector(".impossible");
    if (impossible) {
        impossible.style.backgroundSize = ("100% 0%");
    }
    //reset start and target cells
    updateStart(null);
    updateTarget(null);
}
//function to fill grid on button click
export async function fillGrid(rows, columns, updateGrid, updateStart, updateTarget) {
    //first reset grid
    clearGrid(rows, columns, updateGrid, updateStart, updateTarget);
    //traverse grid diagonally from top-left to bottom-right corner
    for (let sum = 0; sum < rows + columns - 2; sum++) {
        for (let i = 0; i < rows; i++) {
            let j = sum - i;
            if (j >= 0 && j < columns) {
                const cell = document.getElementById(`row${i}col${j}`);
                //determine whether current cell is a wall or a free cell
                const wall = Math.floor(Math.random() * (wallCellPercentage+1));
                if (wall === 1) {
                    cell.style.backgroundSize = "100% 100%";
                    await delay(1);
                    updateGrid((grid) => {
                        const newGrid = grid.map(row => [...row]);
                        newGrid[i][j] = 1;
                        return newGrid;
                    });
                }
            }
        }
    }

}

function FillGrid(props) {
    const {
        rows,
        columns,
        updateGrid,
        updateStart,
        updateTarget,
        disabled
    } = props;

    return ( <button
        disabled = {
            disabled
        }
        className = {
            (disabled) ? "disabled" : ""
        }
        onClick = {
            () => fillGrid(rows, columns, updateGrid, updateStart, updateTarget)
        } > Fill Grid! </button>
    )
}
export default FillGrid;