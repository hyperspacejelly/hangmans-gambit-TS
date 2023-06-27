import './CSS/splashes.css';

export function SplashInit(){
    return <div className="splash-cont">
        <div className='splash-base'>
            <h2>
                Let's Start!
            </h2>
        </div>
    </div>
}

export function SplashWin(){
    return <div className="splash-cont">
            <div className='splash-base'>
                <h2>
                    I got it!
                </h2>
            </div>
    </div>
}

export function SplashLose(){
    return <div className="splash-cont">
                <div className='splash-base'>
                    <h2>
                        This can't be happening!
                    </h2>
                </div>
        </div>
}