window.addEventListener('load', () => {
    (function () {

        let editor = document.querySelector('#editor');
        let preview = document.querySelector('#preview');
        let option = {
            breaks: true           
        }

        preview.innerHTML = marked(editor.value,option);
        editor.style.height = preview.clientHeight + 'px';

        preview.addEventListener('resize', () => {
            editor.style.height = preview.clientHeight + 'px';
        })

        editor.addEventListener('keyup', () => {
            preview.innerHTML = marked(editor.value,option);
            editor.style.height = preview.clientHeight + 'px';
        })

    })();

    (function () {

        let editorBtn = document.querySelector('#yin-yang-editor'),
            previewBtn = document.querySelector('#yin-yang-preview');

        editorBtn.addEventListener('click', () => {

            let panel = document.querySelector("#panel-editor");  
            panel.classList.toggle('panel--full')        
            panel.nextElementSibling.classList.toggle('panel--close')

        })

        previewBtn.addEventListener('click', () => {
            let panel = document.querySelector("#panel-preview");  
            panel.classList.toggle('panel--full')            
            panel.previousElementSibling.classList.toggle('panel--close')
        })

    })();

})