建議安裝Robomongo方便檢視資料庫內容
要正常測試ajax功能都要開著mongod.exe跟app.js


Create.html:

是用來簡單加入api到資料庫的,主要只供內部測試及使用
C/C++ apis的Language欄請填入大寫的 C
JAVA apis的Language欄請填入大寫的 JAVA
這樣使用page_search.html才能正確搜尋到
(這部分可以透過修改page_search.html增加新語言或修改語言代號)


我這幾頁共通:

完成頁內所有ajax操作,大部分功能綁定登入與否,所以我做了簡單的登入會連去login.html選擇要用
google或facebook帳號登入,登入後只要前面是http://127.0.0.1.xip.io:5000/... (以facebook登入)
或 http://127.0.0.1:5000/... (以google登入),後面接我這幾頁,js就會自動判定已經登入而開放
登入後功能,判斷登入與否是獨立的js,所以登入的UI改成用統一的bootstrap modal應該沒問題,只是後台app.js登入
成功後原本會自動導向至首頁,登入失敗則會導向至login.html,所以改用bootstrap modal可能也要改一下app.js。
另外為了能登出跟在mypage上顯示當前用戶名稱,ajax('/isAuthenticated')中會動到一點上面那條的呈現,這部分code為
document.getElementById('in_out').innerHTML='<a href="logout" onclick="lgt();">Logout</a>';
document.getElementById('mp').innerHTML='<a href="mypage.html">'+usrName+'</a>';
所以如果要改動上面那一條登入後的樣式,請在這兩行程式碼範圍內做改動(也稍微注意一下上面那條中加了id的元件),其他地方動到怕出bug

page_f2.html:
有get傳入參數,要正常瀏覽首先得用Create.html:建apis,然後正確url如: page_f2.html?id=538cac1681a6e4200cf10c0b
後面那一串就是想要瀏覽的api之_id,其他功能包括need unneed api按鈕,like unlike example按鈕和各example的ajax留言板功能


page_ce2.html:
如果是由page_f2.html的Create Example按鈕點進來會自動帶有正確的url,如: page_ce2.html?apiID=538cac1681a6e4200cf10c0b
後面那一串就是欲添加example的api之_id,輸入output時如果字串是imgur提供的html格式圖片連結,到時就能顯示為圖片
(未登入狀態進入本頁會被彈至首頁)

page_ee.html:
基本同上,但是正確url為: page_ee.html?eid=538cac1681a6e4200cf10c0b
後面那一串就是欲編輯之example,會檢查編輯者(cookie)是否為該example作者,否則跳出

page_search.html:

url可不帶任何參數,那麼本頁就是直接用大條的搜尋列輸入關鍵字和選擇語言進行ajax查詢
若帶參數目前有四種正確url (pri是舉例用的搜尋關鍵字),會自動帶入參數進行ajax查詢:
page_search.html?lan=C&cnt=pri
page_search.html?lan=C
page_search.html?lan=JAVA&cnt=pri
page_search.html?lan=JAVA
然後因為app.js只提供指定單一語言進行關鍵字搜索的api,所以上面那條小的搜尋欄可能要拿掉All的選項,除非app.js增加api
上面那條每頁都有的小搜尋欄我完全沒動,施淮振我是希望這條能夠用get攜帶參數的方式跳轉到page_search.html來顯示結果啦