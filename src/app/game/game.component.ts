import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
  addDoc,
  docData,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game: Game;
  games$: Observable<any>;
  gameId: string;

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {

  }


  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe((params) => {

      this.gameId = params['id'];
      const coll = collection(this.firestore, 'games');

      console.log(this.gameId);

      const docRef = doc(coll, this.gameId);


      this.games$ = docData(docRef);

      this.games$.subscribe((game: any) => {
        console.log('Game update:', game);

        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;

        console.log('Players array:', this.game.players);
        console.log('CurrentPlayer array:', this.game.currentPlayer);
        console.log('PlayedCards array:', this.game.playedCards);
        console.log('Stack array:', this.game.stack);


      })


    });



  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      console.log(this.game.currentCard);
      this.game.pickCardAnimation = true;
      console.log('New card: ' + this.game.currentCard);
      console.log('Game: ', this.game);


      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      this.saveGame();


      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {

    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }

    });
  }

  saveGame() {

    const coll = collection(this.firestore, 'games');
    const docRef = doc(coll, this.gameId);
    this.games$ = docData(docRef);

    updateDoc(doc(coll,this.gameId), this.game.toJson());

  }



}
