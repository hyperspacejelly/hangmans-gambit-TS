import { LetterToFind } from "../App";
import './CSS/lettersleft.css';

type LettersLeftProps = {
    wordToFindArray :LetterToFind[]
}

function LettersLeft({wordToFindArray} :LettersLeftProps){
    const numLetters = wordToFindArray.filter(letter => letter.hidden === true).length; 

    return<div id="letters-left">
        <h2 className="title">Letters Left</h2>
        <h2 className="number" key={"lettersLeft"+numLetters}>{numLetters}</h2>
    </div>
}

export default LettersLeft;