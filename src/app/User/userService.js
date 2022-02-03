const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (name, nickname, email, password, phonenumber, profileImgUrl, status) {
    try {
        // 이메일 중복 확인
        // UserProvider에서 해당 이메일과 같은 User 목록을 받아서 emailRows에 저장한 후, 배열의 길이를 검사한다.
        // -> 길이가 0 이상이면 이미 해당 이메일을 갖고 있는 User가 조회된다는 의미
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 닉네임 중복 확인
        const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // null값 채우기    (질문) 이 처리를 어디서 어떻게 하는게 좋은가?
        if (!name) name = 'unknown';
        if (!status) status = 'y';

        // 쿼리문에 사용할 변수 값을 배열 형태로 전달
        // const insertUserInfoParams = [email, hashedPassword, nickname];
        const insertUserInfoParams = [name, nickname, email, hashedPassword, phonenumber, profileImgUrl, status];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        // console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();

        return response(baseResponse.SUCCESS, {'userId': userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
// exports.postSignIn = async function (email) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        // const selectUserPasswordParams = [selectEmail, hashedPassword];
        // const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        const passwordRow = await userProvider.passwordCheck(selectEmail);
        // console.log(passwordRow.password, hashedPassword);

        if (passwordRow.password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRow = await userProvider.accountCheck(email);
        // console.log(userInfoRow.status);

        if (userInfoRow.status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_DELETED_ACCOUNT);
        } else if (userInfoRow.status === "BLOCKED") {
            return errResponse(baseResponse.SIGNIN_BLOCKED_ACCOUNT);
        }

        // console.log(userInfoRow.userIdx) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRow.userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                // expiresIn: "365d",
                expiresIn: "1d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRow.userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (id, nickname, password, phonenumber, profileImgUrl) {
    try {
        console.log(id, nickname, password, phonenumber, profileImgUrl);
        // validation 체크
        // 닉네임 중복 체크
        if (nickname) {
            const nicknameRows = await userProvider.nicknameCheck(nickname);
            if (nicknameRows.length > 0)
                return errResponse(baseResponse.PATCH_USER_NICKNAME_ALREADY_EXIST);
        }

        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname, hashedPassword, phonenumber, profileImgUrl);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.changeUserStatusInfo = async function (id, status) {
    try {
        // 회원 상태가 바뀌었는지 확인
        const statusRow = await userProvider.statusCheck(id);
        if (statusRow.status === status)
            return errResponse(baseResponse.PATCH_USER_STATUS_UNCHANGED);

        const connection = await pool.getConnection(async (conn) => conn);
        const changeUserStatusResult = await userDao.changeUserStatus(connection, id, status);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
