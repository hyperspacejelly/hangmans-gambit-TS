
export interface Time {
    min: number,
    sec: number,
    ms: number
}

type TimerProps = {
    time: Time
}

export function timerCountdown(currentTime :Time, amount: Time): Time{
    let returnTime :Time = currentTime;

    if(amount.ms > returnTime.ms){
        returnTime.ms = 1000 - (amount.ms - returnTime.ms);
        if(returnTime.min>0 && returnTime.sec>=1){
            returnTime.sec -=1;
        }
    }else{
        returnTime.ms -= amount.ms;
    }

    if(amount.sec > returnTime.sec){
        returnTime.sec = 60 - (amount.sec - returnTime.sec);
        if(returnTime.min>=1){
            returnTime.min -=1;
        }
    }else{
        returnTime.sec -= amount.sec;
    }

    if(amount.min > currentTime.min){
        returnTime.ms=0;
        returnTime.sec=0;
        returnTime.min=0;
    }else{
        returnTime.min-=amount.min;
    }

    return returnTime;
}


export function TimerComponent({time} :TimerProps){
    return(
        <div style={{fontSize:'4rem'}}>
        {`${time.min}:${time.sec}:${time.ms}`}
        </div>
    );
}


