'use strict';

class ProductItem {
    constructor(product, img = 'no-photo.jpg') {
        this.id = product.id_product;
        this.name = product.product_name;
        this.price = product.price;
        this.img = img;
    }

    getHTMLString() {
        return `<div class="products__item" data-id="${this.id}">
                    <img src="img/${this.img}" alt=photo>
                    <h3>${this.name}</h3>        
                    <p>${this.price} &#8381</p>
                    <button class="buy-btn" data-id="${this.id}">Добавить в корзину</button>
                </div>`;
    }

    getHTMLStringToCart() { // будет возвращаться разметка товара в корзине
        return `<div class="product-cart__item" data-id="${this.id}">
                    <img src="./img/${this.img}" alt="photo">
                    <h3>${this.name}</h3>
                    <div class="product-quantity">
                        <input type="number" data-id="${this.id}" value="1" min="0">
                    </div>
                    <p>${this.price} &#8381</p>
                </div>`;
    }
}

class ProductList {
    constructor() {
        this._goods = [];
        this._productObjects = [];

        this._fetchGoodsData();
    }

    _render() {
        this._goods.forEach(good => {
            const productObject = new ProductItem(good);

            this._productObjects.push(productObject);
            divProducts.insertAdjacentHTML('beforeend', productObject.getHTMLString());
        });
    }

    // метод, определяющий суммарную стоимость всех товаров
    getFullPrice() {
        let fullPriceAllProducts = 0;
        this._productObjects.forEach(item => {
            fullPriceAllProducts += item.price;
        });
        console.log(`Суммарная стоимость всех товаров = ${fullPriceAllProducts}`);
    }

    _fetchGoodsData() {
        getRequest(`${API}/catalogData.json`)
            .then(data => {
                this._goods = JSON.parse(data);
                this._render();
                this.getFullPrice();
            })
            .catch(() => console.log('Error!'));
    }
}

const catalog = new ProductList();

class CartList {
    constructor() {
        this.productObjectsInCart = [];

        this.renderCartList();
    }

    renderCartList() {
        let goodAddToCart = null;//переменная, в которой будет хранится новый массив с товаром, который хотят добавить в корзину.
        let fullPrice = 0;//Итоговая стоимость всех товаров в корзине
        /**
         * Функция изменяет Итоговую сумму в корзине. А также значение счетчика на корзине.
         */
        function changeTotalValueInCart() {
            basketList.productObjectsInCart.forEach(item => {
                fullPrice += item.price * document.querySelector(`.product-quantity input[data-id="${item.id}"]`).value;
            });
            totalValueInCart.textContent = `${fullPrice}`;
            fullPrice = 0;
            cartCounter.textContent = `${basketList.productObjectsInCart.length}`;//меняем значение счетчика на корзине.
        }
        /**
         * При количестве товара = 0, товар будет удаляться из корзины
         */
        function deleteFromBasket() {
            document.querySelector(`input[data-id="${goodAddToCart[0].id}"]`).addEventListener('change', function (event) {
                if (document.querySelector(`input[data-id="${event.target.getAttribute('data-id')}"]`).value == 0) {
                    basketList.productObjectsInCart.forEach(el => {
                        if (el.id == event.target.getAttribute('data-id')) {
                            document.querySelector(`.product-cart__item[data-id="${el.id}"]`).remove();
                            basketList.productObjectsInCart.splice(basketList.productObjectsInCart.indexOf(el), 1);
                        }
                    });
                }
                changeTotalValueInCart();
            });
        }
        divProducts.addEventListener('click', event => {
            if (event.target.classList.contains('buy-btn')) {
                // создаем новый массив с товаром, на котором кликнули кнопку "добавить в корзину".
                goodAddToCart = catalog._productObjects.filter(product => {
                    return product.id == event.target.getAttribute('data-id');
                });
                //если такой товар уже есть в корзине, просто увеличиваем его количество.
                if (basketList.productObjectsInCart.includes(goodAddToCart[0])) {
                    document.querySelector(`.product-quantity input[data-id="${goodAddToCart[0].id}"]`).value++;
                    changeTotalValueInCart();
                } else {
                    basketList.productObjectsInCart.push(goodAddToCart[0]);
                    basketBox.insertAdjacentHTML('afterbegin', goodAddToCart[0].getHTMLStringToCart());
                    changeTotalValueInCart();
                    deleteFromBasket();
                }
            }
        });
    }
}

const basketList = new CartList();