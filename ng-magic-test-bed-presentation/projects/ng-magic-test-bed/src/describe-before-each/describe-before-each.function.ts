
export function describeBeforeEach(describeText: string, describeCallback) {

    // let index = 0;
    // let activeIndex = 0;
    // const lastTest = test;
    // test = (text: string, callback) => {
    //     if (index === activeIndex) {
    //         callback();
    //     }
    //     index++;
    // };
    // describeCallback();
    // const maxIndex = index;
    // activeIndex++;
    // while (activeIndex<maxIndex){
    //     describeCallback();

    // }
}

export let test = function () {

};




  // describe(describeText, () => {
    //     let first = true;

    //     //while another it//TESt
    //     beforeEach(() => {
    //         if (first) {
    //             first = false;
    //             return;
    //         }
    //         const blackList = ['beforeEach', 'afterEach', 'xdescribe', 'describe', 'xit', 'it'];
    //         const originals = {};
    //         blackList.forEach(methodName => {
    //             originals[methodName] = window[methodName];
    //             window[methodName] = () => void(0);
    //         });
    //         describeCallback();
    //         blackList.forEach(methodName => window[methodName] = originals[methodName]);
    //     });

    //     describeCallback();
    // });