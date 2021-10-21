const express = require('express');
const util = require('util');
const router = express.Router();// 익스프레스의 라우터 기능을 쓸 수 있게 변수에 할당해줌
const db = require('../config/db');// 설정 폴더에서 만들어준 db관련 설정을 가져와서 변수에 넣어줌

router.get('/login', (req, res) => {
    res.send({data: "temp data"});// 임의의 데이터를 보내줌
});
router.post('/onLogin', (req, res) => {
    const user_id = req.query.user_id;
    const user_pw = req.query.user_pw;
    console.log(user_id + "   " + user_pw);

    db.getConnection()
    .then(conn => {
        conn.query("SELECT * from users")
        .then(rows => {
            console.log(rows);
        })
        console.log("connected. The id is " + conn.threadId);
        conn.release();
    })
    .catch(err => {
        console.log("not connected due to error " + err);
    });

});

module.exports = router;