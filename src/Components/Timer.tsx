import { useEffect, useState, useRef } from "react";

import './CSS/countdown.css';

interface Time {
    min: number,
    sec: number,
    ms: number
}

type TimerProps = {
    timerTimeMs: number,
    timerStart: boolean,
    setTimerStart : React.Dispatch<React.SetStateAction<boolean>>,
    setTimerComplete: React.Dispatch<React.SetStateAction<boolean>>,
}

function msToTime(valueMs :number) :Time{
    let returnTime = {min:0,sec:0,ms:0}
    
    if(valueMs > 0){
        returnTime ={
            min:Math.floor(valueMs / 60000),
            sec:Math.trunc((valueMs%60000)/1000),
            ms:valueMs%1000
        }
    }
    return returnTime
}

export function TimerComponent({timerTimeMs, timerStart, setTimerStart, setTimerComplete} :TimerProps){
    const [timerInit, setTimerInit] = useState<number>(0);
    const [totalTimeLeft, setTotalTimeLeft] = useState<number>(timerTimeMs); 
    const [timeLeft, setTimeLeft] = useState<number>(timerTimeMs);
    const refreshInterval = useRef<number>();
    const refreshRate = 1;   
    
    useEffect(()=>{
        if(refreshInterval.current){
            clearInterval(refreshInterval.current); //clean up interval on unmount
        }
    },[])

    useEffect(()=>{
        if(timerStart){
            setTimerInit(Date.now()); //set references time for countdown
        }
        if(!timerStart && timerInit){
            setTimerInit(0); //on stop reset the ref time
            setTotalTimeLeft(timeLeft); // update the time left to till the countdown is over
        }
    },[timerStart]);

    useEffect(()=>{
        if(timerInit!==0){
            refreshInterval.current = setInterval(()=>{
                /*time left = amount of time for the timer - (current time - time of starting or restarting timer)*/
                setTimeLeft(totalTimeLeft-(Date.now() - timerInit)); 
                if(totalTimeLeft-(Date.now() - timerInit) < 0){
                    setTimerComplete(true); //if countdown over update state to reflect that 
                    setTimerStart(false);// and stop countdown/clear interval
                }
            }, refreshRate);
        }
        if(timerInit===0 && refreshInterval.current !== 0){
            clearInterval(refreshInterval.current); //on Stop, clear the interval to stop the countdown
        }
    },[timerInit]);

    return(
        <div id="countdown">
                {`${msToTime(timeLeft).min<10?"0":""}${msToTime(timeLeft).min}:`+
                `${msToTime(timeLeft).sec<10?"0":""}${msToTime(timeLeft).sec}:`+
                `${msToTime(timeLeft).ms < 100?"0":""}${msToTime(timeLeft).ms < 10?"0":""}${msToTime(timeLeft).ms}`}
        </div>
    );
}


