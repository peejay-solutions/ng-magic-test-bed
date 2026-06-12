import { AppComponent } from './app.component';
 import { NgMagicSetupTestBed } from '@peejay-solutions/ng-magic-test-bed';

describe('AppComponent', () => {

  function setup(){
    const magic = new NgMagicSetupTestBed();
    const fixture = magic.fixture(AppComponent);
    return {fixture};
  }

  it('should create the app', () => {
    const {fixture} = setup();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-magic-test-bed-presentation'`, () => {
   const {fixture} = setup();
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng-magic-test-bed-presentation');
  });

  it('should render title', () => {
   const {fixture} = setup();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('ng-magic-test-bed-presentation app is running!');
  });
});
