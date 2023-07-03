# hangmans-gambit-TS

An approximate recreation in React/Typescript of the minigame "Hangman's Gambit" from the videogame Danganronpa (2010). 
It was created as a way to put into practice my knowledge of Typescript (and it was a fun challenge).

## The Game

The Hangman's Gambit is a stylized variant of the classic 'hangman' game that plays during select sections of Danganronpa (2010). 
The player has to guess a word that is related the investigation and trial being conducted. 

Danganronpa has a gun motif running through most of its investigative minigames (like shooting 'evidence bullets' at contradictory statements by other characters). In the Hangman's Gambit, you have to shoot the right letter that you are currently trying to guess.

### Note 
```
Since this clone of Hangman's gambit is devoid of narrative context, 
the word list is only composed of generic 'murder investigation' vocabulary 
(e.g. 'blood', 'victim', 'knife', etc);
```

## The UI
- On the top left corner you will see how many letters you still need to guess.
- On the top right corner you will find a timer counting down and a number of hearts representing your Health Points.
- At the center of the page is the area where letters will appear.
- At the bottom of the page starting from the left is the word you need to guess with some letters hidden.

## How to play hangmans-gambit-TS

- Chose a difficulty setting. 
    *This affects the time you have and how many letters you need to guess.*
- Click on floating letters to shoot them. 
    *Their color indicates how many times you need to shoot to destroy a letter*
- Destroying the wrong letter will cost you 1 heart while destroying the right one will let you guess the next one.
- If the countdown clock reaches or your number of hearts reaches 0 the game is over.
- Guessing all the letters within the time limit will win the game.
- On a game over or win you have the ability to start a new game with a different word.
- To reset difficulty you currently need to reload the page.

## Credits

All sound effects were found on [Freesound](https://www.freesound.org):
- [Vocal samples by unfa](https://freesound.org/people/unfa/packs/9633/)
- [Gunshot sound by fastson](https://freesound.org/people/fastson/sounds/50618/)
- [Empty gunshot sound by KlawyKogut](https://freesound.org/people/KlawyKogut/sounds/154934/)

The background music and crosshair cursors my creations

**Lucien Jély**
