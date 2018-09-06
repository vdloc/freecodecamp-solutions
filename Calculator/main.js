window.addEventListener('load', () => {

    (function () {

        let equalTrigger = false;
        let display = {
            immediateVal: '0',
            formulaVal: ''
        }

        let numbers = {
            zero: document.querySelector('#zero'),
            one: document.querySelector('#one'),
            two: document.querySelector('#two'),
            three: document.querySelector('#three'),
            four: document.querySelector('#four'),
            five: document.querySelector('#five'),
            six: document.querySelector('#six'),
            seven: document.querySelector('#seven'),
            eight: document.querySelector('#eight'),
            nine: document.querySelector('#nine'),
            ten: document.querySelector('#ten'),
            dot: document.querySelector('#decimal')
        }
        let functionals = {
            add: document.querySelector('#add'),
            subtract: document.querySelector('#subtract'),
            multiply: document.querySelector('#multiply'),
            divide: document.querySelector('#divide'),
            clear: document.querySelector('#clear'),
            equal: document.querySelector('#equals'),
            formula: document.querySelector('#display-formula'),
            immediate: document.querySelector('#display')
        }

        function m(obj) {
            console.log(obj);
        }

        function outOfRange() {

            functionals.immediate.textContent = 'LIMIT DIGIT MET';

            setTimeout(() => {
                functionals.immediate.textContent = display.immediateVal;
            }, 500);
        }

        function caculate(str) {

            let equal = /[^.\d]/g;
            let num = /[.\d]/g;
            let equaltions = str.match(equal);
            let numbers = str.split(equal);

            numbers = numbers.map(function (item) {
                return parseFloat(item);
            })
            let init = numbers[0];

            for (let i = 1; i < numbers.length; i++) {

                if (equaltions[i - 1] === "+") {
                    m('aaa')
                    m(typeof (numbers[i]))
                    m(typeof (init))
                    init = init + numbers[i];
                } else if (equaltions[i - 1] === '-') {
                    init -= numbers[i];
                } else if (equaltions[i - 1] === '⨯') {
                    init *= numbers[i];
                } else if (equaltions[i - 1] === '÷') {
                    init /= numbers[i];
                }
            }
            return init;

        }
        let getInput = (elem) => {

            let val = elem.target.textContent;
            return val;
        }
        let changeDisplay = (val) => {

            let lastDigit = /\d$/g;
            let lastDot = /\./g;
            this.change = () => { // change díplay
                functionals.formula.textContent = display.formulaVal;
                functionals.immediate.textContent = display.immediateVal;
            };
            if (val === 'C') { //clear button
                init();

            } else if (val === '.') { //dot button
                if (equalTrigger) {
                    init();
                    equalTrigger = false;
                }
                if (!display.immediateVal.match(lastDot)) { //check when not last dot

                    display.immediateVal += val;
                    display.formulaVal += val;
                    change();
                }
            } else if (val === '+' || val === '-' || val === '⨯' || val === '÷') { ///equaltions
                if (equalTrigger) {
                    let total = /\d*$/g;
                    let checkSubtract =
                        display.formulaVal = display.formulaVal.match(total)[0];
                    equalTrigger = false;
                }
                if (lastDigit.test(display.formulaVal)) { // last char is a digit?

                    display.formulaVal += val;
                } else { // last char is a operation
                    if (val === '⨯' || val === '÷') { //prevent two operation when init
                        return false;
                    } else {
                        let length = display.formulaVal.length;
                        display.formulaVal = display.formulaVal.slice(0, length - 1);
                        display.formulaVal += val;
                        display.immediateVal = val;
                    }

                }

                display.immediateVal = val;
                change();

            } else if (val === "=") { //calculation
                if (!equalTrigger) {
                    display.immediateVal = caculate(display.formulaVal);
                    display.formulaVal += '=' + caculate(display.formulaVal);
                    change();
                    equalTrigger = true;
                }

            } else { //numbers
                if (equalTrigger) {
                    init();
                    equalTrigger = false;
                }
                if (display.formulaVal === '0' || display.immediateVal === "0") { //reset when value = zero
                    display.immediateVal = '';
                    display.formulaVal = '';
                } else if (!lastDigit.test(display.immediateVal) && !lastDot.test(display.immediateVal)) {
                    display.immediateVal = '';
                }
                display.immediateVal += val;
                display.formulaVal += val;
                change();
            }

        }

        let loopObj = (obj, callback) => { // loop throught obj

            let arr = Object.values(obj);

            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== null) {
                    arr[i].addEventListener('click', (el) => {
                        callback(el);
                    })
                }
            }
        }

        let eventHandle = () => { //handle event

            loopObj(numbers, function (el) {
                let length = display.immediateVal.length;

                if (length >= 12) {
                    outOfRange();
                } else {
                    changeDisplay(getInput(el));
                }
            })

            loopObj(functionals, function (el) {
                changeDisplay(getInput(el));
            })

        }
        eventHandle();

        function init() {
            display.immediateVal = '0';
            display.formulaVal = '';
            functionals.formula.textContent = display.formulaVal;
            functionals.immediate.textContent = display.immediateVal;
        }
        init();

    })();
})