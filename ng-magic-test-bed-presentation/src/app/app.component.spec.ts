import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgMagicTestBed } from 'ng-magic-test-bed/peejay-solutions-ng-magic-test-bed';

describe('AppComponent', () => {
  const magic = new NgMagicTestBed();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-magic-test-bed-presentation'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ng-magic-test-bed-presentation');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ng-magic-test-bed-presentation!');
  });
});
