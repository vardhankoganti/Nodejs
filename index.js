var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var bus = require('./bus.json')
var payment = require('./payment.json')
const { use } = require('express/lib/application')
var port = 5000
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    try {
        res.status(200).send(bus)
    }
    catch (err) {
        console.log('Error in get', err)
        res.status(500).send(err)
    }
})

app.post('/', (req, res) => {
    try {
        let user = req.query.user
        if (user in payment) {
            payment[user] = payment[user].concat(req.body)
        }
        else {
            payment[user] = req.body
        }

        fs.writeFile('./payment.json', JSON.stringify(payment), function writeJSON(err) {
            if (err) return console.log(err);
            console.log('writing to payment.json');
        });
        selectedBus = bus[req.query.name]
        selectedBus = selectedBus.map(sel => {
            let check = req.body.map(obj => {
                if (obj.number === sel.number) {
                    sel = obj
                }
            })
            return sel
        })
        bus[req.query.name] = selectedBus
        fs.writeFile('./bus.json', JSON.stringify(bus), function writeJSON(err) {
            if (err) return console.log(err);
            console.log('writing to bus.json');
        });
        res.status(201).send(`Payment completed for user: ${user}`)
    }
    catch (err) {
        console.log('Error in post', err)
        res.status(500).send(err)
    }
})

app.listen(port, () => {
    console.log(`Server listening on port:${port}`)
})