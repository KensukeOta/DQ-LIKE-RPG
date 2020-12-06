'use strict';

const FONT = '48px monospace';  //  使用フォント
const HEIGHT = 120;             //  仮想画面サイズ。高さ
const WIDTH = 128;              //  仮想画面サイズ。幅
const SMOOTH = 0;               //  補間処理
const TILECOLUMN = 4;           //  タイル桁数
const TILEROW = 4;              //  タイル行数
const TILESIZE = 8;             //  タイルサイズ（ドット）

let gScreen;                    //  仮想画面
let gFrame = 0;                 //  内部カウンタ
let gHeight;                    //  実画面の高さ
let gWidth;                     //  実画面の幅
let gImgMap;                    //  画像。マップ

//  ブラウザ起動イベント
window.addEventListener('load', () => {
    gImgMap = new Image(); gImgMap.src = 'img/map.png'; //  マップ画像読み込み

    gScreen = document.createElement('canvas');         //  仮想画面を作成
    gScreen.width = WIDTH;                              //  仮想画面の幅を設定
    gScreen.height = HEIGHT;                            //  仮想画面の高さを設定
    
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

//  ブラウザサイズ変更イベント
function WmSize() {
    const canvas = document.querySelector('canvas');    //  キャンバス要素を取得
    canvas.width = window.innerWidth;                   //  キャンバスの幅をブラウザの幅へ変更
    canvas.height = window.innerHeight;                 //  キャンバスの高さをブラウザの高さへ変更

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = SMOOTH;    //  補間処理

    //  実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
    gWidth = canvas.width;
    gHeight = canvas.height;
    if (gWidth / WIDTH < gHeight / HEIGHT) {
        gHeight = gWidth * HEIGHT / WIDTH;
    } else {
        gWidth = gHeight * WIDTH / HEIGHT;
    }
}

function DrawMain() {
    const ctx = gScreen.getContext('2d');   //  仮想画面の2D描画コンテキストを取得

    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
            DrawTile(ctx, x * TILESIZE, y * TILESIZE, 12);
        }
    }

    ctx.font = FONT;        //  文字フォントを設定
    ctx.fillText('Hello World ' + gFrame, gFrame / 10, 64);
}

function DrawTile(ctx, x, y, idx) {
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    ctx.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

function WmPaint() { 
    DrawMain();

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); //  仮想画面のイメージを実画面へ転送
}
