const express = require("express");
const app = express();
const dotenv = require("dotenv")
const Amadeus =  require("amadeus");
const bodyParser = require("body-parser");
const cors = require("cors")




app.use(cors({
origin: '*',
mathods: ['GET', 'POST']
}))
app.use(express.json());
dotenv.config()

app.use(bodyParser.json());
const amadeus = new Amadeus({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

  });
  


app.use(bodyParser.json());

app.get(`/flight-search`, (req, res) => {

    

    const originCode = req.body.originCode;
    const destinationCode = req.body.destinationCode;
    const dateOfDeparture = req.body.dateOfDeparture
    console.log(req.body)
    // Find the cheapest flights
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: dateOfDeparture,
        adults: '1',
        max: '7'
    }).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
    });


app.post(`/flight-confirmation`, (req, res) => {

    const flight = req.body.flight
    
    // Confirm availability and price
    amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight],
            }
        })
    ).then(function (response) {
            res.send(response.result);
        }).catch(function (response) {
            res.send(response)
        })
    
})


app.listen(process.env.PORT  || 5000, ()=> {
    console.log("tobi is king");
})

