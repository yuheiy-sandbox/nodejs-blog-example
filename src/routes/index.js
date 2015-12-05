'use strict';
import express, { Router } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';

const router = Router();

router.get('/', (req, res) => {
  const Post = mongoose.model('Post');

  Post.find().sort({ date: -1 })
    .then(docs => {
      const posts = docs.map(doc => {
        doc.date = moment(parseInt(doc.date, 10)).format('ll');
        return doc;
      });
      res.render('index', { posts: docs });
    });
});

router.get('/posts/:id', (req, res) => {
  const Post = mongoose.model('Post');

  Post.findById(req.params.id)
    .then(post => {
      post.date = moment(parseInt(post.date, 10)).format('ll');
      res.render('post', { post });
    });
});

export default router;
