const express = require('express');
const path = require('path');// 경로 관련 기능이 들어있는 모듈

const app = express();
const user_inform = require('./routes/user_inform.js');// 다른 파일에서 모듈을 읽어와서 변수에 넣어줌

const http = require('http').createServer(app);
http.listen(8080, function () {
    console.log('listening on 8080');  
});

app.use(express.static(path.join(__dirname, '../web-community/build')));// 리액트 프로젝트의 빌드 폴더를 사용할것을 미들웨어로 지정

app.get('/', function(req,res) {// 기본 url로 클라이언트가 get 리퀘스트를 보냈을 때 대응 내용을 지정해줍니다
    res.sendFile(path.join(__dirname, '../web-community/build/index.html'));// 요청에 대한 응답으로 파일을 보내줍니다.
});


app.use('/user_inform', user_inform);// 해당 경로를 여기서 미들웨어로 사용할 것을 지정해줌