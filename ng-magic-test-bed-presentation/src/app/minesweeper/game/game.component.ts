import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public rows = [[1, 2, 3], [1, 2, 3]];

  constructor() { }

  ngOnInit() {
  }

}
