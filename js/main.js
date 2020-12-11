"use strict";

const CHRHEIGHT = 9;					    //	キャラの高さ
const CHRWIDTH = 8;					        //	キャラの幅
const FONT = "10px monospace";		        //	使用フォント
const FONTSTYLE = "#ffffff";			    //	文字色
const HEIGHT = 120;					        //	仮想画面サイズ。高さ
const WIDTH = 128;					        //	仮想画面サイズ。幅
const INTERVAL = 33;                        //  フレーム呼び出し間隔
const MAP_HEIGHT = 32;					    //	マップ高さ
const MAP_WIDTH = 32;					    //	マップ幅
const SCR_HEIGHT = 8;                       //  画面タイルサイズの半分の高さ
const SCR_WIDTH = 8;                        //  画面タイルサイズの半分の幅
const SCROLL = 1;                           //  スクロール速度
const SMOOTH = 0;					        //	補間処理
const START_HP = 20                         //  開始HP
const START_X = 15;                         //  開始位置X
const START_Y = 17;                         //  開始位置Y
const TILECOLUMN = 4;					    //	タイル桁数
const TILEROW = 4;					        //	タイル行数
const TILESIZE = 8;					        //	タイルサイズ(ドット）
const WNDSTYLE = "rgba( 0, 0, 0, 0.75 )";	//	ウィンドウの色

const gKey = new Uint8Array(0x100);         //  キー入力バッファ

let gAngle = 0;                             //  プレイヤーの向き
let gEx = 0;                                //  プレイヤーの経験値
let gHP = START_HP;                         //  プレイヤーのHP
let gMHP = START_HP;                        //  プレイヤーの最大HP
let gLv = 1;                                //  プレイヤーのレベル
let gCursor = 0;                            //  カーソル位置
let gEnemyHP;                               //  敵HP
let gEnemyType;                             //  敵種別
let gFrame = 0;					            //	内部カウンタ
let gHeight;					            //	実画面の高さ
let gWidth;						            //	実画面の幅
let gMessage1 = null;                       //  表示メッセージ1
let gMessage2 = null;                       //  表示メッセージ2
let gMoveX = 0;                             //  移動量X
let gMoveY = 0;                             //  移動量Y
let gImgBoss;                               //  画像。ラスボス
let gImgMap;					            //	画像。マップ
let gImgMonster;					        //	画像。モンスター
let gImgPlayer;					            //	画像。プレイヤー
let gItem = 0;                              //  所持アイテム
let gOrder;                                 //  行動順
let gPhase = 0;                                 //  戦闘フェーズ
let gPlayerX = START_X * TILESIZE + TILESIZE / 2;		    //	プレイヤー座標X
let gPlayerY = START_Y * TILESIZE + TILESIZE / 2;		    //	プレイヤー座標Y
let gScreen;					            //	仮想画面


const gFileBoss = "img/boss.png";
const gFileMap = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer = "img/player.png";

const gEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];    //  敵エンカウント確率

const gMonsterName = ['スライム', 'うさぎ', 'ナイト', 'ドラゴン', '魔王'];  //  モンスター名称

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

//	ブラウザ起動イベント
window.addEventListener('load', () => {
    LoadImage();

    gScreen = document.createElement("canvas");	    //	仮想画面を作成
    gScreen.width = WIDTH;							//	仮想画面の幅を設定
    gScreen.height = HEIGHT;						//	仮想画面の高さを設定
    
    WmSize();										//	画面サイズ初期化
    window.addEventListener("resize", function () { WmSize() });	//	ブラウザサイズ変更時、WmSize()が呼ばれるよう指示
    setInterval(function () { WmTimer() }, INTERVAL);		//	33ms間隔で、WmTimer()を呼び出すよう指示（約30.3fps）
});

//	タイマーイベント発生時の処理
function WmTimer() {
    gFrame++;						//	内部カウンタを加算
    TickField();                    //  フィールド進行処理
    WmPaint();
}

function WmPaint() {
    DrawMain();

    const canvas = document.querySelector("canvas");	//	キャンバスの要素を取得
    const ctx = canvas.getContext("2d");				//	2D描画コンテキストを取得
    ctx.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight);	//	仮想画面のイメージを実画面へ転送
}

