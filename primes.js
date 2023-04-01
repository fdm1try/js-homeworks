function getPrimes(count){
    const primes = [2, 3, 5, 7, 11, 13];
    let currentCount = primes.length;
    for (let i = primes[currentCount - 1] + 2; i > 0; i += 2) {        
        if (currentCount >= count)
            return currentCount > count ? primes.slice(0, count) : primes;
        let limit = Math.sqrt(i);
        for (let j = 3; j > 0; j+=2){
            if (j > limit){
                primes.push(i);
                currentCount++;
                break;
            }
            if (i % j == 0) break;
        }
    }
}

let primeCount = +process.argv[2];
if (Number.isNaN(primeCount) || primeCount <= 0){
    console.log('Не указано количество, программа завершена.');
} else {
    console.time('primes')
    let result = getPrimes(primeCount);
    console.log(result.join(', '))
    console.timeEnd('primes')
}