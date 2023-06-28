import './CSS/playarea.css';

import { LetterToFind } from '../App'; 
import { useEffect, useRef, useState } from 'react';

const gunshot = new Audio('/assets/gunshot2.ogg');
const emptyGunshot = new Audio('/assets/emptyGunshot.ogg');
const maxLettersOnScreen = 6;

type LetterGuess = {
    id :number,
    letter :string,
    hp :number,
    angle :number,
    speed :number,
}

type LetterGuessProps = {
    letterGuess :LetterGuess,
    updateLetterGuesses :(updatedLetter :LetterGuess, param :updateParams)=>void,
    handleGuess: ()=>void,
    playArea: null | HTMLDivElement
}

type updateParams = 'update' | 'destroy';

function genID() :number{
    return Math.floor(Math.random()*100000);
}

function randomPercent() :number{
    return Math.floor(Math.random() * 100);
}

function randomRadiansAngle() :number{
    return (Math.floor(Math.random() * 359)) * (Math.PI / 180);
}

function randomLetter(exclude :string) :string{
    // if excluded letter is Capital get its corresponding small letter UTF code 
    let excludedLetterCode = exclude.charCodeAt(0) < 91 ? exclude.charCodeAt(0) : exclude.charCodeAt(0) + 32; 

    let returnLetter = 0;
    do{
        returnLetter = 97 + Math.floor(Math.random() * 26);
    }while(returnLetter === excludedLetterCode);

    return String.fromCharCode(returnLetter);
}

//This function will  generate a random letter witha  change of being the current one to guess
function genRandomLetterGuess(letter :string) :LetterGuess{
    const randomCutoff = 30;

    if(randomPercent() > randomCutoff){
        return {
            id :genID(),
            letter: randomLetter(letter), 
            hp: randomPercent() > 49 ? 1 : 2,
            angle: randomRadiansAngle(),
            speed: 1.2 + (Math.random()*1.7),
        }
    }

    return {
        id :genID(),
        letter: letter,
        hp: randomPercent() > 49 ? 1 : 2,
        angle: randomRadiansAngle(),
        speed: 1.2 + (Math.random()*1.7),
    }
}

function LetterGuessComponent({letterGuess, updateLetterGuesses, handleGuess, playArea} :LetterGuessProps) {
    const [coorX, setCoorX] = useState<number>(0);
    const [coorY, setCoorY] = useState<number>(0);
    const [distance, setDistance] = useState<number>(1);
    const intervalMov = useRef<number>();

    const areaHeight = playArea?.getBoundingClientRect().height;
    const areaWidth = playArea?.getBoundingClientRect().width;

    useEffect(()=>{
        intervalMov.current = setInterval(()=>{
            if(areaHeight && areaWidth){
                if(Math.abs(coorX) >= areaWidth/2 || Math.abs(coorY) >= areaHeight/2){
                    updateLetterGuesses(letterGuess, 'destroy');
                }
                else{
                    setDistance(prev => prev+(letterGuess.speed));
                    setCoorX(Math.cos(letterGuess.angle)*distance);
                    setCoorY(Math.sin(letterGuess.angle)*distance);
                }
            }
        }, 30); 

        return ()=>{
            clearInterval(intervalMov.current);
        }
    },[distance, coorX, coorY])
    
    function handleClick(e :React.MouseEvent<HTMLDivElement>){
        e.stopPropagation();
        gunshot.currentTime=0;
        gunshot.play();
        if(letterGuess.hp > 1){
            updateLetterGuesses({
                ...letterGuess,
                hp: letterGuess.hp-1
            }, 'update');
        }
        if(letterGuess.hp === 1){
            handleGuess();
            updateLetterGuesses(letterGuess, 'destroy');
        }
    }

    return( 
    <div 
        onClick={handleClick}
        style={{left: `${coorX}px`, top:`${coorY}px`}} 
        key={letterGuess.id} 
        className={`letter-guess hp-${letterGuess.hp}`}>
            {letterGuess.letter}
    </div>);
}

type PlayAreaProps = {
    wordToFindArray :LetterToFind[],
    currGuess :number,
    handleGuess: (value :'correct' | 'incorrect')=>void
}

function PlayArea({wordToFindArray, currGuess, handleGuess} :PlayAreaProps){
    const [letterGuesses, setLetterGuesses] = useState<LetterGuess[]>([]);

    const refLoop = useRef<number>();
    const refPlayArea = useRef<HTMLDivElement>(null)


    useEffect(()=>{
        if(wordToFindArray[currGuess]){
            if(letterGuesses[0] === undefined){
                const newLetterGuess = genRandomLetterGuess(wordToFindArray[currGuess].letter);
                setLetterGuesses([...letterGuesses, newLetterGuess])
            }
            refLoop.current=setInterval(()=>{
                const newLetterGuess = genRandomLetterGuess(wordToFindArray[currGuess].letter);
                if(letterGuesses.length<maxLettersOnScreen){
                    setLetterGuesses([...letterGuesses, newLetterGuess]);
                }else{
                    updateLetterGuesses(letterGuesses[0], 'destroy');
                }
            }, 2000);
        }
        return ()=>{if(refLoop.current){clearInterval(refLoop.current);}}
    },[currGuess, letterGuesses]);

    function updateLetterGuesses(updatedLetter :LetterGuess, param :updateParams) :void{
        if(letterGuesses){
            if(param === 'update'){
                setLetterGuesses(letterGuesses.map((letter)=>{
                    if(letter.id === updatedLetter.id){
                        return updatedLetter;
                    }
                    return letter;
                }));
            }
            else if(param === "destroy"){
                const newLetterGuess = genRandomLetterGuess(wordToFindArray[currGuess].letter);
                const filteredLetterGuesses = letterGuesses.filter((letter)=>letter.id!==updatedLetter.id);
                if(filteredLetterGuesses.length < maxLettersOnScreen){
                    setLetterGuesses([...filteredLetterGuesses, newLetterGuess]);
                }else{
                    setLetterGuesses(filteredLetterGuesses);
                }
            }
        }
    }

    function handleClick(){
        emptyGunshot.currentTime=0;
        emptyGunshot.play();
    }

    return<div id="play-area-cont">
        <div id="play-area" onClick={handleClick} ref={refPlayArea}>
            <div id="spawn-area">
                {letterGuesses && letterGuesses.map((letter)=>{
                    const isCorrect = letter.letter === wordToFindArray[currGuess].letter;
                    return <LetterGuessComponent 
                        key={letter.id}
                        letterGuess={letter} 
                        handleGuess={()=>handleGuess(isCorrect? 'correct': 'incorrect')} 
                        updateLetterGuesses={updateLetterGuesses}
                        playArea={refPlayArea.current}
                        />
                })}
            </div>
        </div>
    </div>
}

export default PlayArea;