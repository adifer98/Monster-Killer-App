const ATTACK_VALUE = 10; //how hard could we hit the monster
const STRONG_ATTACK_VALUE = 20; //how hard could we hit the monster on a strong attack
const MONSTER_ATTACK_VALUE = 15; //how hard could the monster hit us
const HEAL_VALUE = 10 //the added value to our health when we choose to heal

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt("Please Choose a maximum life for you and for the monster", '100');

let chosenMaxLife = parseInt(enteredValue); //the max life chosen
let battleLog = [];

//checks if the chosen max life is not valid and changes this value
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
    chosenMaxLife = 100; //the default one
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);


//we run this function after every event that occurs and add it to our log
function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry;
    if (event === EVENT_PLAYER_ATTACK || event === EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: event,
            damage: value,
            target: 'MONSTER',
            player_Health: playerHealth,
            monster_health: monsterHealth
        };
    } else if (event === EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: event,
            damage: value,
            target: 'PLAYER',
            player_Health: playerHealth,
            monster_health: monsterHealth
        };
    } else if(event === EVENT_PLAYER_HEAL) {
        logEntry = {
            event: event,
            life_added: value,
            player_Health: playerHealth,
            monster_health: monsterHealth
        };
    }
    else if(event === EVENT_GAME_OVER)   {
         logEntry = {
             event: event,
             result: value,
             player_Health: playerHealth,
             monster_health: monsterHealth
         };
    }
    battleLog.push(logEntry);
}

//reset the health value for all the opponents
function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

//operates the monster attack on the player and then checks if the game has ended
function endRound() {
    //the monster attacks the player right after
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    //checks if the player should use his bonus life
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        removeBonusLife();
        hasBonusLife = false;
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert("You no longer have a bonus life");
    }
    writeToLog(EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    //checks if we won
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        writeToLog(EVENT_GAME_OVER, 'THE PLAYER WON', currentMonsterHealth, currentPlayerHealth);
        alert('You won!');
    }
    //checks if we lost
    if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        writeToLog(EVENT_GAME_OVER, 'THE PLAYER LOST', currentMonsterHealth, currentPlayerHealth);
        alert('You lost...');
    }
    //checks if there is a draw
    if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        writeToLog(EVENT_GAME_OVER, 'DRAW', currentMonsterHealth, currentPlayerHealth);
        alert('You have a draw');
    }

    if(currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }
}

//attacks the monster in respect to the attack mode that was chosen
function attackMonsterBy(mode) {
    let attackValue = 0;
    let event;
    if(mode === MODE_ATTACK) {
        attackValue = ATTACK_VALUE;
        event = EVENT_PLAYER_ATTACK;
    } else if(mode === MODE_STRONG_ATTACK) {
        attackValue = STRONG_ATTACK_VALUE;
        event = EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage((attackValue));
    currentMonsterHealth -= damage;
    writeToLog(event, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

//operates when we choose attack
function attackHandler() {
    attackMonsterBy(MODE_ATTACK);
}

//operates when we choose strong attack
function strongAttackHandler() {
    attackMonsterBy(MODE_STRONG_ATTACK);
}

//operates when we choose heal
function healPlayerHandler() {
    let healValue;
    if(chosenMaxLife >= currentPlayerHealth + HEAL_VALUE) {
        healValue = HEAL_VALUE;
    } else {
        alert("You can't heal to more that your max initial health");
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

//operates when we choose print log
function printLogHandler() {
    console.log(battleLog);
}


attackBtn.addEventListener('click', attackHandler);

strongAttackBtn.addEventListener('click', strongAttackHandler);

healBtn.addEventListener('click', healPlayerHandler);

logBtn.addEventListener('click', printLogHandler);