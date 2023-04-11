import {Accessor, ComponentProps} from 'solid-js';

interface TimerProps extends ComponentProps<'div'> {
    seconds: Accessor<number>;
}

const Timer = ({seconds, ...props}: TimerProps) => {
    return <div {...props}>{getDisplayTimeBySeconds(seconds())}</div>;
};

const getDisplayTimeBySeconds = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${getDisplayableTime(min)}:${getDisplayableTime(sec)}`;
};

function getDisplayableTime(timeValue: number): string {
    return timeValue < 10 ? `0${timeValue}` : `${timeValue}`;
}

export default Timer;
