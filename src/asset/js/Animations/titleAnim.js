import anime from 'animejs';

const splitLetters = target => {
    const text = target.textContent;
    target.innerHTML = '';
    text.split('').forEach(function(str) {
        const character = str === ' ' ? '&nbsp;' : str;
        target.innerHTML += `<span>${character}</span>`;
    });
};

const titleAnim = function(target) {
    const spanArray = Array.from(target.querySelectorAll('span'));
    spanArray.forEach(span => {
        span.style.display = 'inline-block';
    });
    anime({
        targets: spanArray,
        // translateY: [100, 0],
        opacity: [0, 1],
        marginLeft: ['.3em', '0.05em'],
        marginRight: ['.3em', '0.05em'],
        easing: 'cubicBezier(.38,0,0,1)',
        duration: 2000,
        // delay: anime.stagger(200),
    });
};

const initTitleAnim = function() {
    const targets = Array.from(document.querySelectorAll('.js-titleAnim'));
    const options = {
        rootMargin: '-10% 0%',
    };
    const callback = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                titleAnim(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    if (targets.length) {
        targets.forEach(target => {
            observer.observe(target);
            splitLetters(target);
        });
    }
};

export { titleAnim, initTitleAnim };
