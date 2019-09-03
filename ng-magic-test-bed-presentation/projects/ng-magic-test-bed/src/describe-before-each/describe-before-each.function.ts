import { async, TestBed } from '@angular/core/testing';

export let describeBeforeEach = originalDescribeBeforeEach;
export let describeTest = (text: string, callback: () => void) => void (0);


function originalDescribeBeforeEach(describeText: string, describeCallback) {
  describe(describeText, async () => {
    const metas = getInnerMethodMetas(describeCallback);
    metas.forEach(meta => {
      it(meta.text, () => {
        callInnerMethodAtPath(describeCallback, meta.path);
      });
    });
  });
}

function getInnerMethodMetas(describeCallback): Array<IInnerMethodMeta> {
  const metas = [];
  const originals = {};

  const propNames = ['configureTestingModule', 'get', 'compileComponents', 'configureCompiler', 'createComponent',
    'initTestEnvironment', 'overrideComponent', 'overrideDirective', 'overrideModule', 'overridePipe', 'overrideProvider',
    'overrideTemplate', 'overrideTemplateUsingTestingModule', 'resetTestEnvironment', 'resetTestingModule'];
  propNames.forEach(propName => {
    const original = TestBed[propName];
    if (typeof original === 'function') {
      originals[propName] = original;
      TestBed[propName] = () => void (0);
    }
  });

  forEachInnerMethod(describeCallback, meta => {
    metas.push(meta);
  });
  propNames.forEach(propName => {
    const fake = TestBed[propName];
    if (typeof fake === 'function') {
      TestBed[propName] = originals[propName];
    }
  });
  return metas;
}

function forEachInnerMethod(describeCallback, iterator: (meta: IInnerMethodMeta) => void, path: Array<number> = [], prefix: string = '') {
  let index = 0;
  const lastTest = describeTest;
  const lastDescribeBeforeEach = describeBeforeEach;
  describeBeforeEach = (text, callback) => {
    const innerPath = [...path, index];
    forEachInnerMethod(callback, iterator, innerPath, prefix + ' ' + text);
    index++;
  };
  describeTest = (text: string, callback) => {
    iterator({
      path: [...path, index], text: prefix + ' ' + text, callback
    });
    index++;
  };
  describeCallback();
  describeTest = lastTest;
  describeBeforeEach = lastDescribeBeforeEach;
}

interface IInnerMethodMeta {
  text: string;
  callback: () => void;
  path: Array<number>;
}

function callInnerMethodAtPath(describeCallback: () => void, path: Array<number>) {
  forEachInnerMethod(describeCallback, meta => {
    if (pathIsEqual(meta.path, path)) {
      meta.callback();
    }
  });
}

function pathIsEqual(path1: Array<number>, path2: Array<number>) {
  if (path1.length !== path2.length) {
    return false;
  }
  return path1.every((entry, index) => path2[index] === entry);
}
