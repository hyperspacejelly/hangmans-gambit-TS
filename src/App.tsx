import { useEffect, useState } from "react"
import { TimerComponent, Time } from "./Components/Timer"


function timerUpdate(prev :Time, amount: Time) :Time{
  let returnTime: Time = {min:0, sec:0, ms:0};
        if (amount.min > prev.min && amount.min > 0) {
          return returnTime;
        } else {

          returnTime.min = prev.min - amount.min;

          if (amount.sec >= prev.sec && amount.sec) {
            returnTime.sec = 59 - (amount.sec - prev.sec);
            if (returnTime.min >= 1) {
              returnTime.min = (prev.min - (1+ amount.min)) >= 0 ? (prev.min - (1+ amount.min)) : 0 ;
            }
          }else{
            returnTime.sec = prev.sec - amount.sec;
          }

          if (amount.ms >= prev.ms && amount.ms) {
            returnTime.ms = 999 - (amount.ms - prev.ms);
            if (prev.min > 0 && prev.sec >= 1 && amount.ms) {
              returnTime.sec = (prev.sec - (1+ amount.sec)) >= 0 ? (prev.sec - (1+ amount.sec)) : 0;
            }
          } else {
            returnTime.ms = prev.ms - amount.ms;
          }
  
          
        }
        return returnTime;
}


function App() {
  const [appTimer, setAppTimer] = useState<Time>({
    min: 1,
    sec: 30,
    ms: 0
  });

  const countdownRate: number = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      const amount: Time = {
        min: Math.floor(countdownRate / 60000),
        sec: Math.floor(countdownRate / 1000),
        ms: countdownRate % 1000
      }

      setAppTimer(prev => timerUpdate(prev, amount));
    }, countdownRate);

    return () => clearInterval(interval);
  }, [appTimer])

  return (
    <main>
      <TimerComponent time={appTimer} />
      <div>{`${appTimer.sec}`}</div>
    </main>
  )
}

export default App
