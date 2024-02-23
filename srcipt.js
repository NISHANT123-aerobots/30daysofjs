document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.querySelector('.typing-text p');
    const input = document.querySelector('.wrapper .input-field');
    const time = document.querySelector('.time span b');
    const mistakes = document.querySelector('.mistake span');
    const wpm = document.querySelector('.wpm span');
    const cpm = document.querySelector('.cpm span');
    const btn = document.querySelector('.button');

    let timer;
    let maxTime = 60;
    let timeleft = maxTime;
    let charIndex = 0;
    let mistake = 0;
    let isTyping = false;

    function loadParagraph() {
        fetch('https://baconipsum.com/api/?type=all-meat&paras=1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                typingText.innerHTML = '';
                for (const char of data[0]) {
                    typingText.innerHTML += `<span>${char}</span>`;
                }
                typingText.querySelectorAll('span')[0].classList.add('active');
                document.addEventListener('keydown', () => input.focus());
                typingText.addEventListener('click', () => input.focus());
            })
            .catch(error => {
                console.error('There was a problem fetching the paragraph:', error);
            });
    }

    function reset() {
        clearInterval(timer);
        timeleft = maxTime;
        charIndex = 0;
        mistake = 0;
        isTyping = false;
        input.value = '';
        loadParagraph();
    }

    function initTyping() {
        const char = typingText.querySelectorAll('span');
        const typedChar = input.value.charAt(charIndex);
        if (charIndex < char.length && timeleft > 0) {
            if (!isTyping) {
                timer = setInterval(initTime, 1000);
                isTyping = true;
            }
            if (char[charIndex].innerText === typedChar) {
                char[charIndex].classList.add('correct');
            } else {
                mistake++;
                char[charIndex].classList.add('incorrect');
            }
            charIndex++;
            char[charIndex].classList.add('active');

            mistakes.innerText = mistake;
            cpm.innerText = charIndex - mistake;
        } else {
            clearInterval(timer);
            input.value = '';
        }
    }

    function initTime() {
        if (timeleft > 0) {
            timeleft--;
            time.innerText = timeleft;
            let wpmVal = Math.round((charIndex - mistake) / 5 / (maxTime - timeleft) * 60);
            wpm.innerText = wpmVal;
        } else {
            clearInterval(timer);
        }
    }

    input.addEventListener("input", initTyping);
    btn.addEventListener("click", reset);

    // Call the function to load the paragraph when the DOM is ready
    loadParagraph();
});

