const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const regexPwd = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{6,20}$/       // 6~20 영문 대소문자, 최소 1개씩의 알파벳, 숫자, 특수문자 포함

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
	return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 조회 API (+ query string으로 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {
    /**
     * Query String: email
     //* Query String: nickname
     */
    const email = req.query.email;
    // const nickname = req.query.nickname;
    // console.log(email);

    if (!email) {
    // if (!nickname) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 userListResult 호출
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 이메일을 통한 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);

        // 해당 이메일이 없을 때
        if (userListByEmail == 0) return res.send(errResponse(baseResponse.USER_USEREMAIL_NOT_EXIST));

        return res.send(response(baseResponse.SUCCESS, userListByEmail));

        /*
        // 닉네임을 통한 유저 검색 조회
        const userListByNickname = await userProvider.retrieveUserList(nickname);

        // 해당 닉네임이 없을 때
        if (userListByNickname == 0) return res.send(errResponse(baseResponse.USER_NICKNAME_NOT_EXIST));

        return res.send(response(baseResponse.SUCCESS, userListByNickname));
        */
    }
};

/**
 * API No. 2
 * API Name : 특정 유저 조회 API (path variable로)
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;
    // console.log(userId);

    // errResponse 전달
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // userId를 통한 유저 검색 함수 호출 및 결과 저장
    const userByUserId = await userProvider.retrieveUser(userId);
    if (!userByUserId) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST))

    return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 3
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users/sign-up
 */
exports.signupUser = async function (req, res) {
    /**
     * Body: name, nickname, email, password, phonenumber, profileImgUrl, status
     */
    const {name, nickname, email, password, phonenumber, profileImgUrl, status} = req.body;

    // 빈 값 체크
    if(!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!phonenumber)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (nickname.length > 10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    if (password.length > 20 || password.length < 6)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    if(!regexPwd.test(password))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));

    // createUser 함수 실행을 통한 결과 값을 signUpResponse에 저장
    const signUpResponse = await userService.createUser(
        name,
        nickname,
        email,
        password,
        phonenumber,
        profileImgUrl,
        status
    );

    // signUpResponse 값을 json으로 전달
    return res.send(signUpResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 // * body : email, passsword
 * body : email
 */
exports.loginUser = async function (req, res) {

    const {email, password} = req.body;
    // const {email} = req.body;

    // validation 처리
    if (!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    const signInResponse = await userService.postSignIn(email, password);
    // const signInResponse = await userService.postSignIn(email);

    return res.send(signInResponse);
};

// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API (자동로그인)
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS, {'userId': userIdResult}));
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname, password, phonenumber, profileImgUrl
 */
exports.patchUser = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const nickname = req.body.nickname;
    const password = req.body.password;
    const phonenumber = req.body.phonenumber;
    const profileImgUrl = req.body.profileImgUrl;

    // console.log(nickname, password, phonenumber, profileImgUrl);

    // JWT는 이 후 주차에 다룰 내용
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const editUserInfo = await userService.editUser(userId, nickname, password, phonenumber, profileImgUrl);

        return res.send(editUserInfo);
    }
};


/**
 * API No. 6
 * API Name : 회원 상태 변경 (탈퇴 포함)
 * [PATCH] /app/user-change-status
 * body : status
 */
exports.changeUserStatus = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    const status = req.body.status;

    // console.log(userIdResult);
    // status가 3가지 상태 중 하나인지 확인
    if (status != 'ACTIVE' && status != 'DELETED' && status != 'BLOCKED')
        return res.send(response(baseResponse.USER_STATUS_WRONG));

    const changeUserStatus = await userService.changeUserStatusInfo(userIdResult, status);

    return res.send(changeUserStatus);
};


/**
 * API No. 7
 * API Name : 회원 포인트 사용 내역 가져오기 API
 * [GET] /app/user-points
 */
exports.getUserPointsUsage = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    // console.log(userIdResult);

    const userPointsList = await userProvider.retrieveUserPointsList(userIdResult);
    if (userPointsList.length < 1) return errResponse(baseResponse.POINT_NOT_EXISTS);

    return res.send(response(baseResponse.SUCCESS, userPointsList));
};


