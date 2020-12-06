'use strict';

const FONT = '48px monospace';  //  使用フォント

let gFrame = 0;                 //  内部カウンタ
let gImgMap;                    //  画像。マップ

//  ブラウザ起動イベント
window.addEventListener('load', () => {
    gImgMap = new Image(); gImgMap.src = 'img/map.png'; //  マップ画像読み込み
    setInterval(function () { WmTimer() }, 33);         //  33ms間隔で、WmTimer()を呼び出すよう指示(約30.3fps)
});

//  タイマーイベント発生時の処理
function WmTimer() {
    gFrame++                                            //  内部カウンタを加算

    const canvas = document.querySelector('canvas');    //  キャンバス要素を取得
    const ctx = canvas.getContext('2d');                //  2D描画コンテキストを取得

    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            ctx.drawImage(gImgMap, x * 32, y * 32);
        }
    }
    
    ctx.font = FONT;                                    //  文字フォントを設定
    ctx.fillText('Hello World ' + gFrame, 0, 64);
}