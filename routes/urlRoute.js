const express = require('express');
const router = express.Router();
const ShortURL = require('../models/urlSchema');

router.get('/', async (req, res) => {
    try {
        const shorturls = await ShortURL.find();
        res.render('index', { shorturls: shorturls });
    } catch (error) {
        console.error("Error fetching short URLs:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/shortUrls', async (req, res) => {
    const url = req.body.full;
    try {
        const newShortURL = new ShortURL({ full: url });
        await newShortURL.save();
        console.log("Short URL created:", newShortURL);
        res.redirect('/');
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    try {
        const url = await ShortURL.findOne({ short: shortUrl });
        if (!url) {
            return res.sendStatus(404);
        }
        url.clicks++;
        await url.save(); // Save the updated click count
        res.redirect(url.full);
    } catch (error) {
        console.error("Error redirecting to full URL:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await ShortURL.findByIdAndDelete(id);
        console.log("Short URL deleted:", id);
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting short URL:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
