import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collectionData, 
  collection, 
  setDoc, 
  doc, 
  addDoc, 
  docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor (private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    
  }

  async newGame() {
    //START GAME
    
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    let gameInfo = await addDoc(coll, game.toJson());
    
    this.router.navigateByUrl('/game/'+ gameInfo.id);
  }

}
