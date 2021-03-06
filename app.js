const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")
    .get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err)
            res.send(foundArticles);
        else
            res.send(err);
    });
    })
    .post( (req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save((err) => {
            if (!err) {
                res.send("New Article has been added successfully.")
            } else {
                res.send(err);
            }
        });
    })
    .delete( (req, res) => {
    
        Article.deleteMany((err) => {
            if (!err) {
                res.send("All the Articles have been deleted permanently");
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
    
        Article.findOne({ title: req.params.articleTitle }, (err, result) => {
            if (!err) {
                res.send(result.title);
            } else {
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        Article.updateOne({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("updated");
                } else {
                    res.send(err);
                }
            });
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle },
            {$set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully updated the article.");
                } else {
                    res.send(err);
                }
            });
    })
    .delete((req, res)=> {
       
         Article.deleteOne({title: req.params.articleTitle},
            (err)=>{
                if(!err){
                    res.send('The article has been deleted');
                } else {
                    res.send(err);
                }
            })
    })



//TODO

    app.listen(3000, (req, res) => {
        console.log(
            "Server started on port 3000"
        );
    });