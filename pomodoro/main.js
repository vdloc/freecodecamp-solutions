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

    function m(obj) {
        console.log(obj)
    }
    let inputControls = (state) => {

        let break_group = input.controls.break;
        let session_group = input.controls.session;

        function change_incre(obj, session) { ///incre button 

            let val = obj.value.textContent;

            if (val < 60) {
                if (session) {
                   
                    if (val < 9) {

                        input.timer.minute.textContent = '0' + ((val | 0) + 1);
                    } else {

                        input.timer.minute.textContent = (val | 0) + 1;
                    }
                }
                obj.value.textContent = (val | 0) + 1; // convert val string to number
            }

        }

        function change_decre(obj, session) { //decre button

            let val = obj.value.textContent;

            if (obj.value.textContent > 1) {
                if (session) {
                    if (val < 11) {
                        input.timer.minute.textContent = '0' + ((val | 0) - 1);
                    } else {
                        input.timer.minute.textContent = (val | 0) - 1;
                    }
                }
                obj.value.textContent -= 1;
            }

        }
        let bind = (obj, session) => {

            // incre btn
            obj.incre.addEventListener('click', change_incre(obj, session))
            // decre btn
            obj.decre.addEventListener('click', change_decre(obj, session))
        }
        let unbind = (obj) => {
            obj.incre.removeEventListener('click', change_incre())
            obj.decre.removeEventListener('click', change_decre())
        }
        if (state == 'change') {
            bind(break_group)
            bind(session_group, true)
        } else {
            m('remove')
            unbind(break_group)
            unbind(session_group)
        }
    }

    inputControls('change')

    // timer countdown

    let countdown = (state) => {

        if (state === 'play') {
            let current_second = (input.timer.second.textContent | 0);
            second = setInterval(() => {

                if (current_second === 0) {
                    current_second = 60;
                }

                current_second -= 1;

                if (current_second < 10) {
                    input.timer.second.textContent = '0' + current_second;
                } else {
                    input.timer.second.textContent = current_second;
                }

            }, 1000)

            minute = setInterval(() => {

                let current_minute = input.timer.minute.textContent;

                input.timer.minute.textContent = (current_minute | 0) - 1;

                if ((current_minute | 0) === 0 && !current_second) {
                    clearInterval(second)
                    clearInterval(minute)
                }

            }, 60 * 1000)
        } else {

            clearInterval(second)
            clearInterval(minute)
        }


    }

    let controls = () => {
        let play_pause = input.play_pause,
            reset = input.reset;

        let play_pause_state = false;

        play_pause.addEventListener('click', function () {

            if (!play_pause_state) {

                countdown('play')
                play_pause_state = true;
                inputControls('freeze')

            } else {
                inputControls('change')
                countdown('pause')
                play_pause_state = false;
            }
        })
    }
    controls();

})