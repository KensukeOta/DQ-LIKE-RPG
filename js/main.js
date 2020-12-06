'use strict';

const CHRHEIGHT = 9;            //  キャラの高さ
const CHRWIDTH  = 8;            //  キャラの幅
const FONT = '48px monospace';  //  使用フォント
const HEIGHT = 120;             //  仮想画面サイズ。高さ
const WIDTH = 128;              //  仮想画面サイズ。幅
const MAP_HEIGHT = 32;          //  マップ高さ
const MAP_WIDTH = 32;           //  マップ幅
const SMOOTH = 0;               //  補間処理
const TILECOLUMN = 4;           //  タイル桁数
const TILEROW = 4;              //  タイル行数
const TILESIZE = 8;             //  タイルサイズ（ドット）

let gFrame = 0;                 //  内部カウンタ
let gHeight;                    //  実画面の高さ
let gWidth;                     //  実画面の幅
let gImgMap;                    //  画像。マップ
let gImgPlayer;                 //  画像。プレイヤー
let gPlayerX = 0;               //  プレイヤー座標X
let gPlayerY = 0;               //  プレイヤー座標Y
let gScreen;                    //  仮想画面

const gFileMap    = 'img/map.png';
const gFilePlayer = 'img/player.png';

//	マップ
const gMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6, 13, 6, 0, 0, 0,
    0, 3, 3, 10, 11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3, 12, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    7, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];

//  ブラウザ起動イベント
window.addEventListener('load', () => {
    LoadImage();

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

//  キー入力(DOWN)イベント
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            gPlayerY--;
            break;
        case 'ArrowRight':
            gPlayerX++;
            break;
        case 'ArrowDown':
            gPlayerY++
            break;
        case 'ArrowLeft':
            gPlayerX--;
            break;
    }
});

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

    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
            let px = gPlayerX + x;
            let py = gPlayerY + y;
            DrawTile(ctx, x * TILESIZE, y * TILESIZE, gMap[py * MAP_WIDTH + px]);
        }
    }

    ctx.drawImage(gImgPlayer,
                  CHRWIDTH, 0, CHRWIDTH, CHRHEIGHT,
                  WIDTH / 2, HEIGHT / 2, CHRWIDTH, CHRHEIGHT);
}

function DrawTile(ctx, x, y, idx) {
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    ctx.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

function LoadImage() {
    gImgMap = new Image();    gImgMap.src    = gFileMap;    //  マップ画像読み込み    
    gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer; //  プレイヤー画像読み込み    
}

function WmPaint() { 
    DrawMain();

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight); //  仮想画面のイメージを実画面へ転送
}
