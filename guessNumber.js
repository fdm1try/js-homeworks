const process = require('process');
const readline = require('readline');

function getIO(){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return {
        question: (text) => new Promise((resolve) => rl.question(text, (answer) => resolve(answer))),
        close: () => rl.close()
    };
}

async function newGame(rangeStart = 0, rangeEnd = 100){
    rangeStart = rangeStart < 0 ? 0 : rangeStart;
    const secretNumber = Math.floor(Math.random() * (rangeEnd - rangeStart) + rangeStart);
    const terminal = getIO();
    let tryCount = 0;
    while(1){
        let questionPrefix = tryCount > 0 ? `Попытка №${tryCount + 1}. ` : '';
        let number;
        try {
            number = Number(await terminal.question(`${questionPrefix}Введите число от ${rangeStart} до ${rangeEnd}: `));
            if (Number.isNaN(number) || number < rangeStart || number > rangeEnd){
                throw new Error('Число введено не верно или выходит за рамки диапазона.');
            }
        } catch(error){
            console.log(error.message);
            continue;
        }
        tryCount++;
        if (number === secretNumber){
            console.log(`Вы угадали число с ${tryCount} попыток(ки)!`);
            break;
        }
        console.log(number > secretNumber ? 'Больше' : 'Меньше');
    }
    console.log('Игра завершена.');
    terminal.close();
}

newGame(1, 10);
