'use strict';

const FONT = '48px monospace';  //  使用フォント

let gFrame = 0;                 //  内部カウンタ
WmSize();
let gImgMap;                    //  画像。マップ

//  ブラウザ起動イベント
window.addEventListener('load', () => {
    gImgMap = new Image(); gImgMap.src = 'img/map.png'; //  マップ画像読み込み
    WmSize()                                            //  画面サイズ初期化
    window.addEventListener('resize', () => {           //  ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
        WmSize();
    });
    setInterval(function () { WmTimer() }, 33);         //  33ms間隔で、WmTimer()を呼び出すよう指示(約30.3fps)
});

//  タイマーイベント発生時の処理
function WmTimer() {
    gFrame++                                            //  内部カウンタを加算
    WmPaint();
}

function WmSize() {
    const canvas = document.querySelector('canvas');    //  キャンバス要素を取得
    canvas.width = window.innerWidth;                   //  キャンバスの幅をブラウザの幅へ変更
    canvas.height = window.innerHeight;                 //  キャンバスの高さをブラウザの高さへ変更
}

function WmPaint() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
            ctx.drawImage(gImgMap, x * 32, y * 32);
        }
    }

    ctx.font = FONT;                                    //  文字フォントを設定
    ctx.fillText('Hello World ' + gFrame, 0, 64);
}
