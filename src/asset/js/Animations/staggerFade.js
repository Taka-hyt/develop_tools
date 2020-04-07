import anime from 'animejs';

const staggerFadeAnim = function(target, dur, dir) {
    if (!dur) {
        dur = 2000;
    }
    if (!dir) {
        dir = 'normal';
    }
    anime({
        targets: Array.from(target.querySelectorAll('.js-staggerFadeItem')),
        translateY: [100, 0],
        // scale: [0.96, 1],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        direction: dir,
        duration: dur,
        delay: anime.stagger(200),
    });
};

const initStaggerFadeAnim = function() {
    const targets = Array.from(document.querySelectorAll('.js-staggerFadeAnim'));
    const options = {
        rootMargin: '-20% 0%',
    };
    const callback = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                staggerFadeAnim(entry.target);
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    targets.forEach(target => {
        observer.observe(target);
    });
};

export { staggerFadeAnim, initStaggerFadeAnim };
