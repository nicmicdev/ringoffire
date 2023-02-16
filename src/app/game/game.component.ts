import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { getDoc } from '@firebase/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;
  games$: Observable<any>;
  todos: Array<any>;

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {

  }


  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe((params) => {
      console.log(params['id']);

      const coll = collection(this.firestore, 'games');


      this.games$ = collectionData(coll);
  
      this.games$.subscribe((game: any) => {
        console.log('Game update:', game);
  
      })

    
    });

   

  }

  newGame() {
    this.game = new Game();
    console.log(this.game);  

    // const coll = collection(this.firestore, 'games');


    // let gameInfo = await addDoc(coll, {game: this.game.toJson()});

    // console.log(gameInfo);

  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      console.log('New card: ' + this.currentCard);
      console.log('Game: ', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {

    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }

    });
  }



}
