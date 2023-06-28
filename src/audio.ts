export const coolSfx = [
    new Audio('/assets/cool1.ogg'),
    new Audio('/assets/cool2.ogg'),
    new Audio('/assets/cool3.ogg')
];

export const failSfx = [
    new Audio('/assets/fail1.ogg'),
    new Audio('/assets/fail2.ogg')
];

export function playRandomSfx(sfxArray :HTMLAudioElement[]) :void{
    const randIndex = Math.floor(Math.random()*sfxArray.length);
    sfxArray[randIndex].currentTime=0;
    sfxArray[randIndex].volume=1;
    sfxArray[randIndex].play();
}

export const winSfx = new Audio('./assets/alright.ogg');

export const gameOverSfx = new Audio('./assets/gameover.ogg');