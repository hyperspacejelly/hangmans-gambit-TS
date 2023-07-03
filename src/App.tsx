import { useState, useEffect } from "react"
import { TimerComponent } from "./Components/Timer"
import Healthbar from "./Components/Healthbar";

import DifficultySelect, {difficulties} from "./Components/DifficultySelect";

import settings from './params.json';
import words from './wordList.json';
import WordReveal from "./Components/WordReveal";
import LettersLeft from "./Components/LettersLeft";
import PlayArea from "./Components/PlayArea";

import { SplashInit, SplashLose, SplashWin } from "./Components/SplashComponents";

import { BGM, coolSfx, failSfx, gameOverSfx, playRandomSfx, winSfx } from "./audio";


// game parameters loaded from params.json
type difficultySettings = {
  hp :number,
  hiddenLettersRatio :number,
  totalTimeRatio :number
}

type GameStatus = "won" | "lost" | "playing" | "init";

interface settings {
  baseTimePerLetterMs :number,
  difficultySettings :difficultySettings[]
}

// the word to guess will be constituted of an array of letters that will be hidden or visible
export type LetterToFind = {
  hidden :boolean;
  letter :string;
}


/* gets a random word from the imported word array*/
function getWord() :string{
  const maxIndex = words.length;
  const randomIndex = Math.floor(Math.random() * maxIndex);

  return words[randomIndex];
}

/* Creates an array of {arraySize} DIFFERENT numbers each of which can have a max value of {maxValue} 
  The purpose of this fct is to have a set of random indexes to hide in the LetterToFind array wordToFindArray */
function genRandomNumberArray(arraySize :number, maxValue :number) :number[]{
  let returnArray :number[] = [];
  for(let i = 0; i < arraySize;i++){
    let randomNum: number = 0;
    do{
      randomNum = Math.floor(Math.random() * maxValue);
    }while(returnArray.includes(randomNum));

    returnArray.push(randomNum)
  }
  return returnArray;
}

/* Generates an array of LetterToFind from a string {word} and a ratio (0 to 1) of hidden letters {hiddenLettersRatio} 
  each LetterToFind is comprised of 2 values: 
    {hidden :boolean} which determines whether the letter is to guess (true) or visible (false)
    {letter :string} which contains the letter
*/
function createWordToFindArray(word :string, hiddenLettersRatio :number) :LetterToFind[]{
  const hiddenLetters = genRandomNumberArray(Math.floor(word.length * hiddenLettersRatio), (word.length));
  let returnArray :Array<LetterToFind> = [];
  for(let i=0;i<word.length;i++){
    returnArray.push({
      hidden: hiddenLetters.includes(i)?true:false,
      letter:word.split('')[i]
    });
  }

  return returnArray;
}

/* Gets the index of the first LetterToFind with a {hidden} value of (true) */
function getFirstHiddenLetter(wordToFindArray :LetterToFind[]) :number{
  return wordToFindArray.findIndex((el)=>el.hidden);
}

