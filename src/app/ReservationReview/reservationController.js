const jwtMiddleware = require("../../../config/jwtMiddleware");
const reservationProvider = require("../../app/ReservationReview/reservationProvider");
const reservationService = require("../../app/ReservationReview/reservationService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 예약내역 조회 API
 * [GET] /app/reservations
 */
exports.getAllReservations = async function (req, res) {
    const allReservationListResult = await reservationProvider.retrieveAllReservationList();
    return res.send(response(baseResponse.SUCCESS, allReservationListResult));
};

/**
 * API No. 2
 * API Name : 특정 유저의 예약내역 조회 API (with jwt)
 * [GET] /app/reservations/my-reservations
 */
exports.getReservations = async function (req, res) {
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;
    if(!userIdFromJWT) return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));

    const userReservationList = await reservationProvider.retrieveUserReservationList(userIdFromJWT);
    if(!userReservationList) return res.send(response(baseResponse.SUCCESS, "아직 예약내역이 없습니다."));

    return res.send(response(baseResponse.SUCCESS, userReservationList));
};

/**
 * API No. 3
 * API Name : 특정 유저의 상세 예약내역 조회 API (with jwt)
 * * path variable : reservationId
 * [GET] /app/reservations/my-reservation/:reservationId
 */
exports.getReservation = async function (req, res) {
    // path variable 가져오기 (reservationId)
    const reservationId = req.params.reservationId;
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;
    if(!userIdFromJWT) return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));

    const userReservationDetail = await reservationProvider.retrieveUserReservationDetails(userIdFromJWT, reservationId);

    return res.send(response(baseResponse.SUCCESS, userReservationDetail));
};

/**
 * API No. 4
 * API Name : 특정 유저의 찜 목록 조회 API (with jwt)
 * [GET] /app/reservations/my-reservation/:reservationId
 */
exports.getLikes = async function (req, res) {
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;
    if(!userIdFromJWT) return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));

    const userLikeList = await reservationProvider.retrieveUserLikeList(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, userLikeList));
};

/**
 * API No. 5
 * API Name : 예약하기 API (with jwt, path variable)
 * * path variable : subRoomId
 * * query string : checkInHour, checkOutHour, transportation
 * [POST] /app/reservations/reserve/:subRoomId
 */
exports.postReservation = async function (req, res) {
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;
    if(!userIdFromJWT) return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));

    // path variable 가져오기 (subRoomId)
    const subRoomId = req.params.subRoomId;

    // query string 가져오기 (checkInHour, checkOutHour, transportation)
    const checkInHour = req.body.checkInHour;
    const checkOutHour = req.body.checkOutHour;
    const transportaion = req.body.transportaion;

    // query string 이 하나라도 없을 때 (생략)
    // query string 형식이 하나라도 안 맞을 때 (생략)

    const userReserveResult = await reservationService.makeSubRoomReservation(userIdFromJWT, subRoomId, checkInHour, checkOutHour, transportaion);

    return res.send(response(baseResponse.SUCCESS, userReserveResult));
};

/**
 * API No. 6
 * API Name : 예약 취소 API + JWT + Query String
 * [PATCH] /app/reservations/cancel-reservation
 * query string : reservationNum
 */
exports.patchReservation = async function (req, res) {
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;

    // query string 가져오기
    const reservationNum = req.query.reservationNum;

    console.log(reservationNum);

    const cancelReservationInfo = await reservationService.cancelReservation(userIdFromJWT, reservationNum);

    return res.send(cancelReservationInfo);
};

/**
 * API No. 7
 * API Name : 리뷰 남기기 API (with jwt, path variable)
 * * path variable : reservationId
 * * body : rating (평점), review (후기)
 * [POST] /app/reservations/review/:reservationId
 */
exports.postReview = async function (req, res) {
    // jwt 가져오기
    const userIdFromJWT = req.verifiedToken.userId;
    if(!userIdFromJWT) return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));

    // path variable 가져오기 (subRoomId)
    const reservationId = req.params.reservationId;

    // body 가져오기 (rating)
    const rating = req.body.rating;
    const review = req.body.review;

    const userPostReviewResult = await reservationService.makeReview(userIdFromJWT, reservationId, rating, review);

    return res.send(response(baseResponse.SUCCESS, userPostReviewResult));
};


