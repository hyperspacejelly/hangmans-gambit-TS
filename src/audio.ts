/* Exports for all the audio assets used in the game */

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

export const BGM = new Audio('/assets/hangman.ogg');
BGM.loop = true;
BGM.volume=0.8;

export const gunshot = new Audio('/assets/gunshot2.ogg');
export const emptyGunshot = new Audio('/assets/emptyGunshot.ogg');

