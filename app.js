var http = require('http');
var express = require('express');
var app = express();


app.configure(function() {
  app.use(express.static(__dirname));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'thisisasaproject' }));
  app.set('view engine', 'ejs');
});

var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

require('./db');

var user = require('./routes/user');
var api = require('./routes/api');
var example = require('./routes/example');
var discussion = require('./routes/discussion');


var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '240935556101090',
    clientSecret: 'd935b26669cb812d1d149e9d5b7a6b75',
    callbackURL: "/fbcb"
  },
  function(accessToken, refreshToken, profile, done) {
  var postData = {'Identifier': profile.id, 'DisplayName': profile.displayName, 'LoginBy': "Facebook"};
  user.findOne({'Identifier': profile.id}, postData, function(err, user){
    if (err) {
         console.log(error);
    }
    var a = JSON.parse(user);
    console.log(a);
    done(null, user);
  });
  }
));

var GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://127.0.0.1:5000/oauth2callback',
    realm: 'http://127.0.0.1:5000/'
  },
  function(identifier, profile, done) {

    var postData = {'Identifier': identifier, 'DisplayName': profile.displayName, 'LoginBy': "Google"};
    user.findOne({'Identifier': identifier}, postData, function(err, user){
      if (err) {
           console.log(error);
      }
      var a = JSON.parse(user);
      console.log(a);
      done(null, user);
    });

  }
));

//驗證登入的function
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(null); }
  res.redirect('/login')
}


passport.serializeUser(function(user, done) {
  console.log("login with: " + user);
  done(null, user);//user
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);//obj
});

//首頁
app.get('/', function(req, res){
  res.sendfile('index.html');
  //res.end('Hello world');
});

//登入頁面
app.get('/login', function(req, res){
  res.sendfile('login.html');
});


//FB登入連結
app.get('/auth/facebook', passport.authenticate('facebook'));

//FB登入call back
app.get('/fbcb', 
  passport.authenticate('facebook', { successRedirect: '/login/success',
                                      failureRedirect: '/login/fail' }));

//Google登入連結
app.get('/auth/google', passport.authenticate('google'));

//Google登入call back
app.get('/oauth2callback', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));

/*
本人偷懶所以只做FB還有Google登入
需要FB登入的話，請連結到http://127.0.0.1.xip.io:5000/auth/facebook
Google登入則是http://127.0.0.1:5000/auth/google
因為這是測試階段，所以正式推上線之後還要修改domain
要測試的時候通知我，要把你加入FB app tester才可以使用你們的帳號登入
登入成功之後會重新導向至"/"
需要登入資訊下面有一個function: isAuthenticated可以用
*/

//登出
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//login success
app.get('/login/success', function(req, res){
  //res.end(req.user);
  res.redirect('/');
});

//login fail
app.get('/login/fail', function(req, res){
  //res.end(null);
  res.redirect('/login');
});

//傳回是否是登入狀態
//這個的目的讓頁面可以檢查要顯示login還是logout
//在第一次登入之後可以呼叫這個function，然後把回傳的user id存在session storage
//讓之後傳送表單要填入user id的時候可以直接拿到資料
app.get('/isAuthenticated', function(req, res){
  if (req.isAuthenticated()) {
    /*
    登入成功後呼叫這個連結，可以取得登入的使用者資訊，前端應該用cookie之類的東西記錄，才能在新增內容的時候填入使用者的objectID
    */
    res.end(req.user);
  }else{
    res.end(null);
  }
});

//底下就是所有跟資料庫有互動的部分，請確定測試機器上面已經裝好mongodb並且啟動

//目前所有的api都沒有加密方便測試，之後要加入使用者驗證的話就把api修改成下面那樣
//app.get('/topic/list', ensureAuthenticated, topic.list);
//加入 ensureAuthenticated就可以了

//底下有提到id的部分，都是object的unique id，是新增資料時系統自己賦予它的一串unique id
//它是一串很長的hash code，欄位名稱是 _id

//下面每個資料schema我都有寫出來，打*的欄位是新增資料時必填欄位
//請注意post表單資料過去時，表單的欄位名稱請跟資料庫名稱「一模一樣」，包含大小寫
//修改與刪除都是用post，必須包含一個欄位叫做id，裡面填入該筆資料的unique id

