import anime from 'animejs';
import { isPc } from './deviceChecker';

const getOffsetTop = function(target) {
    if (target) {
        const targetOffsetTop = target.getBoundingClientRect().top;
        const pageYOffset = window.pageYOffset;
        return targetOffsetTop + pageYOffset;
    } else {
        // ターゲットのセレクタが無いときはページトップへ戻す
        return 0;
    }
};

const calcDuration = (value, targetY) => {
    return Math.abs(window.pageYOffset - targetY) * value;
};

const getHeaderHeight = () => {
    return document.querySelector('header').offsetHeight;
};

const initSmoothScroll = function() {
    // export function initSmoothScroll() {
    const anchors = Array.from(document.querySelectorAll('a'));
    const scrollElement = window.document.scrollingElement || window.document.documentElement || window.document.body;
    anchors.forEach(function(anchor) {
        const href = anchor.getAttribute('href');
        if (href !== '#' && !href.indexOf('#')) {
            anchor.addEventListener('click', function(event) {
                event.preventDefault({ passive: false });
                const scrollToTarget = document.querySelector(href);
                const scrollToOffset = isPc ? getOffsetTop(scrollToTarget) : getOffsetTop(scrollToTarget) - getHeaderHeight();
                anime({
                    targets: scrollElement,
                    scrollTop: scrollToOffset,
                    duration: calcDuration(0.4, scrollToOffset),
                    easing: 'cubicBezier(.33,0,.34,1)',
                });
            });
        }
    });
};

export { initSmoothScroll };
