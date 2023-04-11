import {Component, createEffect, createSignal, For} from 'solid-js';

import styles from './App.module.css';
import Backdrop from './Backdrop/Backdrop';
import GameOverModal from './GameOverModal/GameOverModal';
import Tile, {TileData, TileValue} from './Tile';
import Timer from './Timer';

const TOTAL_MINES = 50;
const [remainingMines, setRemainingMines] = createSignal<number>(TOTAL_MINES);
const ROW_LENGTH = 20;
export const MINE_VALUE = 'x';
const TOTAL_TILES = Math.pow(ROW_LENGTH, 2);

const [tilesArray, setTilesArray] = createSignal<TileData[]>([]);

let timerInterval: number;
export const [timerSeconds, setTimerSeconds] = createSignal(0);
const startTimer = () => {
    clearInterval(timerInterval);
    setTimerSeconds(0);
    timerInterval = setInterval(() => {
        setTimerSeconds(timerSeconds() + 1);
    }, 1000);
};

export enum GAME_STATUS {
    WON = 'won',
    LOST = 'lost',
    ONGOING = 'ongoing',
}

export const [gameState, setGameState] = createSignal<GAME_STATUS>(GAME_STATUS.ONGOING);

createEffect(() => {
    if (gameState() !== GAME_STATUS.ONGOING) return;
    const markedTiles = tilesArray().filter((tile) => tile.isMarked);
    setRemainingMines(TOTAL_MINES - markedTiles.length);

    // If the marked tiles are actually mines and they equal to the total number
    // of mines in the board, the game is won
    if (markedTiles.length === TOTAL_MINES) {
        try {
            markedTiles.forEach((tile) => {
                if (tile.value !== MINE_VALUE) {
                    throw new Error();
                }
            });
            gameWon();
        } catch (error) {
            // Do nothing, the game is not won
        }
    }
});

const toggleTileMark = (index: number) => {
    // If the tile is already open, don't do anything
    if (tilesArray()[index].isOpen) return;
    setTilesArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = {...newArray[index], isMarked: !newArray[index].isMarked};
        return newArray;
    });
};

const onTileClicked = (index: number) => {
    const tile: TileData = tilesArray()[index];
    // If the tile is marked, un-mark it
    tile.isMarked = false;
    // If the tile has a mine, it's game over
    if (tile.value === MINE_VALUE) {
        gameOver();
    } else {
        let indices = [index];
        const tileValue = tile.value;
        if (tileValue === 0) {
            // get the indices that need to be opened...
            indices = getTotalZeroTilesIndices(index);
        }
        openTiles(indices);
    }
};

const gameWon = () => {
    setGameState(GAME_STATUS.WON);
    clearInterval(timerInterval);
    setTilesArray((prevArray) => {
        const newArray = prevArray.map((tile) => {
            return {...tile, isOpen: true};
        });

        return newArray;
    });
};

const gameOver = () => {
    setGameState(GAME_STATUS.LOST);
    clearInterval(timerInterval);
    setTilesArray((prevArray) => {
        const newArray = prevArray.map((tile) => {
            if (tile.value === MINE_VALUE) {
                return {...tile, isDetonated: true, isOpen: true};
            }
            return {...tile, isOpen: true};
        });

        return newArray;
    });
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

const restartGame = () => {
    // Hide all the tiles
    setTilesArray((prevArray) => {
        const newArray = prevArray.map((tile) => {
            return {...tile, isOpen: false, isDetonated: false, isMarked: false};
        });

        return newArray;
    });
    startTimer();
    setGameState(GAME_STATUS.ONGOING);
};

const startNewGame = () => {
    let count = 0;
    const boardArray = [...Array(TOTAL_TILES)].fill(0);
    while (count < TOTAL_MINES) {
        const randomCellIndex = Math.floor(Math.random() * TOTAL_TILES);
        if (boardArray[randomCellIndex] !== 1) {
            boardArray[randomCellIndex] = 1;
            count++;
        }
    }

    setTilesArray(
        boardArray.map((item, index, array) => ({
            index,
            value: getTileValue(index, array),
            isOpen: false,
            isMarked: false,
            isDetonated: false,
        }))
    );
    startTimer();
    setGameState(GAME_STATUS.ONGOING);
};

startNewGame();

const App: Component = () => {
    return (
        <div class={styles.App} style={{'--row-length': ROW_LENGTH}}>
            <header class={styles.header}>
                <div class={styles.gamePanel}>
                    <span style={{width: '100px', 'text-align': 'left'}}>{remainingMines()}</span>
                    <button class={styles.resetBtn} onclick={startNewGame}>
                        {gameState() === GAME_STATUS.LOST ? '🙁' : '🙂'}
                    </button>
                    <Timer seconds={timerSeconds} style={{width: '100px', 'text-align': 'right'}} />
                </div>
                <div class={styles.board}>
                    <For each={tilesArray()}>
                        {(tileData: TileData) => (
                            <Tile data={tileData} onTileContextMenu={toggleTileMark} onTileClicked={onTileClicked} />
                        )}
                    </For>
                </div>
                <span class={styles.copyrights}>
                    <a href="https://twitter.com/mattibarzeev" target="_blank" rel="noopener noreferrer">
                        Matti Bar-Zeev
                    </a>
                    , 2023
                </span>
            </header>
            {gameState() !== GAME_STATUS.ONGOING && <Backdrop />}
            {gameState() !== GAME_STATUS.ONGOING && (
                <GameOverModal onPlayAgain={restartGame} onNewGame={startNewGame} />
            )}
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

function getTileValue(index: number, boardArray: number[]): TileValue {
    const cell = boardArray[index];
    if (cell === 1) {
        return MINE_VALUE;
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
