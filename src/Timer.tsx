import {Accessor} from 'solid-js';

const Timer = ({seconds}: {seconds: Accessor<number>}) => {
    return <div>{getDisplayTimeBySeconds(seconds())}</div>;
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