//API資料庫部分
//基本上這邊的新增與刪除應該不會開放給使用者，是給我們自己新增資料用的
/*
api資料庫schema
*Language: { type: String }, 語言：請用名字分類，ex:NodeJS, Cplusplus，注意，不可以使用C++這種包含符號的東西
*Introduction: { type: String }, 介紹
*FunctionName: { type: String }, 函式名稱
*Parameter: { type: String }, 參數
*ReturnValue: { type: String }, 回傳值
*SeeAlso: { type: String }, 連結
*Compatibility: { type: String }, 相容性
下面是系統需要的東西，可不必理會
NeedNumber: { type: Number, default: 0 }, 需要example數量
Needs: [{ type: Schema.Types.ObjectId, ref: 'User' }], 需要example的人
Examples: [{ type: Schema.Types.ObjectId, ref: 'Example' }] 包含的example
*/

//列出所有api
app.get('/api/list', api.list);
//新增api
app.post('/api/create', api.create);
//顯示單一語言的所有api，例如：/api/show?Language=Cplusplus
app.get('/api/show/:Language?', api.show);
//render ejs
app.get('/api/render/:Language?', function(req, res){
  res.render('page_lang', { Language: req.query.Language });
});
//傳入api id，顯示該筆api詳細資料
app.get('/api/showOne/:id?', api.showOne);
//更新api，需要有個欄位是id，記錄該筆api的id
app.post('/api/update', api.update);
//刪除api，需要有個欄位是id，記錄該筆api的id
app.post('/api/destroy', api.destroy);
//搜尋某一個語言的api function name
//EX: /api/search?keyword=print&Language=Cplusplus
app.get('/api/search/:keyword?/:Language?', api.search);
//傳入id(api id), user(user id)，讓這個api需要example的數量加一
app.post('/api/need', api.need);
//檢查該使用者是否已經對該api提出需要example的請求
app.get('/api/hasneeded/:id?/:user?', api.hasneeded);
//傳入id(api id), user(user id)，取消需要這個api example的請求
app.post('/api/unneed', api.unneed);
//根據傳入的語言，依照「需要example數量」排序，limit是回傳數量
app.get('/api/showTheHighestNeeded/:Language?/:limit?', api.showTheHighestNeeded);

//example資料庫部分
/*
example資料庫schema
*Description: { type: String }, 簡介
*Code: { type: String }, code
*Output: { type: String }, 輸出，我這邊的想法是用照片連結，然後我不想寫上傳，所以請他們先上傳到imgur之類的地方然後複製連結
CreatedAt: { type: Date, default: Date.now }, 系統參數
UpdatedAt: { type: Date, default: Date.now }, 系統參數
LikeNumber: { type: Number, default: 0 }, like數量
*CreatedBy: { type: Schema.Types.ObjectId , ref: 'User' }, 作者，請傳入user的id
Likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], like過的人
Discussions: [{ type: Schema.Types.ObjectId, ref: 'Discussion' }], 系統參數
*ApiID: { type: Schema.Types.ObjectId, ref: 'Api' } 需要填入這個example所屬的api id
*/

//列出所有example
app.get('/example/list', example.list);
//新增example
app.post('/example/create', example.create);
//根據apiid，根據like數量排序，數線限制是傳入的limit
app.get('/example/showTheHighestRanking/:apiid?/:limit?', example.showTheHighestRanking);
//根據apiid，根據like數量排序，傳回所有資料，不限制數量
app.get('/example/show/:apiid?', example.show);
//傳入user id，取得他所有的example
app.get('/example/showAllExamplesByUser/:id?', example.showAllExamplesByUser);
//更新example，需要一個id欄位記錄該example id
app.post('/example/update', example.update);
//like一個example，需要傳入id(example id), user(user id)
app.post('/example/like', example.like);
//檢查該example是否已經被此user like過
app.get('/example/hasliked/:id?/:user?', example.hasliked);
//unlike一個example，需要傳入id(example id), user(user id)
app.post('/example/unlike', example.unlike);
//刪除一個example，需要一個id欄位記錄該example id
app.post('/example/destroy', example.destroy);

//discussion資料庫部分
/*
discussion資料庫schema
*Content: { type: String }, 回應內容
*ExampleID: { type: Schema.Types.ObjectId, ref: 'Example' }, 所屬的example id
*CreatedBy: { type: Schema.Types.ObjectId , ref: 'User' }, 作者id
CreatedAt: { type: Date, default: Date.now } 系統時間
*/

//列出所有討論
app.get('/discussion/list', discussion.list);
//新增討論
app.post('/discussion/create', discussion.create);
//根據exampleid列出所有討論
app.get('/discussion/show/:exampleid?', discussion.show);
//更新一個討論，需要一個id欄位記錄該discussion id
app.post('/discussion/update', discussion.update);
//刪除一個討論，需要一個id欄位記錄該dsicussion id
app.post('/discussion/destroy', discussion.destroy);

app.listen(5000);
