module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1~3. 방 조회 API (+ 카테고리, 예약여부, 대실/숙박 으로 검색)
    app.get('/app/rooms', room.getRooms);

    // 4. 방 id로 방의 모든 정보 조회 API (with roomId)
    app.get('/app/rooms/:roomId', room.getRoomById);

    // 5. 방 id로 방의 모든 룸 조회 API (with roomId)
    app.get('/app/rooms/subrooms/:roomId', room.getSubRoomsById);

    // 6. 새로운 방 추가
    app.post('/app/rooms/new-room', room.postRoom);

    // 7. 방에 룸 추가
    app.post('/app/rooms/add-subroom/:roomId', room.postSubRoom);

    // ------------------------------------------------------------아래 부분은 7주차에서 다룸.
    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // 4. 유저 로그인 API
    //app.post('/app/users/log-in', user.loginUsers)

    // 5. 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    //app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

};
