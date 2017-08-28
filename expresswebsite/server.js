var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
  res.render('index',{'title':'Computer not Working?'});

});
app.get('/about',function(req,res){
  res.render('about' );

});
app.get('/contact',function(req,res){
  res.render('contact');

});
app.post('/contact/send',function(req,res){
  var trans = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user:'vipmunot@gmail.com', //Enter your email
      pass: '*' // Enter your password
    }
  });
  var mailOptions = {
    from:'Express <vipmunot@gmail.com>',
    to: 'vipmunot@yahoo.com',
    subject:'Website Submission',
    text:'You have been contacted by Express. Name' + req.body.name +' Email: '+ req.body.email + ' Message: ' + req.body.msg,
    html:'<p>You have been contacted by Express.</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: ' + req.body.msg+'</li></ul>',
  };
  trans.sendMail(mailOptions,function(error,info){
    if(error){
      console.log(error);
      res.redirect('/');
    }
    else{
      console.log('Message Sent: ' + info.response);
      res.redirect('/');
    }
  });
});
app.listen(3000);
console.log('Magic is happening at http://localhost:3000');
