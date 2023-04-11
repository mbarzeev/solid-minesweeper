import {ComponentProps} from 'solid-js';
import {Portal} from 'solid-js/web';
import styles from './Backdrop.module.css';

interface BackdropProp extends ComponentProps<'div'> {}

const Backdrop = (props: BackdropProp) => {
    return (
        <Portal mount={document.getElementById('backdrop') as Node}>
            <div class={styles.backdrop} />
        </Portal>
    );
};

export default Backdrop;
