const goods = [
    {
        id: 0, 
        name: 'Футболка мужская',
        description: 'Мужская футболка белая', 
        sizes: ['s', 'm', 'xl'],
        price: 799,
        available: true
    },
    {
        id: 1, 
        name: 'Брюки мужские',
        description: 'Брюки мужские черные', 
        sizes: ['xs', 'l', 'xxl'],
        price: 1399,
        available: true
    },
    {
        id: 2, 
        name: 'Пиджак женский',
        description: 'Женский пиджак, белый', 
        sizes: ['xs', 's', 'm'],
        price: 10890,
        available: true
    },
    {
        id: 3, 
        name: 'Сорочка женская',
        description: 'Сорочка женская, фиолетовая', 
        sizes: ['s', 'm', 'l'],
        price: 299,
        available: true
    },
    {
        id: 4, 
        name: 'Шорты',
        description: 'Шорты унисекс, розовые', 
        sizes: ['s', 'm', 'xl'],
        price: 500,
        available: true
    },
    {
        id: 5, 
        name: 'Кимоно женское',
        description: 'Женское кимоно, разноцветное', 
        sizes: ['l', 'xl', 'xxl', 'xxxl'],
        price: 6900,
        available: false
    }
]

let basket = [
    {
        good: goods[0],
        amount: 1
    },
    {
        good: goods[3],
        amount: 2
    }
]

function addItemToBasket(good_id, amount=1){
    let good = goods.find(good => good.id == good_id);
    if (!good) {
        console.error('Нет товара с указанным ID!');
        return false;
    }
    if (!good.available){
        console.error('Товар "' + good.name + '" не доступен для покупки!');
        return false;
    }
    let item = basket.find(item => item.good.id == good.id)
    if (item){
        item.amount += amount;
    }
    else {
        basket.push({ good, amount });
    }
    return true;
}

function removeItemFromBasket(good_id){
    let item_index = basket.findIndex(item => item.good.id == good_id);
    if (item_index >= 0){
        return basket.splice(item_index, 1);
    }
}

function clearBasket(){
    basket = [];
}

function getTotalAmountAndSum(){
    let result = {
        totalAmount: 0,
        totalSum: 0
    };
    for (let item of basket){
        result.totalAmount += item.amount;
        result.totalSum += item.amount * item.good.price;
    }
    return result;
}

let total = getTotalAmountAndSum();
console.log('Изначально в корзине было ' + total.totalAmount + ' товар(а/ов) на сумму ' + total.totalSum);
clearBasket();
console.log('Корзина очищена...')
if (addItemToBasket(1, 4)){
    console.log('Добавлен товар "' + goods[1].name + '" (4 шт.)')
} else {
    console.log('Не удалось добавить товар...')
}
if (addItemToBasket(2, 1)){
    console.log('Добавлен товар "' + goods[2].name + '" (1 шт.)')
} else {
    console.log('Не удалось добавить товар...')
}
if (addItemToBasket(2, 1)){
    console.log('Добавлен товар "' + goods[2].name + '" (1 шт.)')
} else {
    console.log('Не удалось добавить товар...')
}
if (addItemToBasket(1, 10)){
    console.log('Добавлен товар "' + goods[1].name + '" (10 шт.)')
} else {
    console.log('Не удалось добавить товар...')
}
if (removeItemFromBasket(1)){
    console.log('Удален товар "' + goods[1].name + '"');
} else {
    console.log('Не удалось убрать товар из корзины...')
}
if (addItemToBasket(5, 1)) {
    console.log('Добавлен товар "' + goods[5].name + '" (1 шт.)')
} else {
    console.log('Не удалось добавить товар...')
}
total = getTotalAmountAndSum();
console.log('Теперь в корзине ' + total.totalAmount + ' товар(а/ов) на сумму ' + total.totalSum);