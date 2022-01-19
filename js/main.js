'use strict';

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

function getRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject('Error!');
                } else {
                    resolve(xhr.responseText);
                }
            }
        }
        xhr.send();
    });
};

//находим кнопку корзины и ее всплывающее окно
const buttonBasket = document.querySelector('.btn-cart');
const basketBox = document.querySelector('.basket-box');

const divProducts = document.querySelector('.products');// div, в который будут вставляться товары
const cartCounter = document.querySelector('.btn-cart_counter');// значение счетчика на корзине
const totalValueInCart = document.querySelector('.total__value');// Итоговая сумма в корзине

//при клике на кнопку Корзины с помощью добавления или удаления класса hidden скрываем или показываем это окно
buttonBasket.addEventListener('click', function () {
    basketBox.classList.toggle("basket-box_hidden");
});