import { Observable } from 'rxjs';
import { SpyObserver } from './spy-observer.class';


export function observe<T>(observable: Observable<T>, name?: string) {
    return new SpyObserver<T>(observable, name);
}
