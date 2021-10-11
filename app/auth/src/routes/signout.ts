import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
 // removing the set cookie so that user is no more authorized

  return res.send({});
});

export { router as signoutRoute };