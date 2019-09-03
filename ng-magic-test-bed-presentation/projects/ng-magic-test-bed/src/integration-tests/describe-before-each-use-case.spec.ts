import { describeBeforeEach, describeTest } from '../describe-before-each/describe-before-each.function';

//magicDescribe, magicTest :)

describeBeforeEach('DescribeBeforeEachTest', () => {

    const x = {
        count: 0
    };
    describeTest('test 1', () => {
        x.count++;
        expect(x.count).toEqual(1);
    });

    describeTest('test 2', () => {
        x.count++;
        expect(x.count).toEqual(1);
    });

    describeBeforeEach('innerDescribe', () => {
        const y = {
            count: 1
        };
        x.count++;
        describeTest('test 3', () => {
            y.count++;
            expect(x.count).toEqual(1);
            expect(y.count).toEqual(2);
        });
        describeTest('test 4', () => {
            y.count++;
            expect(x.count).toEqual(1);
            expect(y.count).toEqual(2);
        });
    });
});


describeBeforeEach('DescribeBeforeEachTest 2', () => {

    const x = {
        count: 0
    };
    describeTest('test 1', () => {
        x.count++;
        expect(x.count).toEqual(1);
    });

    describeTest('test 2', () => {
        x.count++;
        expect(x.count).toEqual(1);
    });

    describeBeforeEach('innerDescribe', () => {
        const y = {
            count: 1
        };
        x.count++;
        describeTest('test 3', () => {
            y.count++;
            expect(x.count).toEqual(1);
            expect(y.count).toEqual(2);
        });
        describeTest('test 4', () => {
            y.count++;
            expect(x.count).toEqual(1);
            expect(y.count).toEqual(2);
        });
    });
});
