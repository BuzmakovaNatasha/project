const express = require('express');
const fs = require('fs');
const app = express();

/**
 * Активируем мидлвары
 */
app.use(express.json()); // Даем знать приложению, что работаем с json'ом
app.use('/', express.static('./public')); // запросы в корень нашего сайт отдают содержимое public

/**
 * API Каталога
 */
app.get('/api/products', (req, res) => {
    fs.readFile('./server/db/products.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(JSON.stringify({ result: 0, text: err }));
        } else {
            res.send(data);
        }
    });
});

/**
 * API Корзины
 */
app.get('/api/cart', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            res.send(data);
        }
    });
});

// Добавление нового товара в корзину
app.post('/api/cart', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            // парсим текущую корзину
            const cart = JSON.parse(data);
            // добавляем новый товар
            cart.contents.push(req.body);
            fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    // парсим текущий stats.json
                    const stats = JSON.parse(data);
                    const string = {
                        date: new Date(),
                        action: "добавлено",
                        name: req.body.product_name,
                    };
                    stats.contents.push(string);
                    // пишем обратно
                    fs.writeFile('./server/db/stats.json', JSON.stringify(stats), (err) => { });
                }
            });
            // пишем обратно
            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            })
        }
    });
});

// Увеличиваем количество товара при нажатии на кнопку "Добавить в корзину", если такой товар уже добавлен
app.put('/api/cart/add/:id', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            // парсим текущую корзину
            const cart = JSON.parse(data);
            // ищем товар по id
            const find = cart.contents.find(el => el.id_product === +req.params.id);
            // изменяем количество
            find.quantity += req.body.quantity;
            fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    // парсим текущий stats.json
                    const stats = JSON.parse(data);
                    const string = {
                        date: new Date(),
                        action: "добавлено",
                        name: find.product_name,
                    };
                    stats.contents.push(string);
                    // пишем обратно
                    fs.writeFile('./server/db/stats.json', JSON.stringify(stats), (err) => { });
                }
            });
            // пишем обратно
            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            })
        }
    });
});

// Изменяем количество товара (при изменении значения input с количеством товара в корзине)
app.put('/api/cart/:id', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            // парсим текущую корзину
            const cart = JSON.parse(data);
            // ищем товар по id
            const find = cart.contents.find(el => el.id_product === +req.params.id);
            // изменяем количество
            if (find.quantity < req.body.quantity) {
                find.quantity += 1;
                fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
                    if (err) {
                        res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                    } else {
                        // парсим текущий stats.json
                        const stats = JSON.parse(data);
                        const string = {
                            date: new Date(),
                            action: "добавлено",
                            name: find.product_name,
                        };
                        stats.contents.push(string);
                        // пишем обратно
                        fs.writeFile('./server/db/stats.json', JSON.stringify(stats), (err) => { });
                    }
                });
            } else if (find.quantity > req.body.quantity) {
                find.quantity -= 1;
                fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
                    if (err) {
                        res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                    } else {
                        // парсим текущий stats.json
                        const stats = JSON.parse(data);
                        const string = {
                            date: new Date(),
                            action: "удалено",
                            name: find.product_name,
                        };
                        stats.contents.push(string);
                        // пишем обратно
                        fs.writeFile('./server/db/stats.json', JSON.stringify(stats), (err) => { });
                    }
                });
            }
            // пишем обратно
            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    });
});

// Удаление товара из корзины
app.delete('/api/cart/:id', (req, res) => {
    fs.readFile('./server/db/userCart.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
        } else {
            // парсим текущую корзину
            const cart = JSON.parse(data);
            // ищем товар по id
            const findDel = cart.contents.find(el => el.id_product === +req.params.id);
            // удаляем товар
            fs.readFile('./server/db/stats.json', 'utf-8', (err, data) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({ result: 0, text: err }));
                } else {
                    // парсим текущий stats.json
                    const stats = JSON.parse(data);
                    const string = {
                        date: new Date(),
                        action: "удалено",
                        name: findDel.product_name,
                    };
                    stats.contents.push(string);
                    // пишем обратно
                    fs.writeFile('./server/db/stats.json', JSON.stringify(stats), (err) => { });
                }
            });
            cart.contents.splice(cart.contents.indexOf(findDel), 1);
            // пишем обратно
            fs.writeFile('./server/db/userCart.json', JSON.stringify(cart), (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            })
        }
    });
});

/**
 * Запуск сервера
 * @type {string|number}
 */
const port = 3000;
app.listen(port, () => {
    console.log(`Listening ${port} port`);
});
