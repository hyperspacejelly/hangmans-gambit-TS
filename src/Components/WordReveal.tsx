import { LetterToFind } from "../App";
import './CSS/wordreveal.css'

type WordRevealProps = {
    wordToFind:  LetterToFind[],
    currGuess: number
};

function WordReveal({wordToFind, currGuess} :WordRevealProps){

    function renderWordToFind(){
        let i = 0;

        if(currGuess < 0){
            return wordToFind.map(letter=>{
                i++;
                return(<span key={"word"+i} 
                    className={letter.hidden?"letter-hidden":"letter-displayed"}>
                    {letter.hidden?"?":letter.letter}</span>)
            })
        }

        return wordToFind.map(letter=>{
            i++;
            return(<span key={"word"+i} 
                className={
                    i===(currGuess+1)?"current-guess ":""
                    +
                    letter.hidden?"letter-hidden":"letter-displayed"}>
                {letter.hidden?"?":letter.letter}</span>)
        })
    }

    return<div id="word-display">
        <div className="letters-display">
            {renderWordToFind()}
        </div>
        <div className="bg-bar-cont">
            <span className="bg-bar"></span>
        </div>
    </div>
}

export default WordReveal;
