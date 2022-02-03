const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const roomDao = require("./roomDao");

// Provider: Read 비즈니스 로직 처리

// 전체 방 조회
exports.retrieveRoomList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const roomListResult = await roomDao.selectRoom(connection);
  // connection 해제
  connection.release();

  return roomListResult;
};

exports.retrieveRoomListByCategory = async function (category) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomByCategory(connection, category);
    connection.release();

    return roomListResult;
};

exports.retrieveRoomListByStatus = async function (status) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoomByStatus(connection, status);
    connection.release();

    return roomListResult;
};

exports.retrieveRoom = async function (roomId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const roomResult = await roomDao.selectRoomById(connection, roomId);
  connection.release();

  // return roomResult;
  return roomResult[0]; // 한 명의 방 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.retrieveSubRoomListById = async function (roomId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const roomResult = await roomDao.selectSubRoomsById(connection, roomId);
  connection.release();

  return roomResult;
};

exports.locationCheck = async function (location) {
  const connection = await pool.getConnection(async (conn) => conn);
  const locationCheckResult = await roomDao.selectRoomLocation(connection, location);
  connection.release();

  return locationCheckResult;
};

exports.phoneNumberCheck = async function (phonenumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phonenumberCheckResult = await roomDao.selectRoomPhonenumber(connection, phonenumber);
  connection.release();

  return phonenumberCheckResult;
};

exports.categoryCheck = async function (category) {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryCheckResult = await roomDao.selectRoomCategory(connection, category);
  connection.release();

  return categoryCheckResult;
};

exports.roomCheck = async function (){
    const connection = await pool.getConnection(async (conn) => conn);
    const latestRoomIdCheckResult = await roomDao.selectLatestRoomId(connection);
    connection.release();

    return latestRoomIdCheckResult;
}

//
// exports.passwordCheck = async function (selectroomPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   // 쿼리문에 여러개의 인자를 전달할 때 selectroomPasswordParams와 같이 사용합니다.
//   const passwordCheckResult = await roomDao.selectroomPassword(
//       connection,
//       selectroomPasswordParams
//   );
//   connection.release();
//   return passwordCheckResult[0];
// };
//
// exports.accountCheck = async function (email) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const roomAccountResult = await roomDao.selectroomAccount(connection, email);
//   connection.release();
//
//   return roomAccountResult;
// };