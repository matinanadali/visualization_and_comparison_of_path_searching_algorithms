//component to set start and target points
function SetPoints(props) {
    const {
        rows,
        columns,
        updateStart,
        updateTarget,
        grid,
        disabled
    } = props;

    function handleSetPointsClick() {
        let startingRow, startingCol;
        //choose randomly starting point until it is not blocked
        do {
            startingRow = Math.floor(Math.random() * rows);
            startingCol = Math.floor(Math.random() * columns);
        } while (grid[startingRow][startingCol] === 1);
        updateStart({
            row: startingRow,
            col: startingCol
        });
        let targetRow, targetCol;
        //choose randomly ending point until it is not blocked
        do {
            targetRow = Math.floor(Math.random() * rows);
            targetCol = Math.floor(Math.random() * columns);
        } while (grid[targetRow][targetCol] === 1 || (startingRow === targetRow && startingCol === targetCol));
        updateTarget({
            row: targetRow,
            col: targetCol
        });
    }
    return ( <button
        disabled = {
            disabled
        }
        className = {
            (disabled) ? "disabled" : ""
        }
        onClick = {
            () => handleSetPointsClick()
        } > Set Points! </button>
    )
}
export default SetPoints;