const express = require('express')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
const port = 5000

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}, function(err) {
  if (err) throw err;
  console.log(`MongoDB connected!`)
})

app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use("/", express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})