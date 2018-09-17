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
        let decre_list = [input.controls.break.decre, input.controls.session.decre];
        let incre_list = [input.controls.break.incre, input.controls.session.incre]
        let session_list = [input.controls.session.incre, input.controls.session.decre]

        function decre() {
            let val = (this.previousElementSibling.textContent | 0);
           
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

        function incre() {
            let val = (this.nextElementSibling.textContent | 0);
         
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


        let active = () => {
            for (let item in decre_list) {
                decre_list[item].addEventListener('click', decre)

            }
            for (let item in incre_list) {
                incre_list[item].addEventListener('click', incre)
            }
        }

        let deactive = () => {
            for (let item in [input.controls.break.decre, input.controls.session.decre]) {
                item.removeEventListener('click', decre)
            }
            for (let item in [input.controls.break.incre, input.controls.session.incre])
                item.removeEventListener('click', incre)
        }

        if (state) {
            active()
        } else {
            deactive()
        }
    }
    inputControls(1)

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

                current_minute -= 1;

                input.timer.minute.textContent = (current_minute | 0) - 1;



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
                inputControls(true)

            } else {
                inputControls(false)
                countdown('pause')
                play_pause_state = false;
            }
        })
        reset.addEventListener('click', function (event) {
            input.timer.minute.textContent = '25';
            input.timer.second.textContent = '00';
            input.controls.session.value.textContent = '25';

        })
    }
    controls();
    window.addEventListener('click', function (event) {
        m(event.target)
    })
})