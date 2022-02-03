
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 예약내역 조회
async function selectAllReservations(connection) {
  const selectALLReservationListQuery = `
                SELECT * 
                FROM Reservation;
                `;
  const [reservationRows] = await connection.query(selectALLReservationListQuery);
  return reservationRows;
}

// userId로 한 회원의 예약 내역 조회
async function selectUserReservations(connection, userId) {
  const selectUserReservationListQuery = `
                  SELECT SR.subRoomIdx, date_format(SR.roomDate, '%Y.%m.%d (%W)') AS reservationDate, RS.reservationNum,
                         CASE RS.status WHEN 'reserved' THEN '예약 완료'
                                        WHEN 'using' THEN '이용 중'
                                        WHEN 'done' THEN '이용 완료'
                           END AS status,
                         R.roomName, R.roomImgUrl, SR.roomType, RS.transportation, RS.checkInHour, RS.checkOutHour,
                         IF (RS.checkInHour < RS.checkOutHour, CONCAT(SR.maxRentHour, '시간'), '1박') AS reservation_time
                  FROM Reservation RS INNER JOIN SubRoom SR ON RS.subRoomIdx = SR.subRoomIdx INNER JOIN Room R on SR.roomIdx = R.roomIdx
                  WHERE userIdx = 1;
                 `;
  const [reservationRows] = await connection.query(selectUserReservationListQuery, userId);
  return reservationRows;
}

// userId와 reserveationId로 한 회원의 상세 예약 내역 조회
async function selectUserReservationDetail(connection, userId, reservationId) {
  const selectUserReservationDetailsQuery = `
                  SELECT date_format(SR.roomDate, '%Y.%m.%d (%W)') AS reservationDate, RS.reservationNum,
                         CASE RS.status WHEN 'reserved' THEN '예약 완료'
                                        WHEN 'using' THEN '이용 중'
                                        WHEN 'done' THEN '이용 완료'
                           END AS status,
                         R.roomName, R.roomImgUrl, SR.roomType, RS.transportation, RS.checkInHour, RS.checkOutHour,
                         IF (RS.checkInHour < RS.checkOutHour, CONCAT(SR.maxRentHour, '시간'), '1박') AS reservation_time,
                         U.nickname, U.phoneNumber, RS.price
                  FROM Reservation RS INNER JOIN SubRoom SR ON RS.subRoomIdx = SR.subRoomIdx INNER JOIN Room R on SR.roomIdx = R.roomIdx INNER JOIN User U on RS.userIdx = U.userIdx
                  WHERE RS.userIdx = ? AND RS.reservationIdx = ?;
                 `;
  const [reservationRows] = await connection.query(selectUserReservationDetailsQuery, [userId, reservationId]);
  return reservationRows;
}

// userId로 한 회원의 찜 목록 조회
async function selectUserLikes(connection, userId) {
  const selectUserLikeListQuery = `
                  SELECT CONCAT(date_format(NOW(), '%m.%d'), '~', date_format(DATE_ADD(NOW(), INTERVAL 1 DAY), '%m.%d'), ', 1박') AS current_day,
                         R.roomName, R.roomImgUrl, AVG(RR.rating) AS avg_rate, COUNT(RR.review) AS count_review, RC.category, R.location,
                         IF(SR.maxRentHour >= 5, CONCAT('최대 대실 ', SR.maxRentHour, '시간 객실 보유'), '') AS max_rentHour_alarm,
                         CONCAT('대실 ', SR.maxRentHour, '시간') AS rent_hour, CONCAT(SR.rentPrice, '원') AS rent_price,
                         CONCAT('숙박 ', SR.stayInHour, '부터') AS checkIn, CONCAT(SR.stayPrice, '원') AS stay_price
                  FROM Likes L INNER JOIN Room R ON L.roomIdx = R.roomIdx
                               INNER JOIN SubRoom SR on R.roomIdx = SR.roomIdx
                               INNER JOIN RoomCategory RC on R.roomCategoryIdx = RC.roomCategoryIdx
                               INNER JOIN Reservation RS ON SR.subRoomIdx = RS.subRoomIdx
                               INNER JOIN ReviewRating RR ON RS.reservationIdx = RR.reservationIdx
                  WHERE L.userIdx = ?;
                 `;
  const [likeRows] = await connection.query(selectUserLikeListQuery, userId);
  return likeRows;
}

