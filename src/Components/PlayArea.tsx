import './CSS/playarea.css';

import { LetterToFind } from '../App'; 
import { useEffect, useState } from 'react';

const vowels :string[] = ["a","e","i","o","u","y"];
const consonants :string[]= ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"];
const gunshot = new Audio('/assets/gunshot2.ogg');
const emptyGunshot = new Audio('/assets/emptyGunshot.ogg');


type LetterGuessProps = {
    offset? :number,
    direction? : "default"|"inverse",
    hp :number,
    letter :string,
    handleGuess? :()=>void,
    ID :number
}

function genID() :number{
    return Math.floor(Math.random()*1000);
}

function LetterGuessComponent({offset = 2, direction = "default", hp, letter, handleGuess, ID} :LetterGuessProps) {
    const [coorX, setCoorX] = useState<number>(0);
    const [coorY, setCoorY] = useState<number>(0);
    const [angle, setAngle] = useState<number>(0);
    const dirNum = direction === "default" ? 1 : -1;
    const [letterHP, setLetterHP] = useState<number>(hp);

    //setup 
    useEffect(()=>{
        const updateAngleInterval = setInterval(()=>{
            setAngle(prev => 
                        (prev + (prev > 0?(0.01 * (1/prev)) : 0.005))
                    );
        }, 100);
        console.log(ID);
        return ()=>clearInterval(updateAngleInterval);
    }, []);

    useEffect(()=>{
        const updateDisplay = setInterval(()=>{
            const angleToRadian = dirNum * angle * (180 / Math.PI);
            const newX = angleToRadian * offset *  Math.cos(angleToRadian);
            const newY = angleToRadian * offset * Math.sin(angleToRadian);
            setCoorX(newX);
            setCoorY(newY);
            // console.log({angle: angle});
        }, 100);

        if(angle > 3.5){
            clearInterval(updateDisplay);
        }

        return ()=>{clearInterval(updateDisplay)}
    },[angle]);

    function handleClick(e :React.MouseEvent<HTMLDivElement>){
        e.stopPropagation();
        gunshot.currentTime=0;
        gunshot.play();
        if(letterHP > 1){
            setLetterHP(curr=>curr-1);
        }
        if(letterHP === 1){
            if(handleGuess)
                handleGuess();
        }
    }

    return( 
    <div 
        onClick={handleClick}
        style={{transform: `translate(${coorX}px, ${coorY}px)`}} 
        key={ID} 
        className={`letter-guess hp-${letterHP}`}>
            {letter}
    </div>);
}


function genLetterGuesses(letter :string, handleGuess :()=>void) :JSX.Element[]{
    let returnArray :JSX.Element[] = [];
   
    returnArray.push(<LetterGuessComponent letter={letter} hp={2} handleGuess={handleGuess} ID={genID()} />);
    // returnArray.push(<LetterGuessComponent letter={"h"} hp={3} direction='inverse' />);

    return returnArray;
}

type PlayAreaProps = {
    wordToFindArray :LetterToFind[],
    currGuess :number,
    handleGuess: ()=>void
}

function PlayArea({wordToFindArray, currGuess, handleGuess} :PlayAreaProps){
    const [letterGuess, setLetterGuess] = useState<JSX.Element[]>();
    const [letterGuessDisplay, setLetterGuessDisplay] = useState<JSX.Element[]>()

    useEffect(()=>{
        setLetterGuess(undefined)
        if(wordToFindArray[currGuess]){
            setLetterGuess(genLetterGuesses(wordToFindArray[currGuess].letter, handleGuess));
        }
    },[currGuess]);


    function handleClick(){
        emptyGunshot.currentTime=0;
        emptyGunshot.play();
    }

    return<div id="play-area-cont">
        <div id="play-area" onClick={handleClick}>
            {letterGuess && letterGuess}
        </div>
    </div>
}

export default PlayArea;