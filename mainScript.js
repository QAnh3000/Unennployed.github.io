class Character {
    constructor(name, hp, attack, defend, shield, critRate, id) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.defend = defend;
        this.shield = shield;
        this.critRate = critRate;
        this.maxHp = hp;
        this.id = id;
        this.updateHpDisplay();
    }

    updateHpDisplay() {
        const hpElement = document.getElementById(this.id);
        if (hpElement) {
            hpElement.textContent = this.hp; 
        }
    }

    attackTarget(target) {
        let damage;
        const critHit = Math.random() < this.critRate; // Kiểm tra xem có phải là crit không

        if (critHit) {
            damage = (this.attack * 2) - target.defend; // Tăng sát thương cho crit
            logBattleMessage(`${this.name} performed a critical attack on ${target.name}!`);
            logBattleMessage(`${this.name} done ${damage} damage to ${target.name}`);
            attackChangeBackground('red'); // Đổi màu nền thành đỏ cho crit
        } else {
            damage = this.attack - target.defend;
            logBattleMessage(`${this.name} done ${damage} damage to ${target.name}`);
            attackChangeBackground('orange'); 
        }

        if (target.shield > 0) {
            logBattleMessage(`${target.name} đang có khiên bảo vệ.`);
            target.shield -= damage;
            if (target.shield < 0) target.shield = 0;
        } else {
            if (damage > 0) {
                target.hp -= damage;
                if (target.hp < 0) target.hp = 0;
            }
        }

        target.updateHpDisplay(); // Cập nhật HP trên HTML
    }
    heal() {
        const healAmount = 20;
        this.hp += healAmount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
        logBattleMessage(`${this.name} healed ${healAmount} HP, the current HP is : ${this.hp}`);
        this.updateHpDisplay();

        healChangeBackground();
    }

    isAlive() {
        return this.hp > 0;
    }
}
function attackChangeBackground(color) {
    const background = document.querySelector("body");
    background.style.backgroundColor = color;
    setTimeout(() => {
        background.style.backgroundColor = "white";
    }, 1000);
}
function healChangeBackground() {
    const background = document.querySelector("body");
    background.style.backgroundColor = "green";
    setTimeout(() => {
        background.style.backgroundColor = "white";
    }, 1000);
}


// Định nghĩa Boss
const boss = new Character("MrBac", 300, 30, 10, 0,0.3, "boss-hp");

// Định nghĩa các nhân vật
const warrior = new Character("Warrior", 100, 25, 15, 0, 0.2 , "warrior-hp");
const tanker = new Character("Tanker", 180, 27, 12, 0, 0.25, "tanker-hp");
const assassin = new Character("Assassin", 70, 35, 10, 0, 0.4, "assassin-hp");
const supporter = new Character("Supporter", 160, 30, 8, 0, 0.1, "supporter-hp");

// Mảng nhân vật trong team
const heroes = [warrior, tanker, assassin, supporter];

let currentTurn = 0; 

function logBattleMessage(message) {
    const battleLogDiv = document.getElementById("combatLog");
    if (battleLogDiv) {
        battleLogDiv.innerHTML += message + "<br>";
        battleLogDiv.scrollTop = battleLogDiv.scrollHeight; // Cuộn đến cuối
    }
}

function logMessage(message) {
    logBattleMessage(message); // Gọi đến logBattleMessage để ghi nhật ký
}


function playerTurn(character, action) {
    if (action === "attack") {
        character.attackTarget(boss);
    } else if (action === "heal") {
        if (character.name === "Supporter") {
            character.heal();
        } else {
            logMessage(`${character.name} can not heal, only Supporter can heal.`);
        }
    } else {
        logMessage("Invalid");
    }
}

function updateCurrentPlayerDisplay(character) {
    const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
    //currentPlayerDisplay.textContent = `Lượt của: ${character.name}`;
}

function nextTurn(action) {
    logMessage(`\n`);

    if (currentTurn % 5 === 4) {
        // Lượt của boss
        if (boss.isAlive()) {
            updateCurrentPlayerDisplay(boss); 
            boss.attackTarget(heroes[0]);
            logMessage("MrBac has finised his turn");
        } else {
            logMessage("Boss is dead");
            return;
        }
        currentTurn = 0; // Đặt lại currentTurn về 0 để Warrior thực hiện lượt kế tiếp
    } else {
        // Lượt của nhân vật trong team
        const currentHero = heroes[currentTurn % 4];
        if (currentHero.isAlive()) {
            updateCurrentPlayerDisplay(currentHero); // Cập nhật hiển thị tên của nhân vật
            const initialTurn = currentTurn; // Lưu lại giá trị currentTurn ban đầu
            playerTurn(currentHero, action);
            // Chỉ tăng currentTurn nếu action không phải là heal
            if (action !== "heal" || currentHero.name === "Supporter") {
                currentTurn++; // Chuyển sang lượt tiếp theo
            } else {
                logMessage(`Please choose other actions`);
            }
        } else {
            logMessage(`${currentHero.name} is dead`);
            currentTurn++; // Chuyển sang lượt tiếp theo ngay cả khi nhân vật bị đánh bại
        }
    }

    checkGameStatus();
}


function checkGameStatus() {
    if (!boss.isAlive()) {
        logMessage("The boss has been defeated. You and your party have won");
    } else if (heroes.every(hero => !hero.isAlive())) {
        logMessage("You have lost. The boss defeated you and your party");
    }
}

// Bắt đầu trò chơi
document.getElementById("attack-button").addEventListener("click", () => {
    nextTurn("attack");
});

document.getElementById("heal-button").addEventListener("click", () => {
    nextTurn("heal");
});
