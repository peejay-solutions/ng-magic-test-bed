import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldComponent } from './field/field.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [FieldComponent, GameComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [FieldComponent, GameComponent]
})
export class MinesweeperModule { }
