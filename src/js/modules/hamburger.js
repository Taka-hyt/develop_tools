import anime from 'animejs';

// ナビゲーションを開けるアニメーション

const globalNav = document.querySelector('#global_nav');
const navCover = document.querySelector('.js-nav-cover');

const openNavAnim = function() {
    const globalNavItems = Array.from(document.querySelectorAll('.l-global_nav_item'));
    globalNav.classList.remove('is-hidden');
    navCover.classList.remove('is-hidden');
    console.log('is-hiddenを追加！');
    anime({
        targets: navCover,
        opacity: [0, 1],
        easing: 'easeInOutQuad',
        duration: 300,
        complete: function() {
            console.log('背景登場！');
            anime({
                targets: globalNavItems,
                translateY: [100, 0],
                opacity: [0, 1],
                scale: [0.6, 1],
                rotate: [20, 0],
                duration: 500,
                easing: 'easeInOutCubic',
                delay: anime.stagger(120, { start: 100 }),
            });
        },
    });
};

// ナビゲーションを閉じるアニメーション
const closeNavAnim = function() {
    // const navCover = document.querySelector('.js-nav-cover');
    const globalNavItems = Array.from(document.querySelectorAll('.l-global_nav_item'));
    const reverseGlobalNavItems = globalNavItems.reverse();
    anime({
        targets: reverseGlobalNavItems,
        translateY: [0, 100],
        opacity: [1, 0],
        scale: [1, 0.6],
        rotate: [0, 20],
        duration: 400,
        easing: 'easeInOutCubic',
        delay: anime.stagger(80, { start: 100 }),
    });
    anime({
        targets: navCover,
        opacity: [1, 0],
        easing: 'easeInOutQuart',
        duration: 300,
        delay: 300,
        complete: function() {
            globalNav.classList.add('is-hidden');
            navCover.classList.add('is-hidden');
            console.log('is-hiddenを削除!!');
        },
    });
};

// ハンバーガーメニューがクリックされた時のアニメーション
const triggerHamburger = document.getElementById('js-buttonHamburger');

// ハンバーガーメニューを三と×に切り替える処理
const hamburgerAnim = function() {
    if (triggerHamburger.getAttribute('aria-expanded') == 'false') {
        triggerHamburger.setAttribute('aria-expanded', true);
        console.log('aria-expandedをtrueにしたよ');
    } else {
        triggerHamburger.setAttribute('aria-expanded', false);
        console.log('aria-expandedをfalseにしたよ');
    }
};

const checkDrawerActive = function() {
    const drawerActive = document.querySelector('body').classList.contains('is-drawerActive');
    console.log(drawerActive);

    if (drawerActive) {
        // bodyにis-drawerActiveがついている場合
        closeNavAnim();
        console.log('close');
    } else {
        // bodyにis-drawerActiveがついていない場合(false)
        openNavAnim();
        console.log('open');
    }
};

// bodyにclassをつけるだけの簡単なお仕事
// この処理を一番最後に！
const bodyToggleClass = function() {
    const body = document.querySelector('body');
    body.classList.toggle('is-drawerActive');
};

const initTriggerHamburger = function() {
    triggerHamburger.addEventListener('click', function() {
        // alert('ボタンがクリックされたよ');
        console.log('ハンバーガーメニューがクリックされたよ');

        checkDrawerActive();
        console.log('checkDrawerActiveを実行！');
        hamburgerAnim();
        console.log('hamburgerAnimを実行！');
        bodyToggleClass();
        console.log('bodyToggleClassを実行！');
    });
};

export { initTriggerHamburger };
