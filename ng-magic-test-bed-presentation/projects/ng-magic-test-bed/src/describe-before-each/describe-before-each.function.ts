
export function describeBeforeEach(describeText: string, describeCallback) {
    describe(describeText, () => {
        let first = true;

        beforeEach(() => {
            if (first) {
                first = false;
                return;
            }
            const blackList = ['beforeEach', 'afterEach', 'xdescribe', 'describe', 'xit', 'it'];
            const originals = {};
            blackList.forEach(methodName => {
                originals[methodName] = window[methodName];
                window[methodName] = () => void(0);
            });
            describeCallback();
            blackList.forEach(methodName => window[methodName] = originals[methodName]);
            // const old = {
            //     beforeEach: beforeEach,
            //     afterEach: afterEach,
            //     xdescribe: xdescribe,
            //     describe: describe,
            //     xit: xit,
            //     it: it
            // };
            // beforeEach = () => {
            // };
            // afterEach = () => {
            // };
            // xdescribe = () => {
            // };
            // describe = () => {
            // };
            // xit = () => {
            // };
            // it = () => {
            // };
            // describeCallback();
            // beforeEach = old.beforeEach;
            // afterEach = old.afterEach;
            // xdescribe = old.xdescribe;
            // describe = old.describe;
            // xit = old.xit;
            // it = old.it;
        });

        describeCallback();
    });
}
