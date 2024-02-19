function FillGrid(props) {
    const { rows, columns, updateGrid, updateStart, updateTarget, disabled } = props;
    const delay = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
    function clearGrid(rows, columns, updateGrid, updateStart, updateTarget) {
        updateGrid(() => {
            const emptyGrid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
            return emptyGrid;
        })
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const color = "#50514F";
                const cell = document.getElementById(`row${i}col${j}`);
                cell.style.backgroundImage = `linear-gradient(${color}, ${color})`;
                cell.style.backgroundSize = "0% 0%";
            }
        }
        
        updateStart(null);
        updateTarget(null);
        fillGrid(rows, columns, updateGrid)
    }
    async function fillGrid(rows, columns, updateGrid) {
        
        for (let sum = 0; sum < rows + columns - 2; sum++) {
        for (let i = 0; i < rows; i++) {
            let j = sum - i;
            if (j >= 0 && j < columns) {
                const cell = document.getElementById(`row${i}col${j}`);
                const wall = Math.floor(Math.random()*1.2);
                if (wall == 1) {
                    cell.style.backgroundSize = "100% 100%";
                    await delay(5);
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
    return (
        <button disabled = {disabled} className = {(disabled) ? "disabled" : ""} onClick={()=>clearGrid(rows, columns, updateGrid, updateStart, updateTarget)}>Fill Grid!</button>
    )
}
export default FillGrid;


