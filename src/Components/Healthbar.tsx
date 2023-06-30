import './CSS/healthbar.css';

type HealthbarProps = {
    hp :number
}

function Healthbar({hp} :HealthbarProps){
    function renderHealth(){
        let i=0;
        let health :JSX.Element[] = [];
        for(let j=0;j<hp;j++){
            health.push(<span key={"health"+i} className={j===(hp-1)?'active-heart':''}>♥</span>);
            i++;
        }
        return health;
    }

    return<div id="healthbar">
        {renderHealth()}
    </div>
}

export default Healthbar;