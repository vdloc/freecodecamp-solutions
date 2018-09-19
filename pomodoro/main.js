window.addEventListener('load', () => {

    // input button
    const input = {
        reset: document.querySelector('#reset'),
        play_pause: document.querySelector('#start_stop'),
        timer: {
            minute: document.querySelector('#timer-minute'),
            second: document.querySelector('#timer-second')
        },
        controls: {
            break: {
                decre: document.querySelector('#break-decrement'),
                incre: document.querySelector('#break-increment'),
                value: document.querySelector('#break-length')
            },
            session: {
                decre: document.querySelector('#session-decrement'),
                incre: document.querySelector('#session-increment'),
                value: document.querySelector('#session-length')
            }
        }
    }
    let activeTrigger = true;



    let inputControls = () => {
        let decre_list = [input.controls.break.decre, input.controls.session.decre];
        let incre_list = [input.controls.break.incre, input.controls.session.incre]

        function decre() {

            let val = (this.previousElementSibling.textContent | 0);

            if (activeTrigger) {
                if (val > 1) {
                    val -= 1;
                    this.previousElementSibling.textContent = val;
                }

                if (this.getAttribute('id').search('session') > -1) {

                    input.timer.second.textContent = '00';
                    input.timer.minute.textContent = val;

                    if (val < 10) {
                        input.timer.minute.textContent = '0' + val;
                    }

                }
            }

        }

        function incre() {

            let val = (this.nextElementSibling.textContent | 0);

            if (activeTrigger) {
                if (val < 60) {
                    val += 1;
                    this.nextElementSibling.textContent = val;
                }
                if (this.getAttribute('id').search('session') > -1) {

                    input.timer.second.textContent = '00';
                    input.timer.minute.textContent = val;

                    if (val < 10) {
                        input.timer.minute.textContent = '0' + val;
                    }

                }
            }

        }


        function active() {
            for (let item in decre_list) {
                decre_list[item].addEventListener('click', decre, true)

            }
            for (let item in incre_list) {
                incre_list[item].addEventListener('click', incre, true)
            }

        }
        active();
    }
    inputControls()

    function addZero(val) {
        if (val < 10) {
            val = '0' + val;
        }
        return val;
    }
    // timer countdown
    let phase = false; //false >> break, true  >> session
    let phaseTrigger = false;
    let current_second = (input.timer.second.textContent | 0);
    let current_minute = (input.timer.minute.textContent | 0);
    let countdown = (state) => {

        if (state === 'play') {

            if (current_minute && !current_second) {
                current_minute -= 1;
                setTimeout(function () {
                    input.timer.minute.textContent = addZero(current_minute);
                }, 1000)
            }
            let minuteCount = 0;
            second = setInterval(() => {

                if (current_second === 0) {
                    current_second = 59;
                } else {
                    current_second -= 1;
                }

                minuteCount += 1;

                if (minuteCount === 61) {
                    current_minute -= 1;
                    minuteCount = 0;
                }
                input.timer.second.textContent = addZero(current_second);
                input.timer.minute.textContent = addZero(current_minute);

                if (!current_minute && !current_second) {

                    if (phaseTrigger) {
                        if (phase) {
                            console.log(phase)
                            countdown(0)
                            timeControl('break')

                            phase = false;
                            countdown('play')

                        } else {
                            countdown(0)
                            timeControl('session')
                            console.log(phase)
                            phase = true;
                            countdown('play')
                        }
                    }
                }

            }, 100)

        } else {
            clearInterval(second)
        }
    }

    function timeControl(phaseName) {
        let sessionPhase = () => {
            console.log('session')
            let sessionLength = input.controls.session.value.textContent;
            current_minute = addZero(sessionLength);
        }
        let breakPhase = () => {
            console.log('break')
            let breakLength = input.controls.break.value.textContent;
            console.log(breakLength)
            current_minute = addZero(breakLength);
        }
        input.timer.second.textContent = '00';
        if (phaseName === 'session') {
            sessionPhase()
        } else {
            breakPhase()
        }
    }

    function controls() {
        let play_pause = input.play_pause,
            reset = input.reset;

        let play_pause_state = true; //initial value make countdown run

        let playPause = (state) => {
            if (state) {
                phaseTrigger = true; //start a break countdown when session countdown to zero              
                countdown('play')
                phase = true; //
                play_pause_state = false; // make 
                activeTrigger = false;

            } else {
                activeTrigger = true;
                countdown('pause')
                play_pause_state = true;
                phaseTrigger = false;
            }
        }

        play_pause.addEventListener('click', function () {
            playPause(play_pause_state)

        })
        reset.addEventListener('click', function (event) {
            input.timer.minute.textContent = '25';
            input.timer.second.textContent = '00';
            input.controls.session.value.textContent = '25';
            phase = false; //false >> break, true  >> session
            phaseTrigger = false;
            current_second = (input.timer.second.textContent | 0);
            current_minute = (input.timer.minute.textContent | 0);
            countdown(0)
            playPause(false)

        })
    }
    controls();

})