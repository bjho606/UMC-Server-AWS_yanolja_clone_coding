//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"요청에 성공하였습니다." },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2010, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2011, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2012, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2013, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2014, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2015, "message":"비밀번호 형식을 정확하게 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2016, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2017,"message":"닉네임은 최대 10자리까지만 입력해주세요." },
    SIGNUP_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2018, "message":"전화번호를 입력 해주세요." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2019, "message": "이름을 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2050, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2051, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2052, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2053, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2100, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2101, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2102, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2103, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2104, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2105, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2106, "message": "회원 상태값을 입력해주세요" },

    USER_NICKNAME_ALREADY_EXIST : {"isSuccess": false, "code": 2107, "message": "해당 닉네임이 이미 존재합니다."},
    USER_NICKNAME_NOT_EXIST : {"isSuccess": false, "code": 2108, "message": "해당 닉네임이 존재하지 않습니다."},

    USER_STATUS_WRONG : {"isSuccess": false, "code": 2109, "message": "올바른 계정 상태를 입력해주세요."},

    ROOM_ROOMID_EMPTY : { "isSuccess": false, "code": 2200, "message": "roomId를 입력해주세요." },
    ROOM_ROOMID_NOT_EXIST : { "isSuccess": false, "code": 2201, "message": "해당 방이 존재하지 않습니다." },
    ROOM_CATEGORY_NOT_EXITST : { "isSuccess": false, "code": 2202, "message": "방 카테고리가 존재하지 않습니다." },
    ROOM_NO_ROOMS_AVAILABLE : { "isSuccess": false, "code": 2203, "message": "예약 가능한 방이 존재하지 않습니다." },

    ROOM_ROOMNAME_EMPTY : { "isSuccess": false, "code": 2204, "message": "방 이름을 입력해주세요." },
    ROOM_LOCATION_EMPTY : { "isSuccess": false, "code": 2205, "message": "위치를 입력해주세요." },
    ROOM_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2206, "message": "전화번호를 입력해주세요." },
    ROOM_ROOMIMGURL_EMPTY : { "isSuccess": false, "code": 2207, "message": "방 대표사진을 입력해주세요." },
    ROOM_ROOMDETAILS_EMPTY : { "isSuccess": false, "code": 2208, "message": "방 상세정보를 입력해주세요." },
    ROOM_STATUS_EMPTY : { "isSuccess": false, "code": 2209, "message": "방 상태를 입력해주세요." },
    ROOM_CATEGORY_EMPTY : { "isSuccess": false, "code": 2210, "message": "방 카테고리를 입력해주세요." },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3050, "message": "이메일을 잘못 입력하였습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3051, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_DELETED_ACCOUNT : { "isSuccess": false, "code": 3052, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_BLOCKED_ACCOUNT : { "isSuccess": false, "code": 3053, "message": "정지 된 계정입니다. 고객센터에 문의해주세요." },

    PATCH_USER_NICKNAME_ALREADY_EXIST : {"isSuccess": false, "code": 3100, "message": "해당 닉네임이 이미 존재합니다."},
    PATCH_USER_STATUS_UNCHANGED : {"isSuccess": false, "code": 3101, "message": "계정 상태가 바뀌지 않았습니다."},

    POINT_NOT_EXISTS : {"isSuccess": false, "code": 3102, "message": "포인트 사용/적립 내역이 없습니다."},

    ROOM_LOCATION_ALREADY_EXIST : {"isSuccess": false, "code": 3200, "message": "중복된 장소입니다."},
    ROOM_PHONENUMBER_ALREADY_EXIST : {"isSuccess": false, "code": 3201, "message": "중복된 번호입니다."},

    RESERVATION_UNAVAILABLE : {"isSuccess": false, "code": 3300, "message": "예약이 불가능합니다."},

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

}
