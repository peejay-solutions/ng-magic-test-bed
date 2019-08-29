import { TestBedBase } from './test-bed-base.class';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Type, AbstractType } from '@angular/core';
import { spyOnFunctionsOf } from '../spy-on-mock/spy-on-functions-of.function';
import { observe } from '../observe/observe.function';
import { Observable } from 'rxjs';
import { SpyObserver } from '../observe/spy-observer.class';

export class SetupTestBed extends TestBedBase {
    private originalByReturnedInstance = new Map<any, any>();

    constructor(callback: (originals: Map<any, any>) => void) {
        super({});
        callback(this.originalByReturnedInstance);
    }

    public thing<T>(getter: () => T): T {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            const newInstance = getter();
            this.originalByReturnedInstance.set(returnedInstance, newInstance);
        });
        return <T>returnedInstance;
    }

    public fixture<C>(componentClass: Type<C>, dontCompileAfterWards: boolean = false): ComponentFixture<C> {
        const returnedInstance: any = {};
        this.preJobs.push(config => {
            config.declarations.push(componentClass);
        });
        this.postJobs.push(() => {
            const newInstance = TestBed.createComponent(componentClass);
            if (!dontCompileAfterWards) {
                TestBed.compileComponents();
            }
            this.originalByReturnedInstance.set(returnedInstance, newInstance);
        });
        return returnedInstance;
    }

    public objectMock<O, M extends Partial<O>>(objectClass: AbstractType<O>, getMock: () => M, dontSpy = false):
        Partial<O> & M | jasmine.SpyObj<Partial<O> & M> {
        return <Partial<O> & M | jasmine.SpyObj<Partial<O> & M>>this.mock(undefined, getMock, dontSpy, objectClass);
    }

    public providerMock<M>(token: any, getMock: () => M, dontSpy: boolean, spySource?: AbstractType<any>) {
        return this.mock(token, getMock, dontSpy, spySource);
    }

    public factoryMock(factoryClass, instances: Array<any>) {
        return this.mock(factoryClass, () => {
            let index = -1;
            return {
                create: (...args: any) => {
                    index++;
                    return args[index];
                }
            };
        });
    }

    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock: () => M,
        dontSpy: true): Partial<S> & M;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock: () => M):
        jasmine.SpyObj<Partial<S> & M>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>): jasmine.SpyObj<Partial<S>>;
    public serviceMock<S, M extends Partial<S>>(serviceClass: AbstractType<S>, getMock?: () => M, dontSpy?: boolean):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        return this.mock(serviceClass, getMock, dontSpy, serviceClass);
    }

    private mock<S, M extends Partial<S>>(token?: any, getMock?: () => M, dontSpy?: boolean, spySource?: AbstractType<S>):
        Partial<S> & M | jasmine.SpyObj<Partial<S> & M> | jasmine.SpyObj<Partial<S>> {
        const returnedInstance: any = {};

        const targetJobs = typeof token === 'undefined' && this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(config => {
            const mock = getMock ? getMock() : {};
            if (!dontSpy) {
                spyOnFunctionsOf(mock, spySource ? spySource.prototype : undefined);
            }
            if (typeof token !== 'undefined') {
                config.providers.push({
                    useValue: mock,
                    provide: token
                });
            }
            this.originalByReturnedInstance.set(returnedInstance, mock);
        });
        return returnedInstance;
    }

    public injection<S>(Service: AbstractType<S>): S;
    /* tslint:disable */
    public injection<S>(token: any): S;
    /* tslint:enable */
    public injection<S>(token: AbstractType<S> | any): S {
        const returnedInstance: any = {};
        this.postJobs.push(() => {
            const original = TestBed.get(token);
            this.originalByReturnedInstance.set(returnedInstance, original);
        });
        return returnedInstance;
    }

    public observer<T>(getObservable: () => Observable<T>, name?: string): SpyObserver<T> {
        const returnedInstance: any = {};
        const targetJobs = this.postJobs.length > 0 ? this.postJobs : this.preJobs;
        targetJobs.push(() => {
            const observable = getObservable();
            const observer = observe(observable, name);
            this.originalByReturnedInstance.set(returnedInstance, observer);
        });
        return returnedInstance;
    }


}

