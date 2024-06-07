

var express = require('express');
var router = express.Router();
var {validateRequest} = require("../middleware/validation");
const userController = require('../controllers/user-controllers');
const Validators = require("../validation/validation");
const commentController = require("../controllers/comment-controllers")
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ title: 'Express' });
});

//register user
router.post('/user/create',validateRequest(Validators.registerSchema), userController.addUser);

//add comment 
router.post('/comment/create',validateRequest(Validators.commentAddSchema), commentController.addComment);

//add reply on comment
router.post('/comment/reply/create',validateRequest(Validators.replycommentAddSchema), commentController.addReply);

//update comment 
router.put('/comment/update',validateRequest(Validators.commentUpdateSchema), commentController.updateComment);

//update reply on comment 
router.put('/comment/reply/update',validateRequest(Validators.replycommentUpdateSchema), commentController.updateReply);

//delete comment 
router.delete('/comment/delete',validateRequest(Validators.commentDeleteSchema), commentController.deleteComment);

//delete comment reply
router.delete('/comment/reply/delete',validateRequest(Validators.replycommentDeleteSchema), commentController.deleteCommentReply);

//comment reply list
router.get('/comment',validateRequest(Validators.commentListSchema), commentController.listComment);




module.exports = router;