module.exports = function(app){
    const reservation = require('./reservationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 전체 예약내역 조회 API
    app.get('/app/reservations', reservation.getAllReservations);

    // 2. 특정 유저의 예약내역 조회 API (with jwt)
    app.get('/app/reservations/my-reservations', jwtMiddleware, reservation.getReservations);

    // 3. 특정 유저의 상세 예약내역 조회 API (with jwt, path variable)
    app.get('/app/reservations/my-reservation/:reservationId', jwtMiddleware, reservation.getReservation);

    // 4. 특정 유저의 찜 목록 조회 API (with jwt)
    app.get('/app/reservations/my-likes', jwtMiddleware, reservation.getLikes);

    // 5. 예약하기 API (with jwt, path variable, query string)
    app.post('/app/reservations/reserve/:subRoomId', jwtMiddleware, reservation.postReservation);

    // 6. 예약 취소 API
    app.patch('/app/reservations/cancel-reservation', jwtMiddleware, reservation.patchReservation);

    // 7. 후기 남기기
    app.post('/app/reservations/review/:reservationId', jwtMiddleware, reservation.postReview);

};
