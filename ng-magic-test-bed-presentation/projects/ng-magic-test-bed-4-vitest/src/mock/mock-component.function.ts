import { Type, Component, reflectComponentType, EventEmitter } from '@angular/core';

export type MockedComponent<T> = T & {
  [K in keyof T]: T[K] extends EventEmitter<infer U> ? T[K] : T[K];
};

export function mockComponent<T>(ComponentClass: Type<T>): Type<MockedComponent<T>> {
  const mirror = reflectComponentType(ComponentClass);
  
  if (!mirror) {
    throw new Error(`Class ${ComponentClass.name} is no Angular Component`);
  }

  const MockComponent = class {
    constructor() {
      mirror?.inputs.forEach((input) => {
        (this as any)[input.propName] = undefined;
      });

      mirror?.outputs.forEach((output) => {
        (this as any)[output.propName] = new EventEmitter<any>();
      });
    }
  };

  const configuredInputs = mirror.inputs.map(
    input => input.propName === input.templateName ? input.propName : `${input.propName}: ${input.templateName}`
  );

  const configuredOutputs = mirror.outputs.map(
    output => output.propName === output.templateName ? output.propName : `${output.propName}: ${output.templateName}`
  );

  return Component({
    selector: mirror.selector,
    template: '<ng-content></ng-content>', 
    standalone: true, 
    inputs:  configuredInputs,
    outputs: configuredOutputs
  })(MockComponent) as unknown as Type<MockedComponent<T>>;
}