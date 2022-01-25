const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [], // массив всех товаров
        imgCatalog: 'img/no-photo.jpg',
        productsInCart: [], // товары в корзине
        searchLine: '',
        filtered: [], //в этот массив будут залетать товары удовлетворяющие запросу в поиске
        isVisibleCart: false,
        emptyCart: true,
        emptyList: true,
    },
    methods: {
        getRequest(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product) {
            if (this.productsInCart.includes(product)) {
                console.log('hi');
                console.log(product.id_product);
            } else {
                this.productsInCart.push(product);
                this.emptyCart = false;
            }
        },
        filterGoods(value) {
            console.log("click");
            const regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(product => regexp.test(product.product_name));
            console.log(this.filtered);
        },
    },
    computed: {
        counterBasket() {
            return this.productsInCart.length;
        },
    },
    mounted() {
        this.getRequest(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                };
                this.emptyList = false;
            })
            .catch(() => console.log('Error!'));
    }
});