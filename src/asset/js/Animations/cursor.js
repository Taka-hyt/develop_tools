// マウスストーカー
// bodyタグの下に#cursorと#stalkerを作る

const cursor = document.getElementById('cursor');
const stalker = document.getElementById('stalker');
const linkElemDefault = document.querySelectorAll('a, button');
const linkElem = document.querySelectorAll('a, button');

const initCursor = function() {
    // カーソルを一旦見えなくする
    cursor.style.opacity = 0;
    stalker.style.opacity = 0;

    // スマホ、タブレットなど以外の端末のとき
    if (!navigator.userAgent.match(/(iPhone|iPad|iPod|Android|IEMobile|Opera Mini)/i)) {
        document.addEventListener('mousemove', function(e) {
            // mousemoveしたらカーソルの座標を取得して見えるようにする
            cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
            cursor.style.opacity = 1;
        });

        for (let i = 0; i < linkElemDefault.length; i++) {
            linkElemDefault[i].addEventListener('mouseover', function() {
                cursor.classList.add('is-hover');
            });
            linkElemDefault[i].addEventListener('mouseout', function() {
                cursor.classList.remove('is-hover');
            });
        }

        document.addEventListener('mousemove', function(e) {
            // mousemoveしたらカーソルの座標を取得して見えるようにする
            stalker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
            stalker.style.opacity = 1;
        });
        for (let i = 0; i < linkElem.length; i++) {
            linkElem[i].addEventListener('mousemove', function() {
                stalker.classList.add('is-hover');

                linkElem[i].addEventListener('mouseout', function() {
                    stalker.classList.remove('is-hover');
                });
            });
        }
    } else {
        return false;
    }
};

export { initCursor };
