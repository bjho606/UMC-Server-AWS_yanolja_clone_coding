
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userIdx, name, nickname, email, password, phonenumber, profileImgUrl, status 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 특정 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT userIdx, name, nickname, email, password, phonenumber, profileImgUrl, status
                FROM User
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 닉네임으로 회원 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNicknameQuery = `
                SELECT userIdx, name, nickname, email, password, phonenumber, profileImgUrl, status
                FROM User 
                WHERE nickname = ?;
                `;
  const [nicknameRows] = await connection.query(selectUserNicknameQuery, nickname);
  return nicknameRows;
}

// userId로 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT u.userIdx, u.name, u.nickname, u.email, u.phonenumber, u.profileImgUrl, u.status, SUM(p.point) as total_point
                 FROM User u INNER JOIN Point p ON u.userIdx = p.userIdx
                 WHERE u.userIdx = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(name, nickname, email, password, phonenumber, profileImgUrl, status)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
async function selectUserPassword(connection, email) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM User 
        WHERE email = ?;`;
        // WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      email
  );

  return selectUserPasswordRow[0];
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT userIdx, status
        FROM User 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

// 유저 계정 상태 체크 (with jwt id)
async function selectUserStatus(connection, id) {
  const selectUserAccountQuery = `
        SELECT userIdx, status
        FROM User 
        WHERE userIdx = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      id
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname, password, phonenumber, profileImgUrl) {
  const updateUserQuery = `
  UPDATE User
  SET
    nickname = CASE WHEN ? IS NULL THEN nickname ELSE ? END,
    password = CASE WHEN ? IS NULL THEN password ELSE ? END,
    phonenumber = CASE WHEN ? IS NULL THEN phonenumber ELSE ? END,
    profileImgUrl = CASE WHEN ? IS NULL THEN profileImgUrl ELSE ? END
  WHERE userIdx = ?;`;

  const updateUserRow = await connection.query(updateUserQuery, [nickname, nickname, password, password, phonenumber, phonenumber, profileImgUrl, profileImgUrl, id]);

  return updateUserRow[0];
}

async function changeUserStatus(connection, id, status) {
  const changeUserStatusQuery = `
  UPDATE User
  SET status = ?
  WHERE userIdx = ?;`;

  const changeUserStatusRow = await connection.query(changeUserStatusQuery, [status, id]);

  return changeUserStatusRow[0];
}

async function getUserPointsList(connection, id) {
  const getUserPointsQuery = `
    SELECT rs.userIdx, rm.roomName, rs.createAt, p.point, p.usage
    FROM Reservation rs INNER JOIN SubRoom s ON rs.subRoomIdx = s.subRoomIdx INNER JOIN Room rm ON s.roomIdx = rm.roomIdx INNER JOIN Point p ON rs.reservationIdx = p.reserveIdx
    WHERE rs.userIdx = ?;
  `;

  const [getUserPointsRow] = await connection.query(getUserPointsQuery, id);
  console.log(getUserPointsRow);
  return getUserPointsRow;
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserNickname,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  selectUserStatus,
  changeUserStatus,
  getUserPointsList
};
