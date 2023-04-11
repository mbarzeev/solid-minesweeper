import {ComponentProps} from 'solid-js';
import {Portal} from 'solid-js/web';

interface ModalProps extends ComponentProps<'div'> {}

const Modal = ({children}: ModalProps) => {
    return <Portal mount={document.getElementById('modal') as Node}>{children}</Portal>;
};

export default Modal;
