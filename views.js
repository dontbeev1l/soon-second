const backgrounds = new BackgroundsModule(['main', 'menu']);


const S = Storage.create(
    {
        balance: 500,
        bet: 10,
        music: true,
        buys: {
            blue: true
        },
        scoop: 'b',
        collection: {

        }
    },
    {
        bet: (value, _S) => {
            if (value < 10) {
                _S.bet = 10;
            }

            if (value > _S.balance) {
                _S.bet = Math.floor(_S.balance / 10) * 10;
            }
        },

        balance: (value, _S) => {
            if (value < 10) {
                _S.balance = 100;
            }
        },

        collection: (value) => {
            Object.keys(value).forEach(key => {
                if (!value[key]) { return; }
                q('.collection img')[+key - 1].activate();
            })
        }
    }
);

const MUSICS = ['./music/1.mp3', './music/2.mp3']
let musicIndex = 0;

function play() { audioEl.play(); pauseEl.style.display = 'none'; S.music = true; }
function pause() { audioEl.pause(); pauseEl.style.display = 'block'; S.music = false; }
function pauseView() { audioEl.pause(); pauseEl.style.display = 'play'; }
function playNext() { musicIndex = (musicIndex + 1) % MUSICS.length; audioEl.src = MUSICS[musicIndex]; play(); }

new View('license',
    () => {
        backgrounds.setActive('main');
    }
);

new View('menu',
    () => {
        backgrounds.setActive('menu');
    }
);

new View('game',
    () => {
        backgrounds.setActive('menu');
        if (S.music) {
            play()
        } else {
            pause();
        }
    },
    () => {
        pauseView();
    }
);


new View('shop', () => {
    backgrounds.setActive('menu');
});

new View('collection', () => {
    backgrounds.setActive('menu');
});