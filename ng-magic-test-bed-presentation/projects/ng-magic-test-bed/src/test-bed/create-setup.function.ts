import { SetupTestBed } from './setup-test-bed.class';

/**
 * @ignore
 */
export function createSetup<T extends Object>(setup: (magic: SetupTestBed) => T): () => T {
    let originalsMap: Map<any, any>;
    const magic = new SetupTestBed(originals => originalsMap = originals);
    const returnedInstances = setup(magic);
    return () => {
        magic.reset();
        const result: T = <any>{};
        for (const propertyName in returnedInstances) {
            if (!returnedInstances.hasOwnProperty(propertyName)) {
                continue;
            }
            const returnedInstance = returnedInstances[propertyName];
            if (!originalsMap.has(returnedInstance)) {
                result[propertyName] = returnedInstance;
                continue;
            }
            result[propertyName] = originalsMap.get(returnedInstance);
        }
        return result;
    };
}

