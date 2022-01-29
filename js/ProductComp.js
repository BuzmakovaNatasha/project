Vue.component('products', {
    data: () => ({
        catalogUrl: '/catalogData.json',
        imgCatalog: 'img/no-photo.jpg',
        products: [], // массив всех товаров        
        filtered: [], // в этот массив будут залетать товары удовлетворяющие запросу в поиске
    }),
    mounted(){
        this.$parent.getRequest(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                };
            })
            .catch(() => console.log('Error!'));
    },
    template: ` <div class="products">
                    <error v-if="products.length == 0"></error>
                    <div v-else-if="filtered.length != 0" class="products__item" v-for="product of filtered" :key="product.id_product">
                        <img :src="imgCatalog" alt=photo>
                        <h3>{{product.product_name}}</h3>
                        <p>{{product.price}} &#8381</p>
                        <button class="buy-btn" @click="$root.$refs.cart.addProduct(product)">Добавить в корзину</button>
                    </div>
                    <div v-else class="products__item" v-for="product of products" :key="product.id_product">
                        <img :src="imgCatalog" alt=photo>
                        <h3>{{product.product_name}}</h3>
                        <p>{{product.price}} &#8381</p>
                        <button class="buy-btn" @click="$root.$refs.cart.addProduct(product)">Добавить в корзину</button>
                    </div>
                </div>`,
});