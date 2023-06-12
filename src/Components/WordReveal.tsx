import { letterToFind } from "../App";

type WordRevealProps = {
    wordToFind:  letterToFind[]
};

function WordReveal({wordToFind} :WordRevealProps){

    function renderWordToFind(){
        let i = 0;
        return wordToFind.map(letter=>{
            i++;
            return(<span key={"word"+i} style={{textTransform : 'uppercase', fontSize :'4rem'}}>
                {letter.hidden?"X":letter.letter}</span>)
        })
    }

    return<div>
        {renderWordToFind()}
    </div>
}

export default WordReveal;
