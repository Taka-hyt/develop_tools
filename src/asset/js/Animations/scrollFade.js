import anime from 'animejs';

const scrollFadeAnim = function(target) {
    anime({
        targets: target,
        translateY: [100, 0],
        scale: [0.96, 1],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 2000,
    });
};

const initScrollFadeAnim = function() {
    const targets = Array.from(document.querySelectorAll('.js-scrollFadeAnim'));
    const options = {
        rootMargin: '-20% 0%',
    };
    const callback = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollFadeAnim(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    if (targets.length) {
        targets.forEach(target => {
            observer.observe(target);
        });
    }
};

export { scrollFadeAnim, initScrollFadeAnim };
