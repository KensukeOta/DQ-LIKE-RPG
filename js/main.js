'use strict';

const FONT = '48px monospace';  //  使用フォント

let gFrame = 0;                 //  内部カウンタ
//  ブラウザ起動イベント
window.addEventListener('load', () => {
    setInterval(function () { WmTimer() }, 33);         //  33ms間隔で、WmTimer()を呼び出すよう指示(約30.3fps)
});

//  タイマーイベント発生時の処理
function WmTimer() {
    gFrame++                                            //  内部カウンタを加算

    const canvas = document.querySelector('canvas');    //  キャンバス要素を取得
    const ctx = canvas.getContext('2d');                //  2D描画コンテキストを取得
    ctx.font = FONT;                                    //  文字フォントを設定
    ctx.fillText('Hello World ' + gFrame, 0, 64);
}