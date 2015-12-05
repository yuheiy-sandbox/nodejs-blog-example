'use strict';
import express, { Router } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';

const router = Router();

router.get('/', (req, res) => {
  const { user } = req.session;

  if (user) {
    const Post = mongoose.model('Post');

    Post.find().sort({ date: -1 })
      .then(posts => {
        res.render('admin/index', { username: user, posts });
      });

    return;
  }

  res.redirect('/admin/login');
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/');
    return;
  }

  res.render('admin/login', { csrfToken: req.csrfToken() });
});

router.post('/login', (req, res) => {
  const USERNAME = 'root';
  const PASSWORD = 'pass';
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    req.session.user = username;
    res.redirect('/admin/');
    return;
  }

  res.render('admin/login', { error: true });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/posts/new', (req, res) => {
  res.render('admin/post', { csrfToken: req.csrfToken() });
});

router.post('/posts/create', (req, res) => {
  const Post = mongoose.model('Post');
  const { title, body } = req.body;
  const post = new Post({ title, body });

  post.save()
    .then(() => {
      res.redirect('/admin/');
    });
});

router.get('/posts/:id/edit', (req, res) => {
  const Post = mongoose.model('Post');

  Post.findById(req.params.id)
    .then(post => {
      post.date = moment(parseInt(post.date, 10)).format('ll');
      res.render('admin/post', { post, csrfToken: req.csrfToken() });
    });
});

router.put('/posts/:id', (req, res) => {
  const Post = mongoose.model('Post');
  const { title, body } = req.body;

  Post.findByIdAndUpdate(req.params.id, { title, body })
    .then(() => {
      res.redirect('/admin/');
    });
});

router.delete('/posts/:id', (req, res) => {
  const Post = mongoose.model('Post');

  Post.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/admin/');
    });
});

export default router;
