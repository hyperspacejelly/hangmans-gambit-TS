import { letterToFind } from "../App";
import './CSS/wordreveal.css'

type WordRevealProps = {
    wordToFind:  letterToFind[]
};

function WordReveal({wordToFind} :WordRevealProps){

    function renderWordToFind(){
        let i = 0;
        return wordToFind.map(letter=>{
            i++;
            return(<span key={"word"+i} className={letter.hidden?"letter-hidden":"letter-displayed"}>
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
