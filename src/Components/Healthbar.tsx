type HealthbarProps = {
    hp :number
}

function Healthbar({hp} :HealthbarProps){
    function renderHealth(){
        let i=0;
        let health :JSX.Element[] = [];
        for(let j=0;j<hp;j++){
            health.push(<span key={"health"+i}>♥</span>);
            i++;
        }
        return health;
    }

    return<div style={{fontSize: '3rem'}}>
        {renderHealth()}
    </div>
}

export default Healthbar;