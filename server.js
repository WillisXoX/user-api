const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/userApiDB");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

/* User Routes */
app.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if(err){
            res.status(400).json(err);
        }else{
            res.json(users);
        }
    });
});
app.post('/', (req, res) => {
    const user = new User({
        username: req.body.username
    });

    user.save((err) => {
        if(err){
            res.status(400).json(err);
        }else{
            res.json('User added!');
        }
    });
});

app.delete('/:username', (req, res) => {
    console.log(req.params);
    User.findOneAndDelete({username: req.params.username}, (err) => {
        if(err){
            res.status(400).json(err);
        }else{
            res.json('User deleted!');
        }
    });
});

app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
});