function getPasswordChecker(originPassword){
    if (typeof password !== 'string') return undefined;
    return function(password){
        if (typeof password !== 'string') return false;
        return password === originPassword;
    }
}

function assertEq(first, second){
    if (first !== second) throw new Error('Assertion failed!');
    return true;
}


let password = '$ecR3tPasSworD';
let checkPassword = new getPasswordChecker(password);
assertEq(checkPassword(password), true);
assertEq(checkPassword(password + ' '), false);
assertEq(checkPassword('\t' + password), false);
assertEq(checkPassword({}), false);
assertEq(checkPassword(function(){}), false);