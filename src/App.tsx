import { useEffect, useState } from "react"
import { TimerComponent } from "./Components/Timer"
import Healthbar from "./Components/Healthbar";

import DifficultySelect, {difficulties} from "./Components/DifficultySelect";

import settings from './params.json';
import words from './wordList.json';
import WordReveal from "./Components/WordReveal";

type difficultySettings = {
  hp :number,
  hiddenLettersRatio :number,
  totalTimeRatio :number
}

interface settings {
  baseTimePerLetterMs :number,
  difficultySettings :difficultySettings[]
}

// the word to guess will be constituted of an array of letters (visible or not)
export type letterToFind = {
  hidden :boolean;
  letter :string;
}


function getWord() :string{
  const maxIndex = words.length;
  const randomIndex = Math.floor(Math.random() * maxIndex);

  return words[randomIndex];
}

function genRandomNumberArray(arraySize :number, maxNumber :number) :number[]{
  let returnArray :number[] = [];
  for(let i = 0; i < arraySize;i++){
    let randomNum: number = 0;
    do{
      randomNum = Math.floor(Math.random() * maxNumber);
    }while(returnArray.includes(randomNum));

    returnArray.push(randomNum)
  }
  return returnArray;
}

function createWordToFindArray(word :string, hiddenLettersRatio :number) :letterToFind[]{
  const hiddenLetters = genRandomNumberArray(Math.floor(word.length * hiddenLettersRatio), (word.length));
  let returnArray :Array<letterToFind> = [];
  console.log(hiddenLetters);
  for(let i=0;i<word.length;i++){
    console.log("i : "+i+". hiddenletters[i]: "+hiddenLetters.includes(i));
    returnArray.push({
      hidden: hiddenLetters.includes(i)?true:false,
      letter:word.split('')[i]
    });
  }

  return returnArray;
}

function App() {
  const [difficultySettings, setDifficultySettings] = useState<difficultySettings | null>(null);

  const [timerStart, setTimerStart] = useState<boolean>(false);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);

  const [hp, setHp] = useState(settings.difficulty.easy.hp);
  const [wordToFindArray, setWordToFindArray] = useState<letterToFind[]>([]);
  const [wordToFind, setWordToFind] = useState<string>("");

  function handleDifficultySelect(difficulty :difficulties){
    const difficultyValue = (settings as any).difficulty[difficulty];
    setDifficultySettings(difficultyValue);
    const word = getWord();
    const ratio = difficultyValue.hiddenLettersRatio;
    const wordToFindValue = createWordToFindArray(word, ratio);

    setWordToFind(word);
    setWordToFindArray(wordToFindValue);
  }

  function timerTotalTime() :number{
    let returnValue :number = 0;
    if(difficultySettings && wordToFind){
      returnValue = Math.ceil(wordToFind.length * (1 - difficultySettings.hiddenLettersRatio)) * (difficultySettings.totalTimeRatio * settings.baseTimePerLetterMs);
    }
    return returnValue;
  }

  useEffect(()=>{

  }, [difficultySettings]);

  return (
    <main>
      {difficultySettings&& <div>
        <Healthbar hp={hp} />
        <TimerComponent timerTimeMs={timerTotalTime()} 
              timerStart={timerStart} 
              setTimerComplete={setTimerComplete} 
              setTimerStart={setTimerStart} />
        <button onClick={()=>{
            setTimerStart(prev=>!prev);
          }}>{timerStart?"Stop":"Start"} Timer</button>
        <button onClick={()=>{
          setHp(currHp => currHp-1);
        }}>-1HP</button>
        <p>{timerComplete? "Countdown Over":""}</p>
        <WordReveal wordToFind={wordToFindArray} />
      </div>}
      {!difficultySettings &&<div>
            <h2>Select a difficulty</h2>
            <DifficultySelect setDifficulty={handleDifficultySelect}/>
        </div>
      }
    </main>
  )
}

export default App
