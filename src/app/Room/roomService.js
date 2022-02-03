const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// Room 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const roomProvider = require("./roomProvider");
const roomDao = require("./roomDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createRoom = async function (roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status, parking, wifi, pc, spa, pet, category) {
    try {
        // 중복 확인 (위치, 전화번호)
        const locationRows = await roomProvider.locationCheck(location);
        if (locationRows.length > 0)
            return errResponse(baseResponse.ROOM_LOCATION_ALREADY_EXIST);
        const phoneNumberRows = await roomProvider.phoneNumberCheck(phoneNumber);
        if (phoneNumberRows.length > 0)
            return errResponse(baseResponse.ROOM_PHONENUMBER_ALREADY_EXIST);

        // 카테고리 확인 (카테고리 id 확인)
        const categoryRows = await roomProvider.categoryCheck(category);
        const roomCategoryIdx = categoryRows[0].roomCategoryIdx;

        const connection = await pool.getConnection(async (conn) => conn);

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        // const insertRoomInfoParams = [roomCategoryIdx, roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status, parking, wifi, pc, spa, pet, category];
        if(status == null) status = 'AVAILABLE';
        const insertRoomInfoParams = [roomCategoryIdx, roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status];

        // 방 정보 삽입
        const addRoomResult = await roomDao.insertRoomInfo(connection, insertRoomInfoParams);

        // 추가된 방 ID 가져오기
        const addedRoomInfo = await roomProvider.roomCheck(connection);
        console.log(addedRoomInfo.roomIdx);
        const addedRoomId = addedRoomInfo.roomIdx;

        // 방 서비스 정보 삽입
        const insertRoomAmenityServiceInfoParams = [addedRoomId, parking, wifi, pc, spa, pet];

        const addRoomAmenityServiceResult = await roomDao.insertRoomAmenityServiceInfo(connection, insertRoomAmenityServiceInfoParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"Added roomIdx" : addedRoomId});

    } catch (err) {
        logger.error(`App - createRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createSubRoom = async function (roomIdx, roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status) {
    try {
        // 중복 확인 (생략)

        const connection = await pool.getConnection(async (conn) => conn);

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        if(status == null) status = 'y';
        const insertSubRoomInfoParams = [roomIdx, roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status];

        // 룸 정보 삽입
        const addSubRoomResult = await roomDao.insertSubRoomInfo(connection, insertSubRoomInfoParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//
//
// // TODO: After 로그인 인증 방법 (JWT)
// // exports.postSignIn = async function (email, password) {
// exports.postSignIn = async function (email) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await roomProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
//
//         const selectEmail = emailRows[0].email
//
//         // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
//         // // const hashedPassword = await crypto
//         // //     .createHash("sha512")
//         // //     .update(password)
//         // //     .digest("hex");
//         // //
//         // // const selectRoomPasswordParams = [selectEmail, hashedPassword];
//         // // const passwordRows = await RoomProvider.passwordCheck(selectRoomPasswordParams);
//         //
//         // if (passwordRows[0].password !== hashedPassword) {
//         //     return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         // }
//
//         // 계정 상태 확인
//         const RoomInfoRows = await RoomProvider.accountCheck(email);
//
//         // if (RoomInfoRows[0].status === "INACTIVE") {
//         //     return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         // } else if (RoomInfoRows[0].status === "DELETED") {
//         //     return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         // }
//
//         console.log(RoomInfoRows[0].RoomIdx) // DB의 RoomId
//
//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 RoomId: RoomInfoRows[0].RoomIdx,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 // expiresIn: "365d",
//                 expiresIn: "1d",
//                 subject: "RoomInfo",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'RoomId': RoomInfoRows[0].RoomIdx, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };
//
// exports.editRoom = async function (id, point) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editRoomResult = await RoomDao.updateRoomInfo(connection, id, point)
//         connection.release();
//
//         return response(baseResponse.SUCCESS);
//
//     } catch (err) {
//         logger.error(`App - editRoom Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }