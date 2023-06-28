import './CSS/splashes.css';

export function SplashInit(){
    return <div className="splash-cont">
        <div className='splash-base splash-fade-in-out'>
            <h2>
                Let's Start!
            </h2>
        </div>
    </div>
}

export function SplashWin(){
    return <div className="splash-cont">
            <div className='splash-base splash-fade-in'>
                <h2 className='splash-txt-wiggle'>
                    I got it!
                </h2>
                <section className='splash-buttons'>
                        <button>New Game</button>
                </section>
            </div>
    </div>
}

export function SplashLose(){
    return <div className="splash-cont">
                <div className='splash-base splash-fade-in'>
                    <h2>
                        This can't be happening!
                    </h2>
                    <section className='splash-buttons'>
                        <button>New Game</button>
                    </section>
                </div>
        </div>
}