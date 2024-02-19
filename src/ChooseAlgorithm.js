function ChooseAlgorithm(props) {
    const { setAlgorithm, disabled } = props;
    const handleChange = (e) => {
        setAlgorithm(e.target.value);
    }
    return (
        <div className="step">
            <label for="algorithms">Choose algorithm!</label>
            <select disabled = {disabled} onChange={handleChange}>
                <option value="BFS">BFS</option>
                <option value="DFS">DFS</option>
                <option value="Astar">A*</option>
                <option value="BidirectionalBFS">Bidirectional BFS</option>
            </select>
        </div>
    )
}
export default ChooseAlgorithm;