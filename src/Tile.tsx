import {Component, createSignal} from 'solid-js';
import {MINE_VALUE} from './App';
import styles from './Tile.module.css';

export type TileValue = number | 'x';
export type TileData = {
    index: number;
    value: TileValue;
    isOpen: boolean;
    isMarked: boolean;
    isDetonated: boolean;
};
export type TileProps = {
    data: TileData;
    onTileContextMenu: (index: number) => void;
    onTileClicked: (index: number) => void;
};

const Tile: Component<TileProps> = ({data, onTileContextMenu, onTileClicked}) => {
    const onTileContextClick = (event: MouseEvent) => {
        event.preventDefault();
        onTileContextMenu(data.index);
    };

    const value = data.value === MINE_VALUE ? '💣' : data.value;

    return (
        <div
            class={styles.Tile}
            onclick={() => {
                onTileClicked(data.index);
            }}
            onContextMenu={onTileContextClick}
        >
            <div
                class={styles.value}
                classList={{[styles.exposed]: data.isOpen || data.isMarked, [styles.detonated]: data.isDetonated}}
            >
                {data.isMarked ? '🚩' : value !== 0 ? value : ''}
            </div>
        </div>
    );
};

export default Tile;
