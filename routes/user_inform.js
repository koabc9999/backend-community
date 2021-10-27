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
        conn.query("SELECT COUNT(*) AS result FROM users WHERE id = ?", user_id)
        .then(rows => {
            if(rows[0].result == 0) {// 해당 id와 같은 데이터가 DB에 존재하지 않는 경우
                res.send({"message": "입력하신 id가 존재하지 않습니다."});
            }
            else {
                const sqlString = `SELECT
                    CASE (SELECT COUNT(*) FROM users WHERE id = ? AND pw = ?)
                        WHEN '0' THEN NULL
                        ELSE (SELECT id FROM users WHERE id = ? AND pw = ?)
                    END AS userId
                    , CASE (SELECT COUNT(*) FROM users WHERE id = ? AND pw = ?)
                        WHEN '0' THEN NULL
                        ELSE (SELECT pw FROM users WHERE id = ? AND pw = ?)
                    END AS userPw
                `;// 아이디와 비밀번호가 모두 일치하는 데이터가 있을 경우 2가지 케이스를 데이터와 함께 리턴. 없으면 NULL
                const params = [user_id, user_pw, user_id, user_pw, user_id, user_pw, user_id, user_pw];// 넘겨줄 데이터
                conn.query(sqlString, params)// DB에게 데이터를 보냄
                .then(data => {// 전달받은 데이터를 가지고 코드 실행
                    res.send(data[0]);// 받은 객체의 첫번째 데이터를 브라우저 콘솔에 띄움
                });
            }
        });
        console.log("connected. The id is " + conn.threadId);
        conn.release();
    })
    .catch(err => {
        console.log("not connected due to error " + err);
    });

});

module.exports = router;