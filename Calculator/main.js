window.addEventListener('load', () => {



    (function () {

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
            ten: document.querySelector('#ten')
        }
        let functionals = {
            add: document.querySelector('#add'),
            subtract: document.querySelector('#subtract'),
            multiply: document.querySelector('#multiply'),
            divide: document.querySelector('#divide'),
            clear: document.querySelector('#clear'),
            equal: document.querySelector('#equals'),
            dot: document.querySelector('#decimal'),
            formula: document.querySelector('#display-formula'),
            immediate: document.querySelector('#display-immediate')
        }

        function m(elem) {
            console.log(elem)
        }

        let getInput = (elem) => {

            let val = elem.target.textContent;
            return val;

        }
        let changeDisplay = (val) => {
            let change = () => {
                functionals.formula.textContent = display.immediateVal;
                functionals.immediate.textContent = display.immediateVal;
            }
            if (val === 'C') {
                display.immediateVal = '0';
                display.formulaVal = '0';
                change();

            } else if (val === '.') {

                let regEx = /\./g;

                if (!display.immediateVal.match(regEx)) {
                    display.immediateVal += val;
                    display.formulaVal += val;
                    change();
                }
            } else {
                if (display.immediateVal === '0') {
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
                    m(arr[i])

                    arr[i].children[0].addEventListener('click', (el) => {
                        callback(el);
                    })
                }
            }
        }

        let eventHandle = () => { //handle event


            let numberHandle = () => { // number input only

                loopObj(numbers, function (el) {
                    changeDisplay(getInput(el));
                })

            }
            numberHandle();

            let functionalsHandle = () => {
                
                let caculation = (type) => {
                    let num = f
                }

                loopObj(functionals, function (el) {

                    let val = getInput(el);

                    if (val === '+' || val === '-' || val === '&Cross;' || val === '&div;') {

                        calculate(val);

                    } else {
                        changeDisplay(getInput(el));
                    }
                })

            }
            functionalsHandle();
        }
        eventHandle();

    })();
})