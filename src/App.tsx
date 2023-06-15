import { useState, useEffect } from "react"
import { TimerComponent } from "./Components/Timer"
import Healthbar from "./Components/Healthbar";

import DifficultySelect, {difficulties} from "./Components/DifficultySelect";

import settings from './params.json';
import words from './wordList.json';
import WordReveal from "./Components/WordReveal";
import LettersLeft from "./Components/LettersLeft";
import PlayArea from "./Components/PlayArea";

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
export type LetterToFind = {
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

function createWordToFindArray(word :string, hiddenLettersRatio :number) :LetterToFind[]{
  const hiddenLetters = genRandomNumberArray(Math.floor(word.length * hiddenLettersRatio), (word.length));
  let returnArray :Array<LetterToFind> = [];
  console.log(hiddenLetters);
  for(let i=0;i<word.length;i++){
    returnArray.push({
      hidden: hiddenLetters.includes(i)?true:false,
      letter:word.split('')[i]
    });
  }

  return returnArray;
}

function getFirstHiddenLetter(wordToFindArray :LetterToFind[]) :number{
  console.log(wordToFindArray.findIndex((el)=>el.hidden))
  return wordToFindArray.findIndex((el)=>el.hidden);
}

function App() {
  // stores difficulty settings chosen by player
  const [difficultySettings, setDifficultySettings] = useState<difficultySettings | null>(null);

  // reflect whether the timer is running or not
  const [timerStart, setTimerStart] = useState<boolean>(false);
  // reflects whether the timer has run its full course or not 
  const [timerComplete, setTimerComplete] = useState<boolean>(false);

  const [hp, setHp] = useState(settings.difficulty.easy.hp);
  const [wordToFindArray, setWordToFindArray] = useState<LetterToFind[]>([]);
  const [wordToFind, setWordToFind] = useState<string>("");

  const [currGuessIndex, setCurrGuessIndex] = useState<number>(0);

  useEffect(()=>{
    if(wordToFindArray)
      setCurrGuessIndex(getFirstHiddenLetter(wordToFindArray));
  },[wordToFindArray]);

  // sets difficulty and generates an array with the right amount of hidden letters
  function handleDifficultySelect(difficulty :difficulties){
    const difficultyValue = (settings as any).difficulty[difficulty];
    setDifficultySettings(difficultyValue);
    const word = getWord();
    const ratio = difficultyValue.hiddenLettersRatio;
    const wordToFindValue = createWordToFindArray(word, ratio);

    setWordToFind(word);
    setWordToFindArray(wordToFindValue);
    setCurrGuessIndex(getFirstHiddenLetter(wordToFindValue));
  }

  // calculates the total time for the countdown based on difficulty and number of hidden letters
  function timerTotalTime() :number{
    let returnValue :number = 0;
    if(difficultySettings && wordToFind){
      returnValue = Math.ceil(wordToFind.length * (1 - difficultySettings.hiddenLettersRatio)) * (difficultySettings.totalTimeRatio * settings.baseTimePerLetterMs);
    }
    return returnValue;
  }

  //fct to execute if the current letter to guess has been guessed
  function handleGuess() :void{
    setWordToFindArray(prevArray => prevArray.map((letter, index)=>{
      return index===currGuessIndex? {hidden:false, letter: letter.letter} : letter
    }));
  }

  return (
    <main>
      {difficultySettings && <>
        <div id="hangman-UI">
          <section id="top-right">
            <div style={{width:'fit-content'}}>
              <TimerComponent timerTimeMs={timerTotalTime()} 
                    timerStart={timerStart} 
                    setTimerComplete={setTimerComplete} 
                    setTimerStart={setTimerStart} />
              <Healthbar hp={hp} />
              <button style={{gridColumn:"1/span2"}}onClick={()=>{
                setTimerStart(prev=>!prev);
              }}>{timerStart?"Stop":"Start"} Timer</button>
            </div>
            <p>{timerComplete? "Countdown Over":""}</p>
          </section>
          <section id="top-left">
            <LettersLeft wordToFindArray={wordToFindArray} />
          </section>
          <section id="center">
            <PlayArea wordToFindArray={wordToFindArray} currGuess={currGuessIndex} handleGuess={()=>handleGuess()}/>
          </section>
          <section id="bottom">
            <WordReveal wordToFind={wordToFindArray} currGuess={currGuessIndex}/>
          </section>
        </div>
      </>}

      {!difficultySettings &&<div id="diff-select-cont">
          <DifficultySelect setDifficulty={handleDifficultySelect}/>
        </div>
      }
    </main>
  )
}

export default App
