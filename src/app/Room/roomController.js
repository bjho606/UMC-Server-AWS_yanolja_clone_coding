const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1~3
 * API Name : 방 조회 API (+ 카테고리, 예약여부로 검색 조회)
 * [GET] /app/rooms
 */
exports.getRooms = async function (req, res) {
    /**
     * Query String: category
     * Query String: status
     */
    const category = req.query.category
    const status = req.query.status

    if (category == null && status == null){
        // 방 전체 조회
        const roomListResult = await roomProvider.retrieveRoomList();

        return res.send(response(baseResponse.SUCCESS, roomListResult));
    }
    else if (category != null && status == null){
        // 카테고리를 통한 방 검색 조회
        const roomListByCategory = await roomProvider.retrieveRoomListByCategory(category);

        // 카테고리가 없을 때
        if (roomListByCategory == 0) return res.send(errResponse(baseResponse.ROOM_CATEGORY_NOT_EXITST));

        return res.send(response(baseResponse.SUCCESS, roomListByCategory));
    }
    else if (category == null && status != null){
        // 예약 여부에 따른 방 검색 조회
        const roomListByStatus = await roomProvider.retrieveRoomListByStatus(status);

        // 예약 가능한 방이 하나도 없을 때
        if (roomListByStatus == 0) return res.send(response(baseResponse.SUCCESS, "예약 가능한 방이 하나도 없습니다."));

        return res.send(response(baseResponse.SUCCESS, roomListByStatus));
    }
};

/**
 * API No. 4
 * API Name : 방 id로 방의 모든 정보 조회 API (with roomId)
 * [GET] /app/rooms/{roomId}
 */
exports.getRoomById = async function (req, res) {
    /**
     * Path Variable: roomId
     */
    const roomId = req.params.roomId;
    // errResponse 전달
    if (!roomId) return res.send(errResponse(baseResponse.ROOM_ROOMID_EMPTY));

    // roomId를 통한 방 검색 함수 호출 및 결과 저장
    const roomByRoomId = await roomProvider.retrieveRoom(roomId);
    if (!roomByRoomId) return res.send(errResponse(baseResponse.ROOM_ROOMID_NOT_EXIST))

    return res.send(response(baseResponse.SUCCESS, roomByRoomId));
};

/**
 * API No. 5
 * API Name : 방 id로 방의 모든 룸 조회 API (with roomId)
 * [GET] /app/rooms/subrooms/{roomId}
 */
exports.getSubRoomsById = async function (req, res) {
    /**
     * Path Variable: roomId
     */
    const roomId = req.params.roomId;
    // errResponse 전달
    if (!roomId) return res.send(errResponse(baseResponse.ROOM_ROOMID_EMPTY));

    // roomId를 통한 방 검색 함수 호출 및 결과 저장
    const subRoomsByRoomId = await roomProvider.retrieveSubRoomListById(roomId);
    if (!subRoomsByRoomId) return res.send(errResponse(baseResponse.ROOM_ROOMID_NOT_EXIST))

    return res.send(response(baseResponse.SUCCESS, subRoomsByRoomId));
};

/**
 * API No. 6
 * API Name : 새로운 방 등록 API
 * [POST] /app/rooms/new-room
 */
exports.postRoom = async function (req, res) {
    /**
     * Body
     * - Room - roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status
     * - RoomAmenityService - parking, wifi, pc, spa, pet
     * - RoomCategory - category
     */
    const {roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status, parking, wifi, pc, spa, pet, category} = req.body;

    // 빈 값 체크
    if (!roomName)
        return res.send(response(baseResponse.ROOM_ROOMNAME_EMPTY));
    if (!location)
        return res.send(response(baseResponse.ROOM_LOCATION_EMPTY));
    if (!phoneNumber)
        return res.send(response(baseResponse.ROOM_PHONENUMBER_EMPTY));
    if (!roomImgUrl)
        return res.send(response(baseResponse.ROOM_ROOMIMGURL_EMPTY));
    if (!roomDetails)
        return res.send(response(baseResponse.ROOM_ROOMDETAILS_EMPTY));
    if (!category)
        return res.send(response(baseResponse.ROOM_CATEGORY_EMPTY));

    // 형식 체크 (by 정규표현식)

    // createRoom 함수 실행을 통한 결과 값을 postNewRoomResponse에 저장
    const postNewRoomResponse = await roomService.createRoom(
        roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status,
        parking, wifi, pc, spa, pet,
        category
    );

    // postNewRoomResponse 값을 json으로 전달
    return res.send(postNewRoomResponse);
};

/**
 * API No. 7
 * API Name : 방에 룸 추가 API
 * [POST] /app/rooms/add-subroom
 */
exports.postSubRoom = async function (req, res) {
    /**
     * Body
     * - SubRoom - roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status
     */
    const {roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status} = req.body;
    const roomIdx = req.params.roomId;
    if (!roomIdx) return res.send(errResponse(baseResponse.ROOM_ROOMID_EMPTY));

    // (생략)
    // 빈 값 체크
    // 형식 체크 (by 정규표현식)

    // createRoom 함수 실행을 통한 결과 값을 postNewRoomResponse에 저장
    const postNewSubRoomResponse = await roomService.createSubRoom(
        roomIdx, roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status
    );

    // postNewRoomResponse 값을 json으로 전달
    return res.send(postNewSubRoomResponse);
};

//
// // TODO: After 로그인 인증 방법 (JWT)
// /**
//  * API No. 4
//  * API Name : 로그인 API
//  * [POST] /app/login
//  // * body : email, passsword
//  * body : email
//  */
// exports.loginUsers = async function (req, res) {
//
//     // const {email, password} = req.body;
//     const {email} = req.body;
//
//     // validation 처리
//     // const signInResponse = await userService.postSignIn(email, password);
//     const signInResponse = await userService.postSignIn(email);
//
//     return res.send(signInResponse);
// };
//
//
// /**
//  * API No. 5
//  * API Name : 회원 정보 수정 API + JWT + Validation
//  * [PATCH] /app/users/:userId
//  * path variable : userId
//  * body : point
//  */
// exports.patchUsers = async function (req, res) {
//
//     // jwt - userId, path variable :userId
//
//     const userIdFromJWT = req.verifiedToken.userId
//
//     const userId = req.params.userId;
//     const point = req.body.point;
//
//     // JWT는 이 후 주차에 다룰 내용
//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         // if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
//
//         // const editUserInfo = await userService.editUser(userId, nickname)
//         const editUserInfo = await userService.editUser(userId, point)
//         return res.send(editUserInfo);
//     }
// };
//
//
//
// // JWT 이 후 주차에 다룰 내용
// /** JWT 토큰 검증 API
//  * [GET] /app/auto-login
//  */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
