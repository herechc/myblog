var User = require('../models/user')
var Article = require('../models/article')
var Comment = require('../models/comment')
var router = function (app) {


  app.use(function(req, res, next){
    var _user = req.session.user;
    if(_user){
      res.locals.user = _user
    }
    console.log("登录session" + _user)
    next();
  });

  /* GET home page. */
  app.get('/', function (req, res, next) {
    console.log("登录中")
    var _user = req.session.user
    if(_user){
      console.log(_user + "1")
      res.redirect('/article/list')  
    }else{
      console.log(_user + "22")      
      res.redirect('/signin')  
    }
    
  });
  //singup 注册
  app.get('/signup', function (req, res) {
     res.render('signup',{
       title: '注册'
     }) 
  })
  app.post('/signup',function(req,res){
    var _user = req.body.user
    User.findOne({name:_user.name},function(err,user){
      if(err){
        console.log(err)
      }
      if(user){
        console.log('注册失败')        
        return res.redirect('/signup')
      } else {
        user = new User(_user)
        user.save(function(err,user){
          if(err){
            console.log(err)
          }
          console.log('注册完成')
          return res.redirect('/signin')
        })
      }
    })
  })  
  //signin 登录
  app.get('/signin',function(req,res){
    res.render('signin',{
      title: '登录'
    })
  })
  app.post('/signin',function(req,res){
    var _user = req.body.user
    var name = _user.name
    var password = _user.password
    User.findOne({name:name},function(err,user){
      if(err){
        console.log(err)
      }
      if(!user){
        return res.redirect('/signup')
      }
      
      user.compaerPassword(password,function(err,isMatch){
        if(err){
          console.log(err)
        }
        
        if(isMatch) {
          req.session.user = user
          console.log("是否匹配"+ user)
          res.redirect('/article/list')
        } else {
          res.redirect('/signin')
        }
      })      
      
    })
  })

  // article - list 文章列表
  app.get('/article/list',function(req,res){
    Article.fetch(function(err,articles){
      if(err){
        console.log(err)
      }
      res.render('article',{
        title: '文章',
        article: articles
      })
    })
  })
  // article - new 发表文章
  app.get('/article/new',function(req,res){
    res.render('articleNew')
  })
  app.post('/article/new',function(req,res){
    var _article;
    var articleobj = req.body.article;
    // var _id = articleobj._id;
    // if(_id != 'undefined'){
    //   Article.fendById(_id,function(err,articles){
    //     if(err){
    //       console.log(err)
    //     }
    //     _article = _extend(articles,articleobj)
    //     _article.save(function(err,next){
    //       if(err){
    //         console.log(err)
    //       }
    //       res.redirect('/article/' + _article.id)
    //     })

    //   })
    // }
    var _article = new Article({
      title:articleobj.title,
      comment:articleobj.comment
    })
    _article.save(function(err,next){
      if(err){
        console.log(err)
      }
      res.redirect('/article/list')
    })
  })
  //article - comment 留言
  app.get('/article/:id',function(req,res){
    var id = req.params.id
    Article.findById(id,function(err,article){
      if(err){
        console.log(err)
      }
      Comment
        .find({article:id})
        .populate('from','name')
        .exec(function(err,comments){
          if(err){
            console.log(err)
          }
          console.log('评论'+ comments +"!")
          res.render('comment',{
            article: article,
            comment: comments
          })
        })
    })
  })
  app.post('/article/:id',function(req,res){
    var _comment = req.body.comment
    var articleId = req.params.id
    var comment = new Comment(_comment)
    console.log(_comment)
    comment.save(function(err,comments){
      if(err){
        console.log(err)
      }
      res.redirect('/article/'+ articleId)
    })
  })
}


module.exports = router