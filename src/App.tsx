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
  for(let i=0;i<word.length;i++){
    returnArray.push({
      hidden: hiddenLetters.includes(i)?true:false,
      letter:word.split('')[i]
    });
  }

  return returnArray;
}

function getFirstHiddenLetter(wordToFindArray :LetterToFind[]) :number{
  return wordToFindArray.findIndex((el)=>el.hidden);
}

function App() {
  // stores difficulty settings chosen by player
  const [difficultySettings, setDifficultySettings] = useState<difficultySettings | null>(null);
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

  //Checks loss conditions
  useEffect(()=>{
    if(timerComplete || hp === 0){
      if(gameStatus==="playing"){
        console.log({
          timerComplete: timerComplete,
          hp: hp,
          gameStatus: gameStatus
        });

        setGameStatus("lost");
        gameOverSfx.play();
      }
      if(!timerComplete){
        setTimerStart(false);
      }
    }
  },[hp, timerComplete]);

  useEffect(()=>{
    // when game starts, start timer
    if(gameStatus === "playing"){
      setTimerStart(true);
    }
  },[gameStatus]);

  // sets difficulty and generates an array with the right amount of hidden letters
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


  // calculates the total time for the countdown based on difficulty and number of hidden letters
  function timerTotalTime() :number{
    let returnValue :number = 0;
    if(difficultySettings && wordToFind){
      returnValue = Math.ceil(wordToFind.length * (1 - difficultySettings.hiddenLettersRatio)) * (difficultySettings.totalTimeRatio * settings.baseTimePerLetterMs);
    }
    return returnValue;
  }

  //fct to execute if the current letter to guess has been guessed
  function handleGuess(value :'correct' | 'incorrect') :void{
    if(value==="correct"){
      setWordToFindArray(prevArray => prevArray.map((letter, index)=>{
        return index===currGuessIndex? {hidden:false, letter: letter.letter} : letter
      }));
      if(wordToFindArray.filter((el)=>el.hidden).length>1){
        playRandomSfx(coolSfx);
      }
      else{
        winSfx.currentTime=0;
        winSfx.play();
      }
    }
    else if(value==="incorrect"){
      setHp(hp=>hp-1);
      if(hp>1){
        playRandomSfx(failSfx);
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
