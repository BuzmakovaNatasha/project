'use strict';

class ProductItem {
    constructor(product, img = 'no-photo.jpg') {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.img = img;
    }

    getHTMLString() {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="img/${this.img}" alt=photo>
                    <h3>${this.title}</h3>        
                    <p>${this.price} &#8381</p>
                    <button class="buy-btn">Добавить в корзину</button>
                </div>`;
    }
}

class ProductList {
    constructor(container = '.products') {
        this._container = container;
        this._goods = [];
        this._productObjects = [];

        this._fetchGoodsData();
        this._render();
        this.getFullPrice();
    }

    _fetchGoodsData() {
        this._goods = [
            { id: 1, title: 'Notebook', price: 1000 },
            { id: 2, title: 'Mouse', price: 100 },
            { id: 3, title: 'Keyboard', price: 250 },
            { id: 4, title: 'Gamepad', price: 150 },
        ];
    }

    _render() {
        const catalogBlock = document.querySelector(this._container);

        this._goods.forEach(good => {
            const productObject = new ProductItem(good);

            this._productObjects.push(productObject);
            catalogBlock.insertAdjacentHTML('beforeend', productObject.getHTMLString());
        });
    }

    // метод, определяющий суммарную стоимость всех товаров
    getFullPrice() {
        let fullPrice = 0;
        this._productObjects.forEach(item => {
            fullPrice += item.price;
        });
        console.log(`Суммарная стоимость всех товаров = ${fullPrice}`);
    }
}

const catalog = new ProductList();

// корзина

// для начала наверное нам нужна коллекция кнопок "Добавить в корзину"
const buyBtns = document.querySelectorAll('.buy-btn');

// также нам нужен счетчик на корзине
const cartCounter = document.querySelectorAll('.btn-cart_counter');

class CartItem {
    constructor(product, img = 'no-photo.jpg') {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.img = img;
    }

    getHTMLStringToCart() { // будет возвращаться разметка товара в корзине
        return ``;
        // img,
        // title,
        // price,
        // quantity (количество определенного товара),
        // кнопки + и - (увеличить или уменьшить quantity),
        // и кнопка "удалить товар из корзины",
        // или сделать так, чтобы товар автоматически удалялся из корзины и соответственно из массива, когда количество данного товара = 0
    }
}

class CartList {
    constructor() {
        //наверное нам нужен массив, в который будут добавляться товары, добавленные в корзину
        this.productObjectsInCart = [];
    }

    fetchProductObjectsInCart() {
        // метод, который будет заполнять массив productObjectsInCart
        // где-то здесь наверное надо назначить слушатель события (клик) на кнопке "Добавить в корзину"
    }

    renderCartList() {
        // метод, который будет выводить список товаров, добавленных в корзину
    }

    getFullPriceToCart() {
        // понадобится метод, определяющий суммарную стоимость товаров в корзине (Итого).
    }
}

// а можно ли в счетчике на корзине указывать длину массива productObjectsInCart ??
// (будет меняться количество элементов в массиве, будет меняться и счетчик...)

