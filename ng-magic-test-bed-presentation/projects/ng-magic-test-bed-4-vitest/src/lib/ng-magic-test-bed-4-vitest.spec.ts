import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMagicTestBed4Vitest } from './ng-magic-test-bed-4-vitest';
import {describe, it, expect} from 'vitest';

describe('NgMagicTestBed4Vitest', () => {
  let component: NgMagicTestBed4Vitest;
  let fixture: ComponentFixture<NgMagicTestBed4Vitest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgMagicTestBed4Vitest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgMagicTestBed4Vitest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
