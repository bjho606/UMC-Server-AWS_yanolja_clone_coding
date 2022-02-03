const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reservationDao = require("./reservationDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveAllReservationList = async function () {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const allReservationListResult = await reservationDao.selectAllReservations(connection);
  // connection 해제
  connection.release();

  return allReservationListResult;
};

exports.retrieveUserReservationList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReservationListResult = await reservationDao.selectUserReservations(connection, userId);
  connection.release();

  return userReservationListResult;
};

exports.retrieveUserReservationDetails = async function (userId, reservationId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReservationDetailsResult = await reservationDao.selectUserReservationDetail(connection, userId, reservationId);
  connection.release();

  return userReservationDetailsResult;
};

exports.retrieveUserLikeList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userLikeListResult = await reservationDao.selectUserLikes(connection, userId);
  connection.release();

  return userLikeListResult;
};

exports.timeCheck = async function (subRoomIdx, checkInHour, checkOutHour) {
  const connection = await pool.getConnection(async (conn) => conn);

  // 대실 시간 확인
  if(parseInt(checkInHour.toString().split(':')[0]) <= parseInt(checkOutHour.toString().split(':')[0])){
    const timeCheckResult = await reservationDao.selectRentReservationTime(connection, subRoomIdx, checkInHour, checkOutHour);
    connection.release();
    return timeCheckResult;
  }
  // 숙박 시간 확인
  else {
    const timeCheckResult = await reservationDao.selectStayReservationTime(connection, subRoomIdx, checkInHour, checkOutHour);
    connection.release();
    return timeCheckResult;
  }

};
