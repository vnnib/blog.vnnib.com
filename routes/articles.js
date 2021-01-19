const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/new', { articles: articles, article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { articles: articles, article: article })
})

router.get('/:slug', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { articles: articles, article: article })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    if (!req.body.title) {
      let i = 0
      while (!article.title || article.title.trim() === "") {
        article.title = req.body.markdown.split('\n')[i++]
      }
      article.title = article.title.replace(/^([^\p{L}]+)/gu, '')
    } else {
      article.title = req.body.title
    }
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router