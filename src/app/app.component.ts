import { Component, HostListener } from '@angular/core';
import { images, letters, wordsList } from './constants';
import { Letter } from './interfaces/letter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'hangman';
  allowedTryCount = 5;
  currentWord = [] as string[];
  displayWord = [] as string[];
  lettersState = [] as Letter[];
  images = images;
  
  GameStatus = GameStatus;

  status = GameStatus.GameOn;
  wins = 0;
  highscore = 0; 

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const letter = this.lettersState.find(a => a.letter.toLowerCase() === event.key.toLowerCase());
    if (letter && this.status === GameStatus.GameOn) {
      this.onLetterClick(letter);
    }
    if (event.key === 'Enter' && this.status === GameStatus.GameOver) {
      this.playAgain();
    }
  }

  ngOnInit() {
    this.startGame();
    this.highscore = Number(localStorage.getItem('hangman_highscore'));

  }

  startGame() {
    this.generateLettersState();
    this.selectWordRandomly();
    this.initDisplayWord();
  }

  initDisplayWord() {
    for (let i = 0; i < this.currentWord.length; i++) {
      this.displayWord.push('_');
    }
  }

  generateLettersState() {
    letters.forEach(element => {
      this.lettersState.push({ letter: element, isSelected: false, isInWord: false });
    });
  }

  selectWordRandomly() {
    const selectedIndex = Math.floor(Math.random() * wordsList.length-1);
    this.currentWord = wordsList[selectedIndex].split('');

    
    this.lettersState.forEach(item => {
      if (this.currentWord.some(a => a.toLowerCase() === item.letter.toLowerCase())) {
        item.isInWord = true;
      }
    });

  }

  onLetterClick(item: Letter) {
    if (item.isInWord && !item.isSelected) {
      this.handleCorrectAnswer(item);
    }

    if (!item.isInWord && !item.isSelected) {
      this.handleWrongAnswer(item);
    }
  }

  handleCorrectAnswer(item: Letter) {
    for (let i = 0; i < this.currentWord.length; i++) {
      const currentLetter = this.currentWord[i];

      if (currentLetter.toLowerCase() === item.letter.toLowerCase()) {
        this.displayWord[i] = item.letter;
        item.isSelected = true;
      }
    }

    if (this.currentWord.join('').toLowerCase() === this.displayWord.join('').toLowerCase()) {
      this.wins = this.wins + 1;
      
      if (this.wins > this.highscore) {
        this.highscore = this.wins;
        localStorage.setItem('hangman_highscore', this.highscore.toString());
      }
      
        this.status = GameStatus.GameWon;
      
      setTimeout(() => {
        this.clearData();
        this.status = GameStatus.GameOn;
        this.startGame();
      }, 1000);
    }
  }

  handleWrongAnswer(item: Letter) { 
    this.allowedTryCount = this.allowedTryCount - 1;
    item.isSelected = true;
    if (this.allowedTryCount === 0){
      this.status = GameStatus.GameOver;
    } 
  }

  clearData() {
    this.currentWord = [] as string[];
    this.displayWord = [] as string[];
    this.lettersState = [] as Letter[];
    this.allowedTryCount = 5;
    this.status = GameStatus.GameOn;
  }
  playAgain() {
    this.wins = 0;
    this.clearData();
    this.startGame();

  }
}

export enum GameStatus {
  GameOn,
  GameWon,
  GameOver
}

