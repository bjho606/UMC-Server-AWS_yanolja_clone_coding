module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest);

    // 1. 유저 조회 API (+ 이메일로 검색)
    app.get('/app/users', user.getUsers);

    // 2. 특정 유저 조회 API (with userIdx)
    app.get('/app/users/:userId', user.getUserById);

    // 3. 유저 생성 (회원가입) API
    // 트러블 슈팅 읽어보길!
    app.post('/app/users/sign-up', user.signupUser);

    // ------------------------------------------------------------아래 부분은 7주차에서 다룸.
    // TODO: After 로그인 인증 방법 (JWT)
    // 4. 유저 로그인 API (JWT 생성)
    app.post('/app/users/log-in', user.loginUser)

    // 5. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUser)

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

    // 6. 회원 상태 변경하기 (탈퇴 포함) API
    app.patch('/app/user-change-status', jwtMiddleware, user.changeUserStatus);

    // 7. 회원 포인트 사용 내역 가져오기 API
    app.get('/app/user-points', jwtMiddleware, user.getUserPointsUsage);

    // 8.
};


