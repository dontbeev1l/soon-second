const vC = new ViewController().setView('license');


class Game {
    constructor() {
        q('.game__dog-wrapper>img').forEach((el) => {
            el.setAttribute('data-first', el.getAttribute('src'));
        });

        this.genAround();
        this.drowWins();
    }

    genAround() {
        if (S.scoop === 'b') {
            this.genAround1();
        } else if (S.scoop === 'p') {
            this.genAround2();
        } else if (S.scoop === 'y') {
            this.genAround3();
        }
    }

    genAround1() {
        q('.game-dog-anim').forEach(e => e.style.display = 'none');
        q('.game-dog-anim')[0].style.display = 'block';
        this.around = [];
        this.addAround(1, 4, 7, 0);
        this.addAround(5, 8, 4, 1);
        this.addAround(9, 12, 2, 3);
        this.addAround(13, 16, 1, 5);
    }

    genAround2() {
        q('.game-dog-anim').forEach(e => e.style.display = 'none');
        q('.game-dog-anim')[1].style.display = 'block';
        this.around = [];
        this.addAround(1, 4, 8, 0);
        this.addAround(5, 8, 4, 1);
        this.addAround(9, 12, 2, 3);
        this.addAround(13, 16, 1, 5);
    }

    genAround3() {
        q('.game-dog-anim').forEach(e => e.style.display = 'none');
        q('.game-dog-anim')[2].style.display = 'block';
        this.around = [];
        this.addAround(1, 4, 8, 0);
        this.addAround(5, 8, 4, 1);
        this.addAround(9, 12, 2, 3);
        this.addAround(13, 16, 2, 5);
    }

    addAround(from, to, count, coef) {
        for (let i = from; i <= to; i++) {
            for (let j = 0; j < count; j++) {
                this.around.push({ id: i, texture: `./img/a${i}.png`, coef });
            }
        }
    }

    spin() {
        if (S.balance < S.bet) { return; }
        if (this.blocked) { return; }
        q('.btn_catch').addClass('btn_disabled');
        this.blocked = true;
        S.balance -= S.bet;
        q('.game__dog-wrapper>img').forEach((el) => {
            el.setAttribute('src', el.getAttribute('data-animation'));
        });
        setTimeout(() => {
            this.setWin();
        }, 680);
    }

    drowWins() {
        let html = '';

        html += this.genRow(S.bet * 0, 1);
        html += this.genRow(S.bet * 1, 5);
        html += this.genRow(S.bet * 3, 9);
        html += this.genRow(S.bet * 5, 13);

        q('.wins-content').setHTML(html);
    }

    genRow(sum, from) {
        return `<div>${sum}</div><div class="win-bet-imgs"><img src="./img/a${from}.png"><img src="./img/a${from + 1}.png"><img src="./img/a${from + 2}.png"><img src="./img/a${from + 3}.png"></div>`
    }

    setWin() {
        const win = this.around.randomElement();
        if (!S.collection[`${win.id}`]) {
            S.collection[`${win.id}`] = true;
            S.collection = S.collection;
            q('.message').setHTML(`<div class="msg">+1 collection <img src="${win.texture}"></div>`)
        }
        let winSum = S.bet * win.coef;
        q('.win__sum').setHTML(`+${winSum}`);
        q('.win__sum').activate();
        setTimeout(() => {
            q('.win__sum').deactivate();
            this.preventAnimation();
        }, 1000);
        S.balance += winSum;
        q('.win_animal').setHTML(`<img class="game__win" src="${win.texture}">`);
    }

    preventAnimation() {
        this.blocked = false;
        q('.btn_catch').removeClass('btn_disabled');
        q('.win_animal').setHTML('');
        q('.game__dog-wrapper>img').forEach((el) => {
            el.setAttribute('src', el.getAttribute('data-first'));
        });
    }
}

const game = new Game();

class Shop {
    constructor() {
        this.initShop();
        this.updateShop();
        this.menuDog();
    }

    initShop() {
        q('.btn_buy').forEach((el) => {
            const scoop = el.getAttribute('data-scoop');
            const price = { purple: 1000, yellow: 3000 }[scoop];
            el.addEventListener('click', () => {
                if (S.balance > price) {
                    S.balance -= price;
                    S.buys[scoop] = true;
                    S.buys = S.buys;
                    this.updateShop();
                }
            });
        })

        q('.btn_select').forEach((el) => {
            el.addEventListener('click', () => {
                const scoop = el.getAttribute('data-scoop');
                S.scoop = scoop;
                this.menuDog();
            });
        });
    }

    menuDog() {
        q('.dog-scoop').forEach(el => {
            el.setAttribute('src', `./img/scoop_${S.scoop}.png`);
        })
        game.genAround();
    }

    updateShop() {
        if (S.buys.purple) {
            q('.scoops .scoop')[1].classList.add('buyed');
            q('.scoops .scoop .scoop__pice')[1].innerHTML = '';

        }
        if (S.buys.yellow) {
            q('.scoops .scoop')[2].classList.add('buyed');
            q('.scoops .scoop .scoop__pice')[2].innerHTML = '';
        }
    }
}

const shop = new Shop();

q('.btn_catch').on('click', () => game.spin());
q('.wood_pice_m').on('click', () => { S.bet -= 10; game.drowWins() });
q('.wood_pice_p').on('click', () => { S.bet += 10; game.drowWins() });
