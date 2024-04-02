const express = require('express');
const Schema = require('./model/url');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./db/connect');
const methodOverride = require('method-override');
const port = process.env.port || 3000;
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method')); // for delete request from form
// Routes



app.get('/', async (req, res) => {

    const shorturls = await Schema.find();

    res.render('index', { shorturls: shorturls });

});


app.post('/shorturls', async (req, res) => {
    
    try {
        const { fullurl } = req.body;

        if (!fullurl) return res.send({ status: false, msg: 'Url is required!' });

        const shorturl = uuidv4(); // Generating a short ID with length 8

        const clicks = 0;

        const urls = await Schema.create({
            fullurl,
            shorturl,
            clicks
        });

        await urls.save();

        res.redirect('/');

    } catch (error) {
        res.status(400).json({ msg: 'request error' });
    }
});


app.get('/:shorturl', async (req, res) => {

    try { 
        const shorturl = await Schema.findOne({shorturl:req.params.shorturl});
        
        if (shorturl === null) {
            return res.status(404).json({ msg: `This URL does not exist.` });
        }
    
        shorturl.clicks++;
        shorturl.save();
        
        res.redirect(shorturl.fullurl);

    } catch (error) {
        res.status(500).json({msg:`Internal Server Error`});
    }
});


// delete route 

app.delete('/:id' ,async (req,res)=>{

    const url = await Schema.findByIdAndDelete(req.params.id)

    if(!url) return res.status(404).json({msg:`Url Not found`})

    res.redirect('/')
});


const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start()
