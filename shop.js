class Good {
    constructor(id, name, description, price, sizes=[], available=true){
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.sizes = sizes;
        this.available = !!available;
    }

    setAvaliable(value){
        this.available = !!value;
    }
}

class GoodsList {
    #goods = [];
    filter = /.*/;
    sortPrice = true;
    sortDir = false;

    get list(){
        let list = this.#goods.filter(good => this.filter.test(good.name));
        if (this.sortPrice){
            list = list.sort((a, b) => this.sortDir ? a.price - b.price : b.price - a.price);
        }
        return list;
    }

    add(good){
        if (good instanceof Good){
            this.#goods.push(good);
            return true;
        } else {
            return false;
        }
    }

    remove(good_id){
        let item_index = this.#goods.findIndex(good => good.id === good_id);
        if (item_index >= 0){
            this.#goods.splice(item_index, 1);
        }
    }
}

class BasketGood extends Good {
    amount = 0;

    constructor(good, amount){
        super(good.id, good.name, good.description, good.price, good.sizes, good.available);
        this.amount = amount;
    }
}

class Basket {
    goods = []

    get totalAmount(){
        return this.goods.reduce((total, good) => total + good.amount, 0);
    }

    get totalSum(){
        return this.goods.reduce((total, good) => total + good.amount * good.price, 0);
    }

    add(good, amount){
        if (good instanceof Good){
            let item = this.goods.find(item => item.id === good.id);
            if (item)
                item.amount +=amount;
            else
                this.goods.push(new BasketGood(good, amount));
            return true;
        }
        return false;
    }

    remove(good, amount){
        if (good instanceof Good) {
            let item_index = this.goods.findIndex(item => item.id === good.id);
            if (item_index < 0)
                return false;
            let item = this.goods[item_index];
            item.amount -= amount;
            if (item.amount < 1)
                this.goods.splice(item_index, 1);
            return true;
        }
        return false;
    }

    clear(){
        this.goods = [];
    }

    removeUnavailiable(){
        this.goods = this.goods.filter(good => good.available);
    }
}

function printBasket(basket, title){
    console.log(title);
    let maxChars = basket.goods.reduce((max, good) => max > good.name.length ? max : good.name.length, 0);
    let splitterCount = maxChars + 3;
    for (let good of basket.goods){
        console.log(good.name + Array(splitterCount + 1 - good.name.length).join('-') + good.amount + ' шт.\t' + (good.amount * good.price));
    }
    console.log('Итого' + Array(splitterCount - 4).join('-') + basket.totalAmount + ' шт.\t' + basket.totalSum);

}

let goods = new GoodsList();
goods.add(new Good(0, 'Футболка мужская', 'Мужская футболка белая', 799, ['s', 'm', 'xl'], true));
goods.add(new Good(1, 'Брюки мужские', 'Брюки мужские черные', 1399, ['xs', 'l', 'xxl'], true));
goods.add(new Good(2, 'Пиджак женский', 'Женский пиджак, белый', 10890, ['xs', 's', 'm'], true));
goods.add(new Good(3, 'Сорочка женская', 'Сорочка женская, фиолетовая', 299, ['s', 'm', 'l'], true));
goods.add(new Good(4, 'Шорты унисекс', 'Шорты, розовые', 500, ['s', 'm', 'xl'], true));
goods.add(new Good(5, 'Кимоно женское', 'Женское кимоно, разноцветное', 6900, ['l', 'xl', 'xxl', 'xxxl'], false));

let basket = new Basket();
goods.filter = /жен|унисекс/i;
for (let good of goods.list){
    basket.add(good, 1);
}
console.log('Всего женских товаров в магазине ' + basket.totalAmount + ' шт. Они стоят: ' + basket.totalSum);
basket.clear();
goods.filter = /муж|унисекс/i;
for (let good of goods.list){
    basket.add(good, 1);
}
console.log('Всего мужских товаров в магазине ' + basket.totalAmount + ' шт. Они стоят: ' + basket.totalSum);
basket.clear();

goods.remove(4);
goods.sortDir = true;
goods.filter = /.*/;
for (let good of goods.list){
    basket.add(good, 3);
}
basket.removeUnavailiable();
basket.remove(basket.goods[basket.goods.length - 1], basket.goods[basket.goods.length - 1].amount);
basket.goods[basket.goods.length - 1]
basket.remove(basket.goods[1], basket.goods[0].amount - 1);
printBasket(basket, '\nОставшиеся товары:');
