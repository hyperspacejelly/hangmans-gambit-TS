import './CSS/playarea.css';

import { letterToFind } from '../App'; 

const vowels :string[] = ["a","e","i","o","u","y"];
const consonants :string[]= ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"];

interface letterGuess {
    render: ()=>JSX.Element,
    handleClick: ()=>void 
}

class letterGuessObj implements letterGuess{
    private letter :string = "";
    private hp :number = 0;

    constructor(letter :string, hp :number){
        this.letter = letter,
        this.hp = hp
    }

    public handleClick() {
        this.hp-=1;
    }

    public render(){
        return<div className={`letter-guess hp-${this.hp}`}>
            {this.letter}
        </div>
    }
}

function genLetterGuesses(letter :string) :letterGuess[]{
    let returnArray :letterGuess[] = [];

    returnArray.push(new letterGuessObj("a", 1));
    returnArray.push(new letterGuessObj("l", 1));
    returnArray.push(new letterGuessObj(letter, 1));

    return returnArray;
}

type PlayAreaProps = {
    wordToFindArray :letterToFind[]
}

function PlayArea({wordToFindArray} :PlayAreaProps){
    const letterGuessOne = genLetterGuesses("e");
   
    return<div id="play-area-cont">
        <div id="play-area">
            {
                letterGuessOne.map((el)=>el.render())
            }
        </div>
    </div>
}

export default PlayArea;