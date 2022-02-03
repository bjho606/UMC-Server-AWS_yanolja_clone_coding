
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 방 조회
async function selectRoom(connection) {
  const selectRoomListQuery = `
                SELECT r.roomIdx, r.roomName, r.location, r.roomImgUrl, AVG(rr.rating) AS avg_rate, 
                       MAX(sr.maxRentHour) AS max_rentHour, MIN(sr.stayInHour) AS fastest_checkIn, MIN(sr.rentPrice) AS min_rentPrice, MIN(sr.stayPrice) AS min_stayPrice
                FROM Room r INNER JOIN SubRoom sr on r.roomIdx = sr.roomIdx
                            INNER JOIN Reservation rs on sr.subRoomIdx = rs.subRoomIdx
                            INNER JOIN ReviewRating rr on rs.reservationIdx = rr.reservationIdx
                GROUP BY r.roomIdx;
                `;
  const [roomRows] = await connection.query(selectRoomListQuery);
  return roomRows;
}

// 카테고리로 방 조회
async function selectRoomByCategory(connection, category) {
  const selectRoomCategoryQuery = `
                SELECT r.roomIdx, r.roomName, r.location, r.roomImgUrl, AVG(rr.rating) AS avg_rate, MAX(sr.maxRentHour) AS max_rentHour, MIN(sr.stayInHour) AS fastest_checkIn, MIN(sr.rentPrice) AS min_rentPrice, MIN(sr.stayPrice) AS min_stayPrice
                FROM Room r INNER JOIN SubRoom sr on r.roomIdx = sr.roomIdx
                            INNER JOIN Reservation rs on sr.subRoomIdx = rs.subRoomIdx
                            INNER JOIN ReviewRating rr on rs.reservationIdx = rr.reservationIdx
                            INNER JOIN RoomCategory rc on r.roomCategoryIdx = rc.roomCategoryIdx
                WHERE rc.category = ?
                GROUP BY r.roomIdx;
                `;
  const [categoryRows] = await connection.query(selectRoomCategoryQuery, category);
  return categoryRows;
}

// 예약 여부로 방 조회
async function selectRoomByStatus(connection, status) {
  const selectRoomStatusQuery = `
                SELECT r.roomIdx, r.roomName, r.location, r.roomImgUrl, AVG(rr.rating) AS avg_rate, MAX(sr.maxRentHour) AS max_rentHour, MIN(sr.stayInHour) AS fastest_checkIn, MIN(sr.rentPrice) AS min_rentPrice, MIN(sr.stayPrice) AS min_stayPrice, r.status
                FROM Room r INNER JOIN SubRoom sr on r.roomIdx = sr.roomIdx
                            INNER JOIN Reservation rs on sr.subRoomIdx = rs.subRoomIdx
                            INNER JOIN ReviewRating rr on rs.reservationIdx = rr.reservationIdx
                WHERE r.status = ?
                GROUP BY r.roomIdx;
                `;
  const [statusRows] = await connection.query(selectRoomStatusQuery, status);
  return statusRows;
}

// roomId로 한 방의 모든 정보 조회
async function selectRoomById(connection, roomId) {
  const selectRoomIdQuery = `
                  SELECT r.roomIdx, r.roomName, r.location, r.phoneNumber, r.roomImgUrl, AVG(rr.rating) AS avg_rate, COUNT(rr.review) AS count_review, COUNT(rr.response) AS count_response, r.roomIntro, r.roomDetails,
                         ras.parking, ras.wifi, ras.pc, ras.spa, ras.pet
                  FROM SubRoom sr INNER JOIN Room r ON sr.roomIdx = r.roomIdx
                                  INNER JOIN RoomAmenityService ras on r.roomIdx = ras.roomIdx
                                  INNER JOIN Reservation rs ON sr.subRoomIdx = rs.subRoomIdx
                                  INNER JOIN ReviewRating rr ON rs.reservationIdx = rr.reservationIdx
                  WHERE r.roomIdx = ?;
                 `;
  const [roomRow] = await connection.query(selectRoomIdQuery, roomId);
  return roomRow;
}

