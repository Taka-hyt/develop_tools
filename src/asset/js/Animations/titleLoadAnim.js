import anime from 'animejs';

const splitLetters = function() {
    const targets = document.querySelector('.js-titleLoadAnim');
    if (targets == null) {
        console.log('js-titleLoadAnimが空っぽだよ');
        return;
    }
    const text = targets.textContent;
    targets.innerHTML = '';
    text.split('').forEach(function(str) {
        const character = str === ' ' ? '&nbsp;' : str;
        targets.innerHTML += `<span>${character}</span>`;
    });
    anime({
        targets: targets,
        opacity: [0, 1],
        duration: 0,
    });
};

const initTitleLoadAnim = function() {
    splitLetters();
    const spanArray = Array.from(document.querySelectorAll('.js-titleLoadAnim span'));
    console.log(spanArray);
    spanArray.forEach(span => {
        span.style.display = 'inline-block';
    });
    anime({
        targets: spanArray,
        opacity: [0, 1],
        easing: 'cubicBezier(.38,0,0,1)',
        duration: 500,
        delay: anime.stagger(150, { start: 1500 }),
        complete: function() {
            console.log('finished');
            const titleText = document.querySelector('.js-titleLoadAnimDelay');
            anime({
                targets: titleText,
                opacity: [0, 1],
                easing: 'cubicBezier(1.000, 0.045, 0.765, 0.925)',
                duration: 500,
                complete: function() {
                    const titleImg = document.querySelector('.js-titleLoadAnimDelay2');
                    anime({
                        targets: titleImg,
                        opacity: [0, 1],
                        easing: 'cubicBezier(1.000, 0.045, 0.765, 0.925)',
                        duration: 500,
                    });
                },
            });
        },
    });
};

// splitLetters();
// export { splitLetters, titleLoadAnim };
export { initTitleLoadAnim };