function App() {
  // stores difficulty settings chosen by player
  const [difficultySettings, setDifficultySettings] = useState<difficultySettings | null>(null);

  //number of time the game has been started
  const [gameCount, setGameCount] = useState<number>(1);

  // reflect whether the timer is running or not
  const [timerStart, setTimerStart] = useState<boolean>(false);

  // reflects whether the timer has run its full course or not 
  const [timerComplete, setTimerComplete] = useState<boolean>(false);

  const [hp, setHp] = useState<number>(1);
  const [wordToFindArray, setWordToFindArray] = useState<LetterToFind[]>([]);
  const [wordToFind, setWordToFind] = useState<string>("");

  const [gameStatus, setGameStatus] = useState<GameStatus>("init");

  const [currGuessIndex, setCurrGuessIndex] = useState<number>(0);

  useEffect(()=>{
    if(wordToFindArray){
      const index = getFirstHiddenLetter(wordToFindArray);
      setCurrGuessIndex(index); // finds the next hidden letter
      
      if(index < 0){
        if(gameStatus === "playing"){
          setGameStatus("won"); //win condition acheived
          setTimerStart(false);
        }
      }
    }
  },[wordToFindArray, gameStatus]);

  /* Checks loss conditions */
  useEffect(()=>{
    if(timerComplete || hp === 0){
      if(gameStatus==="playing"){
        setGameStatus("lost");
        gameOverSfx.play();
      }
      if(!timerComplete){
        setTimerStart(false); // of game over but the timer hasn't run out, pause it 
      }
    }
  },[hp, timerComplete]);

  useEffect(()=>{
    // when game starts, start timer
    if(gameStatus === "playing"){
      setTimerStart(true);
    }
  },[gameStatus]);

  /* sets difficulty and generates an array with the right amount of hidden letters */
  function handleDifficultySelect(difficulty :difficulties){
    const difficultyValue = (settings as any).difficulty[difficulty];
    setDifficultySettings(difficultyValue);
    const word = getWord();
    const ratio = difficultyValue.hiddenLettersRatio;
    const wordToFindValue = createWordToFindArray(word, ratio);

    setHp(difficultyValue.hp)
    setWordToFind(word);
    setWordToFindArray(wordToFindValue);
    setCurrGuessIndex(getFirstHiddenLetter(wordToFindValue));

    BGM.play();
    setTimeout(()=>{setGameStatus("playing")},2500);
  }

  /* Resets for a new game with the same difficulty settings */
  function newGameSetup(){
    if(difficultySettings){
      setGameCount(prev=>prev+1);
      const word = getWord();
      const ratio = difficultySettings.hiddenLettersRatio;
      const wordToFindValue = createWordToFindArray(word, ratio);

      setHp(difficultySettings.hp)
      setWordToFind(word);
      setWordToFindArray(wordToFindValue);
      setCurrGuessIndex(getFirstHiddenLetter(wordToFindValue));
      setTimerComplete(false);

      setTimeout(()=>{setGameStatus("playing")},2500);
    }
  }


  /* calculates the total time for the countdown based on difficulty and number of hidden letters */
  function timerTotalTime() :number{
    let returnValue :number = 0;
    if(difficultySettings && wordToFind){
      returnValue = Math.ceil(wordToFind.length * (1 - difficultySettings.hiddenLettersRatio)) * (difficultySettings.totalTimeRatio * settings.baseTimePerLetterMs);
    }
    return returnValue;
  }

  /* fct to execute if the current letter to guess has been guessed */
  function handleGuess(value :'correct' | 'incorrect') :void{
    if(value==="correct"){
      // turns the guessed letter visible
      setWordToFindArray(prevArray => prevArray.map((letter, index)=>{
        return index===currGuessIndex? {hidden:false, letter: letter.letter} : letter
      }));

      if(wordToFindArray.filter((el)=>el.hidden).length>1){
        playRandomSfx(coolSfx); // if != last letter to guess, play a success SFX
      }
      else{
        winSfx.currentTime=0;
        winSfx.play(); // else play the game over (win) SFX
      }
    }
    else if(value==="incorrect"){
      setHp(hp=>hp-1);
      if(hp>1){
        playRandomSfx(failSfx); // if wrong guess hp>1 play a fail SFX
      }
    }
  }

  return (
    <main>
      {difficultySettings && <>
        <div id="hangman-UI">
          <section id="top-right">
            <div style={{width:'fit-content'}}>
              <TimerComponent timerTimeMs={timerTotalTime()} 
                    timerStart={timerStart} 
                    timerCount={gameCount}
                    setTimerComplete={setTimerComplete} 
                    setTimerStart={setTimerStart} 
                    />
              <Healthbar hp={hp} />
            </div>
          </section>
          <section id="top-left">
            <LettersLeft wordToFindArray={wordToFindArray} />
          </section>
          <section id="center">
            {(gameStatus==="playing") && 
              <PlayArea wordToFindArray={wordToFindArray} currGuess={currGuessIndex} handleGuess={handleGuess}/>}
            {(gameStatus==="won") && <SplashWin handleNewGame={()=>{
              setGameStatus("init");
              newGameSetup();
            }} />}
            {(gameStatus==="lost") && <SplashLose handleNewGame={()=>{
              setGameStatus("init");
              newGameSetup();
            }}/>}
            {(gameStatus==="init") && <SplashInit />}
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
