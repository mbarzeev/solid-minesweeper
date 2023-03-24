import {Component, createSignal, For} from 'solid-js';

import styles from './App.module.css';
import Tile, {TileData, TileValue} from './Tile';

const totalMines = 50;
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

// Convert the boardArray to TilesArray
const [tilesArray, setTilesArray] = createSignal<TileData[]>(
    boardArray.map((item, index) => ({
        index,
        value: getTileValue(index),
        isOpen: false,
        isMarked: false,
    }))
);

const toggleTileMark = (index: number) => {
    setTilesArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = {...newArray[index], isMarked: !newArray[index].isMarked};
        return newArray;
    });
};

const onTileClicked = (index: number) => {
    let indices = [index];
    const tileValue = tilesArray()[index].value;
    if (tileValue === 0) {
        // get the indices that need to be opened...
        indices = getTotalZeroTilesIndices(index);
    }
    openTiles(indices);
};

const openTiles = (indices: number[]) => {
    setTilesArray((prevArray) => {
        const newArray = [...prevArray];
        indices.forEach((index) => {
            newArray[index] = {...newArray[index], isOpen: true};
        });

        return newArray;
    });
};

const App: Component = () => {
    return (
        <div class={styles.App} style={{'--row-length': ROW_LENGTH}}>
            <header class={styles.header}>
                <div class={styles.board}>
                    <For each={tilesArray()}>
                        {(tileData: TileData) => (
                            <Tile data={tileData} onTileContextMenu={toggleTileMark} onTileClicked={onTileClicked} />
                        )}
                    </For>
                </div>
            </header>
        </div>
    );
};

function getTotalZeroTilesIndices(index: number): number[] {
    const indices: number[] = [];

    function inspectZeroTile(index: number) {
        const tile = tilesArray()[index];
        if (tile && !indices.includes(index)) {
            if (tile.value === 0) {
                getAdjacentZeroTilesIndices(index);
            } else {
                indices.push(index);
            }
        }
    }

    function getAdjacentZeroTilesIndices(index: number) {
        indices.push(index);

        inspectZeroTile(index);

        const leftTileIndex = index - 1;
        const rightTileIndex = index + 1;
        const topTileIndex = index - ROW_LENGTH;
        const bottomTileIndex = index + ROW_LENGTH;
        const hasLeftTiles = index % ROW_LENGTH > 0;
        const hasRightTiles = (index + 1) % ROW_LENGTH !== 0;

        hasRightTiles && inspectZeroTile(rightTileIndex);

        hasLeftTiles && inspectZeroTile(leftTileIndex);

        inspectZeroTile(topTileIndex);

        inspectZeroTile(bottomTileIndex);
    }

    getAdjacentZeroTilesIndices(index);

    return indices;
}

function getTileValue(index: number): TileValue {
    const cell = boardArray[index];
    if (cell === 1) {
        return 'x';
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

        return minesCount;
    }
}

export default App;
