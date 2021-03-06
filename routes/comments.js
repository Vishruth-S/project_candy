const express = require('express')
const router = express.Router({ mergeParams: true })
const { isLoggedIn, isCommentAuthor } = require('../middleware')

const Post = require('../models/Post')
const Comment = require('../models/Comment')

router.post('/', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id
    post.comments.push(comment)
    await comment.save()
    await post.save()
    req.flash('success', 'Comment posted successfully')
    res.redirect(`/posts/${post._id}`)
})

router.delete('/:commentId', isLoggedIn, isCommentAuthor, async (req, res) => {
    const { id, commentId } = req.params
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Comment was deleted successfully')
    res.redirect(`/posts/${id}`)
})

module.exports = router
