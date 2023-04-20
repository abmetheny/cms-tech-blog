const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

// Render the dashboard home page with all posts written by the logged in user
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.userId,
      },
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard-homepage', {
      layout: 'dashboard',
      posts,
    });
  } catch (err) {
    res.redirect('login');
  }
});

// Render page to create a new post
router.get('/new', withAuth, (req, res) => {
  res.render('dashboard-create-post', {
    layout: 'dashboard',
  });
});

// Render page to edit an existing post
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (postData) {
      const post = postData.get({ plain: true });

      res.render('dashboard-edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
