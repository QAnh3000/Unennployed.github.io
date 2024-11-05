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
        const critHit = Math.random() < this.critRate; 

        if (critHit) {
            damage = (this.attack * 2) - target.defend;
            logBattleMessage(`${this.name} performed a critical attack on ${target.name}!`);
            logBattleMessage(`${this.name} done ${damage} damage to ${target.name}`);
            attackChangeBackground('red'); 
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

        target.updateHpDisplay();
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



const boss = new Character("MrBac", 300, 30, 10, 0,0.3, "boss-hp");


const warrior = new Character("Warrior", 100, 25, 15, 0, 0.2 , "warrior-hp");
const tanker = new Character("Tanker", 180, 27, 12, 0, 0.25, "tanker-hp");
const assassin = new Character("Assassin", 70, 35, 10, 0, 0.4, "assassin-hp");
const supporter = new Character("Supporter", 160, 30, 8, 0, 0.1, "supporter-hp");


const heroes = [warrior, tanker, assassin, supporter];

let currentTurn = 0; 

function logBattleMessage(message) {
    const battleLogDiv = document.getElementById("combatLog");
    if (battleLogDiv) {
        battleLogDiv.innerHTML += message + "<br>";
        battleLogDiv.scrollTop = battleLogDiv.scrollHeight; 
    }
}

function logMessage(message) {
    logBattleMessage(message); 
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
    }
}

function updateCurrentPlayerDisplay(character) {
    const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
}

function nextTurn(action) {
    logMessage(`\n`);

    if (currentTurn % 5 === 4) {
        if (boss.isAlive()) {
            updateCurrentPlayerDisplay(boss); 
            boss.attackTarget(heroes[0]);
            logMessage("MrBac has finised his turn");
        } else {
            logMessage("Boss is dead");
            return;
        }
        currentTurn = 0; 
    } else {

        const currentHero = heroes[currentTurn % 4];
        if (currentHero.isAlive()) {
            updateCurrentPlayerDisplay(currentHero); 
            const initialTurn = currentTurn;
            playerTurn(currentHero, action);
            if (action !== "heal" || currentHero.name === "Supporter") {
                currentTurn++; 
            } else {
                logMessage(`Please choose other actions`);
            }
        } else {
            logMessage(`${currentHero.name} is dead`);
            currentTurn++; 
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


document.getElementById("attack-button").addEventListener("click", () => {
    nextTurn("attack");
});

document.getElementById("heal-button").addEventListener("click", () => {
    nextTurn("heal");
});
function showHealTargets() {
    document.getElementById("heal-warrior").style.display = "inline";
    document.getElementById("heal-tanker").style.display = "inline";
    document.getElementById("heal-assassin").style.display = "inline";
    document.getElementById("heal-supporter").style.display = "inline";
}


function hideHealTargets() {
    document.getElementById("heal-warrior").style.display = "none";
    document.getElementById("heal-tanker").style.display = "none";
    document.getElementById("heal-assassin").style.display = "none";
    document.getElementById("heal-supporter").style.display = "none";
}


function healTarget(target) {
    switch (target) {
        case "warrior":
            supporter.heal(warrior);
            break;
        case "tanker":
            supporter.heal(tanker);
            break;
        case "assassin":
            supporter.heal(assassin);
            break;
        case "supporter":
            supporter.heal(supporter);
            break;
        default:
            logMessage("Invalid target for healing.");
    }
    hideHealTargets();
    nextTurn();
}

Character.prototype.heal = function (target) {
    const healAmount = 20;
    target.hp += healAmount;
    if (target.hp > target.maxHp) target.hp = target.maxHp;
    logBattleMessage(`${this.name} healed ${target.name} for ${healAmount} HP.`);
    target.updateHpDisplay();
    healChangeBackground();
};


document.getElementById("heal-warrior").addEventListener("click", () => healTarget("warrior"));
document.getElementById("heal-tanker").addEventListener("click", () => healTarget("tanker"));
document.getElementById("heal-assassin").addEventListener("click", () => healTarget("assassin"));
document.getElementById("heal-supporter").addEventListener("click", () => healTarget("supporter"));

document.getElementById("heal-button").addEventListener("click", () => {
    if (heroes[currentTurn % 4].name === "Supporter") {
        showHealTargets();
    }
});

hideHealTargets();