// roomId로 방의 모든 룸 조회
async function selectSubRoomsById(connection, roomId) {
  const selectSubRoomIdQuery = `
                  SELECT *
                  FROM SubRoom
                  WHERE roomIdx = ?;
                 `;
  const [roomRows] = await connection.query(selectSubRoomIdQuery, roomId);
  return roomRows;
}

// 해당 위치의 방이 있는지 조회
async function selectRoomLocation(connection, location) {
    const selectRoomLocationQuery = `
                  SELECT *
                  FROM Room
                  WHERE location = ?;
                 `;
    const [roomRows] = await connection.query(selectRoomLocationQuery, location);
    return roomRows;
}

// 해당 전화번호의 방이 있는지 조회
async function selectRoomPhonenumber(connection, phonenumber) {
    const selectRoomPhonenumberQuery = `
                  SELECT *
                  FROM Room
                  WHERE phoneNumber = ?;
                 `;
    const [roomRows] = await connection.query(selectRoomPhonenumberQuery, phonenumber);
    return roomRows;
}

// 카테고리의 idx 조회
async function selectRoomCategory(connection, category) {
    const selectRoomCategoryQuery = `
                  SELECT roomCategoryIdx
                  FROM RoomCategory
                  WHERE category = ?;
                 `;
    const [roomRows] = await connection.query(selectRoomCategoryQuery, category);
    return roomRows;
}

// 가장 최신 방 id 조회
async function selectLatestRoomId(connection) {
    const selectLatestRoomIdQuery = `
                    SELECT roomIdx
                    FROM Room
                    ORDER BY roomIdx desc LIMIT 1;
                 `;
    const [roomRow] = await connection.query(selectLatestRoomIdQuery);
    return roomRow[0];
}

// 새로운 방 추가
async function insertRoomInfo(connection, insertRoomInfoParams) {
    const insertRoomInfoQuery = `
                  INSERT INTO Room (roomCategoryIdx, roomName, location, phoneNumber, roomImgUrl, roomIntro, roomDetails, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                 `;
    const [insertRoomInfoRows] = await connection.query(insertRoomInfoQuery, insertRoomInfoParams);
    return insertRoomInfoRows;
}

// 새로운 방 서비스 정보 추가
async function insertRoomAmenityServiceInfo(connection, insertRoomAmenityServiceInfoParams) {
    const insertRoomAmenityServiceInfoQuery = `
                  INSERT INTO RoomAmenityService (roomIdx, parking, wifi, pc, spa, pet)
                  VALUES (?, ?, ?, ?, ?, ?);
                 `;
    const [insertRoomAmenityServiceInfoRows] = await connection.query(insertRoomAmenityServiceInfoQuery, insertRoomAmenityServiceInfoParams);
    return insertRoomAmenityServiceInfoRows;
}

// 방에 룸 추가
async function insertSubRoomInfo(connection, insertSubRoomInfoParams) {
    const insertSubRoomInfoQuery = `
                  INSERT INTO SubRoom (roomIdx, roomType, roomServiceDetails, roomDate, recNumPeople, maxNumPeople, maxRentHour, rentOpeningHour, rentClosingHour, rentPrice, stayInHour, stayOutHour, stayPrice, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                 `;
    const [insertSubRoomInfoRows] = await connection.query(insertSubRoomInfoQuery, insertSubRoomInfoParams);
    return insertSubRoomInfoRows;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
// async function selectUserAccount(connection, email) {
//   const selectUserAccountQuery = `
//         SELECT status, id
//         FROM UserInfo
//         WHERE email = ?;`;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       email
//   );
//   return selectUserAccountRow[0];
// }

module.exports = {
    selectRoom,
    selectRoomByCategory,
    selectRoomByStatus,
    selectRoomById,
    selectSubRoomsById,
    selectRoomLocation,
    selectRoomPhonenumber,
    selectRoomCategory,
    selectLatestRoomId,
    insertRoomInfo,
    insertRoomAmenityServiceInfo,
    insertSubRoomInfo
};
