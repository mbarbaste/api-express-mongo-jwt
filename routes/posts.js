const express = require('express')
const router = express.Router()
const verify = require('../verifyToken')

const Post = require('../models/Posts')

router.get('/', verify, async (req, res) => {
    try {
        const posts = await Post.find()
        res.json(posts)
       
    } catch (error) {
        res.json(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const removedPost = await Post.remove({_id: req.params.id})
        res.json(removedPost)
    } catch (error) {
        res.json(error)
    }
})

router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    })

    try {
        const savedPost = await post.save()
        res.json(savedPost)
    } catch (error) {
        res.json(error)
    }

})

router.patch('/:id', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    })

    try {
        const updatedPost = await Post.updateOne({
            _id: req.params.id
        },
        {
            $set : {
                title: req.body.title
            }
        })
        res.json(updatedPost)
    } catch (error) {
        res.json(error)
    }

})

module.exports = router