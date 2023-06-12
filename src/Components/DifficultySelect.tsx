export type difficulties = "easy" | "normal" | "hard";

type DifficultySelectProps = {
    setDifficulty: (difficulty :difficulties)=>void
}

function DifficultySelect({setDifficulty} :DifficultySelectProps){

    function handleClick(param :difficulties) :void{
        setDifficulty(param);
    }

    return <div style={{fontSize: '4em'}}>
        <button onClick={()=>handleClick("easy")}>Easy</button>
        <button onClick={()=>handleClick("normal")}>Normal</button>
        <button onClick={()=>handleClick("hard")}>Hard</button>
    </div>
}

export default DifficultySelect