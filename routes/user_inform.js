const express = require('express');
const util = require('util');
const router = express.Router();// 익스프레스의 라우터 기능을 쓸 수 있게 변수에 할당해줌
const db = require('../config/db');// 설정 폴더에서 만들어준 db관련 설정을 가져와서 변수에 넣어줌

router.get('/login', (req, res) => {// 잘 작동하는지 확인하기 위한 get 라우터
    res.send({data: "temp data"});// 임의의 데이터를 보내줌
});

router.post('/onLogin', (req, res) => {// 로그인을 위한 post 리퀘스트가 날아왔을 때 실행
    const user_id = req.query.user_id;
    const user_pw = req.query.user_pw;
    console.log(user_id + "   " + user_pw);

    db.getConnection()
    .then(conn => {
        conn.query("SELECT COUNT(*) AS result FROM users WHERE id = ?", user_id)// 출력을 효율적으로 확인하기 위해 AS로 result 값을 추가
        .then(rows => {
            if(rows[0].result == 0) {// 해당 id와 같은 데이터가 DB에 존재하지 않는 경우
                res.send({"message": "입력하신 id가 존재하지 않습니다."});
            }
            else {
                // 여기서 END AS가 결과 데이터에 넣어줄 하나의 변수가 됨. 두 가지 쿼리를 ','를 이용해서 날려줬음
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

router.post('/onSignUp', (req, res) => {// 회원가입을 위한 리퀘스트가 왔을 때 실행
    const user_name = req.query.user_name;// 브라우저에서 넘어온 데이터 중 이름
    const user_id = req.query.user_id;// 받은 id
    const user_pw = req.query.user_pw;// 받은 pw

    console.log(`서버 정보: ${user_name}, ${user_id}, ${user_pw}`);

    db.getConnection()
    .then(conn => {
        conn.query("SELECT COUNT(id) AS result FROM users WHERE id = ?", user_id)
        .then(rows => {// DB로 쿼리를 날린 결과로 돌아온 데이터를 활용해서 이후 코드를 실행함
            if(rows[0].result != 0) {// DB에 이미 존재하는 id였을 경우 실행하는 코드
                res.send({"message": "입력하신 id가 이미 존재합니다."});
            }
            else {// 전달받은 데이터가 DB에 중복으로 없어서 바로 추가하면 되는 경우
                const params = [user_id, user_pw, user_name, user_id];
                conn.query("INSERT INTO users (id, pw, name) VALUES(?, ?, ?) AS ?", params);// 중복 id가 없으니 DB에 데이터를 저장해줌
                conn.query("SELECT * AS")
            }
        });
    });
});

module.exports = router;