//  戦闘画面描画処理
function DrawFight(ctx) {
    ctx.fillStyle = '#000000';                          //  背景色
    ctx.fillRect(0, 0, WIDTH, HEIGHT);                  //  画面全体を矩形描画

    if (gPhase <= 5) {   //  敵が生存している場合
        if (isBoss()) {  //  ラスボスの場合
            ctx.drawImage(gImgBoss, WIDTH / 2 - gImgBoss.width / 2, HEIGHT / 2 - gImgBoss.height / 2);
        } else {
            let w = gImgMonster.width / 4;
            let h = gImgMonster.height;
            
            ctx.drawImage(gImgMonster, gEnemyType * w, 0, w, h, Math.floor(WIDTH / 2 - w / 2), Math.floor(HEIGHT / 2 - h / 2), w, h);
        }
    }

    DrawStatus(ctx)                                     //  ステータス描画
    DrawMessage(ctx);                                   //  メッセージ描画 

    if (gPhase === 2) {                                 //  戦闘フェーズがコマンド選択中の場合
        ctx.fillText('▶︎', 0.3, 96 + 14 * gCursor);          //  カーソル描画
    }
}

//  フィールド描画処理
function DrawField(ctx) {
    let mx = Math.floor(gPlayerX / TILESIZE);           //  プレイヤーのタイル座標X
    let my = Math.floor(gPlayerY / TILESIZE);           //  プレイヤーのタイル座標Y

    for (let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++) {
        let ty = my + dy;                               //  タイル座標Y
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;        //  ループ後タイル座標Y
        for (let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++) {
            let tx = mx + dx;                           //  タイル座標X
            let px = (tx + MAP_WIDTH) % MAP_WIDTH; //  ループ後タイル座標X
            DrawTile(ctx,
                tx * TILESIZE + WIDTH / 2 - gPlayerX,
                ty * TILESIZE + HEIGHT / 2 - gPlayerY,
                gMap[py * MAP_WIDTH + px]);
        }
    }

    //  プレイヤー
    ctx.drawImage(gImgPlayer,
        (gFrame >> 4 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
        WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2, CHRWIDTH, CHRHEIGHT);

    //  ステータスウィンドウ
    ctx.fillStyle = WNDSTYLE;							//	ウィンドウの色
    ctx.fillRect(2, 2, 44, 37);                       //  矩形描画

    DrawStatus(ctx)                                     //  ステータス描画
    DrawMessage(ctx);                                   //  メッセージ描画 

}

function DrawMain() {
    const ctx = gScreen.getContext("2d");				//	仮想画面の2D描画コンテキストを取得

    if (gPhase <= 1) {
        DrawField(ctx);                                       //  マップ描画
    } else {
        DrawFight(ctx);
    }
        
    // ctx.fillStyle = WNDSTYLE;							//	ウィンドウの色
    // ctx.fillRect(20, 3, 105, 15);                       //  矩形描画

    // ctx.font = FONT;									//	文字フォントを設定
    // ctx.fillStyle = FONTSTYLE;						    //	文字色
    // ctx.fillText("x=" + gPlayerX + " y=" + gPlayerY + ' m=' + gMap[my * MAP_WIDTH + mx], 25, 15);
}

//  メッセージ描画
function DrawMessage(ctx) {
    if (!gMessage1) {                                    //  メッセージが存在しない場合
        return;
    }

    ctx.fillStyle = WNDSTYLE;							//	ウィンドウの色
    ctx.fillRect(4, 84, 120, 30);                       //  矩形描画

    ctx.font = FONT;									//	文字フォントを設定
    ctx.fillStyle = FONTSTYLE;						    //	文字色
    ctx.fillText(gMessage1, 6, 96);                     //  メッセージ１行目描画
    if (gMessage2) {
        ctx.fillText(gMessage2, 6, 110);                //  メッセージ２行目描画
    }
}

//  ステータス描画
function DrawStatus(ctx) {
    ctx.font = FONT;									//	文字フォントを設定
    ctx.fillStyle = FONTSTYLE;						    //	文字色
    ctx.fillText("Lv " + gLv, 4, 13)                    //  Lv
    ctx.fillText("HP " + gHP, 4, 25)                    //  HP
    ctx.fillText("Ex " + gEx, 4, 37)                    //  Ex
}

function DrawTile(ctx, x, y, idx) {
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    ctx.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

//  ダメージ量算出
function GetDamage(a) {
    return Math.floor(a * (1 + Math.random()) )     //  攻撃力の１〜２倍
}

function isBoss() {
    return gEnemyType === gMonsterName.length - 1;
}

function LoadImage() {
    gImgBoss = new Image(); gImgBoss.src = gFileBoss;		        //	ラスボス画像読み込み
    gImgMap = new Image(); gImgMap.src = gFileMap;		            //	マップ画像読み込み
    gImgMonster = new Image(); gImgMonster.src = gFileMonster;		//	モンスター画像読み込み
    gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer;	        //	プレイヤー画像読み込み
}

function SetMessage(v1, v2) {
    gMessage1 = v1;
    gMessage2 = v2;
}

//  戦闘行動処理
function Action() {
    gPhase++;                                       //  フェーズ経過

    if ( ( (gPhase + gOrder) & 1) === 0) {          //  敵の行動順の場合
        const d = GetDamage(gEnemyType + 2);
        SetMessage(gMonsterName[gEnemyType] + 'の攻撃！', d + 'のダメージ！');
        gHP -= d;                                  //   プレイヤーのHP減少
        if (gHP <= 0) {
            gPhase = 7;                           //    死亡フェーズ
        }
        return;
    }

    //  プレイヤーの行動順
    if (gCursor === 0) {                            //  「戦う」選択時
        const d = GetDamage(gLv + 1);               //  ダメージ計算結果取得
        SetMessage('あなたの攻撃！', d + ' のダメージ！');
        gEnemyHP -= d;
        if (gEnemyHP <= 0) {
            gPhase = 5;
        }
        return;
    }

    if (Math.random() < 0.5) {                       //  「逃げる」成功時
        SetMessage('あなたは逃げ出した', null);
        gPhase = 6;
        return;
    }

    //  「逃げる」失敗時
    SetMessage('あなたは逃げ出した', 'しかし回り込まれた！');

}

//  経験値加算
function AddExp(val) {
    gEx += val;                                     //  経験値加算
    while (gLv * (gLv + 1) * 2 <= gEx) {            //  レベルアップ条件を満たしている場合
        gLv++                                       //  レベルアップ
        gMHP += 4 + Math.floor(Math.random() * 3);  //  最大HP上昇4〜6
    }
}

//  敵出現処理
function AppearEnemy(type) {
    gPhase = 1;                             //  敵出現フェーズ
    gEnemyHP = type * 3 + 5;                //  敵HP
    gEnemyType = type;
    SetMessage('敵が現れた！', null);
}

//  戦闘コマンド
function CommandFight() {
    gPhase = 2         //   戦闘コマンド選択フェーズ
    gCursor = 0;
    SetMessage('　戦う', '　逃げる');
}

//  フィールド進行処理
function TickField() {
    if (gMoveX != 0 || gMoveY != 0 || gMessage1) { }  //  移動中またはメッセージ表示中の場合
    else if (gKey[37]) { gAngle = 1; gMoveX = -TILESIZE; }    //  左
    else if (gKey[38]) { gAngle = 3; gMoveY = -TILESIZE; }    //  上
    else if (gKey[39]) { gAngle = 2; gMoveX = TILESIZE; }     //  右
    else if (gKey[40]) { gAngle = 0; gMoveY = TILESIZE; }     //  下

    //  移動後のタイル座標判定
    let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE);    //  移動後のタイル座標X
    let my = Math.floor((gPlayerY + gMoveY) / TILESIZE);    //  移動後のタイル座標Y
    mx += MAP_WIDTH;                    //  マップループ処理X
    mx %= MAP_WIDTH;                    //  マップループ処理X
    my += MAP_HEIGHT;                   //  マップループ処理Y
    my %= MAP_HEIGHT;                   //  マップループ処理Y
    let m = gMap[my * MAP_WIDTH + mx]   //  タイル番号
    if (m < 3) {
        gMoveX = 0;                     //  移動禁止X
        gMoveY = 0;                     //  移動禁止Y
    }

    if (Math.abs(gMoveX) + Math.abs(gMoveY) === SCROLL) {   //  マス目移動が終わる直前
        if (m === 8 || m === 9) {   //  お城
            gHP = gMHP;                                     //  HP全回復
            SetMessage('魔王を倒して！', null);
        }
    
        if (m === 10 || m === 11) { //  街  
            gHP = gMHP;                                     //  HP全回復
            SetMessage('西の果てにも', '村があります');
        }
    
        if (m === 12) {  //  村
            gHP = gMHP;                                     //  HP全回復
            SetMessage('カギは、', '洞窟にあります');
        }
    
        if (m === 13) {  //  洞窟
            gItem = 1;   //  カギ入手
            SetMessage('カギを手に入れた', null);
        }
    
        if (m === 14) {  //  扉
            if (gItem === 0) {              //  カギを所持していない場合
                gPlayerY -= TILESIZE;       //  １マス上へ移動
                SetMessage('カギが必要です', null);
            } else {
                SetMessage('扉が開いた', null);   
            }
        }
    
        if (m === 15) {  //  ボス
            AppearEnemy(gMonsterName.length - 1);
        }

        if (Math.random() * 8 < gEncounter[m]) {    //  ランダムエンカウント
            let type = Math.abs(gPlayerX / TILESIZE - START_X) + Math.abs(gPlayerY / TILESIZE - START_Y);
            if (m === 6) {      //  マップタイルが林だった場合
                type += 8;                      //  敵レベルを0.5上昇
            }
            if (m === 7) {      //  マップタイルが山だった場合
                type += 16;                    //   敵レベルを1上昇
            }
            type += Math.random() * 8;         //   敵レベルを0〜0.5上昇
            type = Math.floor(type / 16);
            type = Math.min(type, gMonsterName.length - 2);  //  上限処理
            AppearEnemy(type);
        }
    }

    gPlayerX += Math.sign(gMoveX) * SCROLL;      //  プレイヤー座標移動X
    gPlayerY += Math.sign(gMoveY) * SCROLL;      //  プレイヤー座標移動Y
    gMoveX -= Math.sign(gMoveX) * SCROLL;        //  移動量消費X
    gMoveY -= Math.sign(gMoveY) * SCROLL;        //  移動量消費Y

    //  マップループ処理
    gPlayerX += (MAP_WIDTH * TILESIZE);
    gPlayerX %= (MAP_WIDTH * TILESIZE);
    gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);
}

