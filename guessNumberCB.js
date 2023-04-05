const process = require('process');
const readline = require('readline');
const fs = require('fs');

const LOG_FILE_PATH = 'guessNumber.txt'

function getLogger(filePath){
    let dataToWrite = [];
    let locked = false;
    let inQueue = false;
    let lastError = null;
    function writeAll(callback){
        const runCallback = (...params) => callback && typeof callback === 'function' ? callback(...params) : null;
        if(locked){
            if (inQueue){
                return runCallback(new Error('Log queue is overflow!'));
            }
            inQueue = true;
            return setTimeout(function(){
                writeAll(function(...params){
                    inQueue = false;
                    callback(...params);
                });
            }, 1000);
        }
        if (!dataToWrite.length){
            return runCallback();
        }
        let data = dataToWrite.join('\n') + '\n';
        let count = dataToWrite.length;
        locked = true;
        fs.appendFile(filePath, data, function(err){
            lastError = err;
            dataToWrite = err ? dataToWrite : dataToWrite.slice(count, null);
            locked = false;
            return err ? runCallback(err) : null;
        });
    }

    return {
        append: function(data, callback){        
            if (data && typeof data === 'string'){
                let now = new Date();
                dataToWrite.push(`[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] ${data}`);
            }
            return writeAll(callback);
        }, 
        getUnwrittenData: () => dataToWrite.slice(),
        getLastError: () => lastError
    }
}


function newGame(rangeStart = 0, rangeEnd = 100){
    const logger = getLogger(LOG_FILE_PATH);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const exit = () => {
        if (logger.getUnwrittenData().length) {
            setTimeout(function(){
                let lastError = logger.getLastError(),
                    unwrittenData = logger.getUnwrittenData();
                if (lastError){
                    console.error(`\nВо время записи данных произошла ошибка:\n${lastError}`);
                    console.error(`Путь к файлу: ${LOG_FILE_PATH}`);
                }
                if (unwrittenData.length){
                    console.log(`Не удалось записать в журнал следующие данные:\n${unwrittenData.join('\n')}`);
                }
                rl.close();
            }, 2000)
        } else {
            console.log(`Протокол записан в файл: ${LOG_FILE_PATH}`);
        }
    }

    rangeStart = rangeStart < 0 ? 0 : rangeStart;
    const secretNumber = Math.floor(Math.random() * (rangeEnd - rangeStart) + rangeStart);
    console.log(secretNumber);
    let tryCount = 0;
    function nextTry(){
        let questionPrefix = tryCount > 0 ? `Попытка №${tryCount + 1}. ` : '';
        rl.question(`${questionPrefix}Введите число от ${rangeStart} до ${rangeEnd}: `, function(answer){ 
            let userNumber = Number(answer);
            if (Number.isNaN(userNumber) || userNumber < rangeStart || userNumber > rangeEnd){
                console.log('Число введено не верно или выходит за рамки диапазона.');
                return nextTry();
            }
            tryCount++;
            if (userNumber === secretNumber){
                console.log(`Вы угадали число с ${tryCount} попыток(ки)!`);
                logger.append(`Попытка № ${tryCount}: ${userNumber} - число угадано!`);
                return exit();
            }
            let isGreater = userNumber > secretNumber;
            console.log(isGreater ? 'Больше' : 'Меньше');
            logger.append(`Попытка № ${tryCount}: ${userNumber} - число ${isGreater ? 'больше' : 'меньше'}.`);
            return nextTry();
        });
    }
    logger.append('Начата новая игра.');
    return nextTry();
}

newGame(1, 10);