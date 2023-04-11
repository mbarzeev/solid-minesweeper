import {ComponentProps} from 'solid-js';
import {gameState, GAME_STATUS, timerSeconds} from '../App';
import Modal from '../Modal/Modal';
import Timer from '../Timer';
import styles from './GameOverModal.module.css';

interface GameOverModalProps extends ComponentProps<'div'> {
    onPlayAgain?: () => void;
    onNewGame?: () => void;
}

const GameOverModal = ({onPlayAgain, onNewGame}: GameOverModalProps) => {
    return (
        <Modal>
            <div class={styles.GameOverModal}>
                <h1>{gameState() === GAME_STATUS.WON ? `You've made it!` : 'Ka-Boom! :('}</h1>
                <div class={styles.time}>
                    Elapsed time:&nbsp;
                    <Timer seconds={timerSeconds} />
                </div>

                <div class={styles.actionPanel}>
                    <button class={styles.actionBtn} onclick={onPlayAgain}>
                        Play again
                    </button>
                    <button class={styles.actionBtn} onclick={onNewGame}>
                        New game
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GameOverModal;
