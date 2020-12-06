'use strict';

const FONT = '48px monospace';  //  使用フォント

window.addEventListener('load', () => {
    const canvas = document.querySelector('canvas');    //  キャンバス要素を取得
    const ctx = canvas.getContext('2d');                //  2D描画コンテキストを取得
    ctx.font = FONT;                                    //  文字フォントを設定
    ctx.fillText('Hello World', 0, 64);
});