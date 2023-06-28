import './CSS/splashes.css';


export type difficulties = "easy" | "normal" | "hard";

type DifficultySelectProps = {
    setDifficulty: (difficulty :difficulties)=>void
}

function DifficultySelect({setDifficulty} :DifficultySelectProps){

    function handleClick(param :difficulties) :void{
        setDifficulty(param);
    }

    return <div className="splash-base" id="difficulty-select">
        <h2>Select a difficulty</h2>
        <section className="splash-buttons">
            <button onClick={()=>handleClick("easy")}>Easy</button>
            <button onClick={()=>handleClick("normal")}>Normal</button>
            <button onClick={()=>handleClick("hard")}>Hard</button>
        </section>
    </div>
}

export default DifficultySelect