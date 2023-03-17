import {Component, createSignal} from 'solid-js';
import styles from './Tile.module.css';

export type TileData = {
    isMine: boolean;
    value?: number;
};

const Tile: Component<TileData> = (data: TileData) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [isMarked, setIsMarked] = createSignal(false);

    const onTileClicked = (event: MouseEvent) => {
        !isMarked() && setIsOpen(true);
    };

    const onTileContextClick = (event: MouseEvent) => {
        event.preventDefault();
        !isOpen() && setIsMarked(!isMarked());
    };

    const value = data.isMine ? 'X' : data.value;

    return (
        <div class={styles.Tile} onclick={onTileClicked} onContextMenu={onTileContextClick}>
            <div class={styles.value} classList={{[styles.exposed]: isOpen() || isMarked()}}>
                {isMarked() ? '🚩' : value !== 0 ? value : ''}
            </div>
        </div>
    );
};

export default Tile;
