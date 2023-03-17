import {Component, For} from 'solid-js';

import styles from './App.module.css';
import Tile, {TileData} from './Tile';

const totalMines = 40;
const ROW_LENGTH = 20;
const TOTAL_TILES = Math.pow(ROW_LENGTH, 2);

const boardArray = [...Array(TOTAL_TILES)].fill(0);

let count = 0;
while (count < totalMines) {
    const randomCellIndex = Math.floor(Math.random() * TOTAL_TILES);
    if (boardArray[randomCellIndex] !== 1) {
        boardArray[randomCellIndex] = 1;
        count++;
    }
}

const App: Component = () => {
    return (
        <div class={styles.App} style={{'--row-length': ROW_LENGTH}}>
            <header class={styles.header}>
                <div class={styles.board}>
                    <For each={boardArray}>
                        {(item: number, index: () => number) => <Tile {...getTileData(index())} />}
                    </For>
                </div>
            </header>
        </div>
    );
};

function getTileData(index: number): TileData {
    const cell = boardArray[index];
    if (cell === 1) {
        return {isMine: true};
    } else {
        let minesCount = 0;
        const hasLeftCells = index % ROW_LENGTH > 0;
        const hasRightCells = (index + 1) % ROW_LENGTH !== 0;
        const bottomCellIndex = index + ROW_LENGTH;
        const topCellIndex = index - ROW_LENGTH;

        if (boardArray[bottomCellIndex] === 1) {
            minesCount++;
        }

        if (boardArray[topCellIndex] === 1) {
            minesCount++;
        }

        if (hasLeftCells) {
            boardArray[index - 1] === 1 && minesCount++;
            boardArray[topCellIndex - 1] === 1 && minesCount++;
            boardArray[bottomCellIndex - 1] === 1 && minesCount++;
        }

        if (hasRightCells) {
            boardArray[index + 1] === 1 && minesCount++;
            boardArray[topCellIndex + 1] && minesCount++;
            hasRightCells && boardArray[bottomCellIndex + 1] && minesCount++;
        }

        return {isMine: false, value: minesCount};
    }
}

export default App;