// 대실 예약 가능여부 (상태, 시간) 확인
async function selectRentReservationTime(connection, subRoomIdx, checkInHour, checkOutHour) {
  const selectReservationAvailableQuery = `
                  SELECT SR.subRoomIdx, SR.rentOpeningHour, SR.rentPrice
                  FROM SubRoom SR
                  WHERE SR.subRoomIdx = ? AND SR.status = 'y' AND SR.rentOpeningHour <= ? AND SR.rentClosingHour >= ?;
                  `;
  const [selectReservationAvailableRows] = await connection.query(
        selectReservationAvailableQuery,
        [subRoomIdx, checkInHour, checkOutHour]
  );
  return selectReservationAvailableRows;
}

// 숙박 예약 가능여부 (상태, 시간) 확인
async function selectStayReservationTime(connection, subRoomIdx, checkInHour, checkOutHour) {
  const selectReservationAvailableQuery = `
                  SELECT SR.subRoomIdx, SR.stayInHour, SR.stayPrice
                  FROM SubRoom SR
                  WHERE SR.subRoomIdx = ? AND SR.status = 'y' AND SR.stayInHour <= ? AND SR.stayOutHour >= ?;
                  `;
  const [selectReservationAvailableRows] = await connection.query(
        selectReservationAvailableQuery,
        [subRoomIdx, checkInHour, checkOutHour]
  );
  return selectReservationAvailableRows;
}

// 예약하기
async function insertReservationInfo(connection, insertReservationInfoParams) {
  const insertReservationInfoQuery = `
                  INSERT INTO Reservation (reservationNum, userIdx, subRoomIdx, checkInHour, checkOutHour, transportation, price)
                  VALUES (?, ?, ?, ?, ?, ?, ?);
                  `;
  const [insertReservationRow] = await connection.query(insertReservationInfoQuery, insertReservationInfoParams);
  return insertReservationRow;
}

async function updateRoomStatusToRented(connection, subRoomIdx) {
  const updateRoomStatusToRentedQuery = `
                UPDATE SubRoom
                SET status = 'r'
                WHERE subRoomIdx = ?;
                `;
  const [updateRoomStatusRow] = await connection.query(updateRoomStatusToRentedQuery, subRoomIdx);
  return updateRoomStatusRow;
}

async function updateRoomStatusToStayed(connection, subRoomIdx) {
  const updateRoomStatusToStayedQuery = `
                UPDATE SubRoom
                SET status = 's'
                WHERE subRoomIdx = ?;
                `;
  const [updateRoomStatusRow] = await connection.query(updateRoomStatusToStayedQuery, subRoomIdx);
  return updateRoomStatusRow;
}

async function cancelReservationInfo(connection, reservationNum) {
  const cancelReservationQuery = `
                DELETE FROM Reservation
                WHERE reservationNum = ?;
                `;
  const [cancelReservationRow] = await connection.query(cancelReservationQuery, reservationNum);
  return cancelReservationRow;
}

async function updateSubRoomReady(connection, subRoomIdx) {
    const updateRoomStatusToYesQuery = `
                UPDATE SubRoom
                SET status = 'y'
                WHERE subRoomIdx = ?;
                `;
    const [updateRoomStatusRow] = await connection.query(updateRoomStatusToYesQuery, subRoomIdx);
    return updateRoomStatusRow;
}

// 리뷰 등록하
async function InsertReviewInfo(connection, reservationIdx, rating, review) {
    const insertReviewInfoQuery = `
                  INSERT INTO ReviewRating (reservationIdx, rating, review, reviewDate)
                  VALUES (?, ?, ?, NOW());
                  `;
    const [insertReviewRow] = await connection.query(insertReviewInfoQuery, [reservationIdx, rating, review]);
    return insertReviewRow;
}

module.exports = {
    selectAllReservations,
    selectUserReservations,
    selectUserReservationDetail,
    selectUserLikes,
    selectRentReservationTime,
    selectStayReservationTime,
    insertReservationInfo,
    updateRoomStatusToRented,
    updateRoomStatusToStayed,
    cancelReservationInfo,
    updateSubRoomReady,
    InsertReviewInfo
};