//	ブラウザサイズ変更イベント
function WmSize() {
    const canvas = document.querySelector("canvas");	//	キャンバスの要素を取得
    canvas.width = window.innerWidth;					//	キャンバスの幅をブラウザの幅へ変更
    canvas.height = window.innerHeight;					//	キャンバスの高さをブラウザの高さへ変更

    const ctx = canvas.getContext("2d");				//	2D描画コンテキストを取得
    ctx.imageSmoothingEnabled = ctx.msImageSmoothingEnabled = SMOOTH;	//	補間処理

    //	実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
    gWidth = canvas.width;
    gHeight = canvas.height;
    if (gWidth / WIDTH < gHeight / HEIGHT) {
        gHeight = gWidth * HEIGHT / WIDTH;
    } else {
        gWidth = gHeight * WIDTH / HEIGHT;
    }
}

//	キー入力(DONW)イベント
window.addEventListener('keydown', (e) => {
    let c = e.keyCode;     //  キーコード取得

    if (gKey[c] != 0) {     //  既に押下中の場合（キーリピート）
        return;
    }
    
    gKey[c] = 1;

    if (gPhase === 1) {    //   敵が現れた場合
        CommandFight();    //   戦闘コマンド
        return;
    }

    if (gPhase === 2) {   //    戦闘コマンド選択中の場合
        if (c === 13 || c === 90) {  //  Enterキー、またはZキーの場合
            gOrder = Math.floor(Math.random() * 2);  //  戦闘行動順
            Action();                //  戦闘行動処理              
        } else {
            gCursor = 1 - gCursor;  //  カーソル移動
        }
        return;
    }

    if (gPhase === 3) {
        Action();                   //  戦闘行動処理
        return;
    }

    if (gPhase === 4) {
        CommandFight();    //   戦闘コマンド
        return; 
    }

    if (gPhase === 5) {
        gPhase = 6;
        AddExp(gEnemyType + 1);     //  経験値加算
        SetMessage('敵をやっつけた！', null);
        return;
    }
    
    if (gPhase === 6) {
        if (isBoss() && gCursor === 0) {    //  敵がラスボスで、かつ「戦う」選択時
            SetMessage('魔王を倒し', '世界に平和が訪れた');
            return;
        }
        gPhase = 0;                 //  マップ移動フェーズ
    }

    if (gPhase === 7) {
        gPhase = 8;
        SetMessage('あなたは死亡した', null);
        return;
    }

    if (gPhase === 8) {
        SetMessage('ゲームオーバー', null);
        return;
    }

    gMessage1 = null;
});

//  キー入力(UP)イベント
window.addEventListener('keyup', (e) => {
    gKey[e.keyCode] = 0
});


