const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// reservation 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const reservationProvider = require("./reservationProvider");
const reservationDao = require("./reservationDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.makeSubRoomReservation = async function (userIdx, subRoomIdx, checkInHour, checkOutHour, transportaion) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // validation 처리
        // check time (해당 SubRoom의 대실/숙박 시간이 예약 가능한지 확인)
        const availableTimeRow = await reservationProvider.timeCheck(subRoomIdx, checkInHour, checkOutHour);
        // console.log(availableTimeRow[0].subRoomIdx);
        if (availableTimeRow.length <= 0) return errResponse(baseResponse.RESERVATION_UNAVAILABLE);

        // 가격 가져오기
        var price;
        if(availableTimeRow[0].rentPrice) price = availableTimeRow[0].rentPrice
        else if(availableTimeRow[0].stayPrice) price = availableTimeRow[0].stayPrice
        // console.log(price);

        // 예약 번호 만들기
        const reservationNum = Math.floor(Math.random()*10000000000000000).toString();
        // console.log(reservationNum);
        // 예약 번호 중복 확인 (생략)

        // 예약하기
        const insertReservationInfoParams = [reservationNum, userIdx, subRoomIdx, checkInHour, checkOutHour, transportaion, price];
        const reservationInfoResult = await reservationDao.insertReservationInfo(connection, insertReservationInfoParams);

        // 예약된 방 status 바꾸기
        if(parseInt(checkInHour.toString().split(':')[0]) <= parseInt(checkOutHour.toString().split(':')[0])) {
            const reservationRoomStatusChangeResult = await reservationDao.updateRoomStatusToRented(connection, subRoomIdx);
        }
        else {
            const reservationRoomStatusChangeResult = await reservationDao.updateRoomStatusToStayed(connection, subRoomIdx);
        }

        connection.release();
        return response(baseResponse.SUCCESS, {'reservationId': reservationInfoResult.insertId});
        // return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createreservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.cancelReservation = async function (userIdx, reservationNum) {
    try {
        // validation 처리 생략 (query string 있는지, reservationNum을 제대로 입력했는지)
        if (!reservationNum) {}

        const connection = await pool.getConnection(async (conn) => conn);

        // 예약번호 가진 subRoomIdx 확인
        const checkReservationResult = await reservationProvider.retrieveUserReservationList(userIdx);
        // console.log(checkReservationResult);
        var subRoomIdx;
        for(var i=0; i<checkReservationResult.length; i++){
            if(checkReservationResult[i].reservationNum == reservationNum) {
                subRoomIdx = checkReservationResult[i].subRoomIdx;
                break;
            }
        }

        // 예약 취소
        const cancelReservationResult = await reservationDao.cancelReservationInfo(connection, reservationNum);
        console.log('예약 취소됨');

        // 룸 예약상태 변경
        const updateSubRoomStatusResult = await reservationDao.updateSubRoomReady(connection, subRoomIdx);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editreservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.makeReview = async function (userIdx, reservationIdx, rating, review) {
    try {
        // validation 처리 (생략)

        const connection = await pool.getConnection(async (conn) => conn);

        // 리뷰 등록
        const insertReviewResult = await reservationDao.InsertReviewInfo(connection, reservationIdx, rating, review);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editreservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
