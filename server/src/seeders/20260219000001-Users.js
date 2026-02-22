const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('pass123', 10);
    
    const users = [
      // Группа 1: Базовые пользователи
      { id: 1, firstName: 'Danyl', lastName: 'Donovskyi', displayName: 'Donovskyi', email: 'qwerty!@gmail.com', role: 'customer', balance: 0, rating: 0 },
      { id: 2, firstName: 'Second', lastName: 'User', displayName: 'User2', email: 'user2@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 3, firstName: 'Petr', lastName: 'Petrov', displayName: 'Petya', email: 'petr@test.com', role: 'customer', balance: 50, rating: 0 },
      { id: 4, firstName: 'Sidor', lastName: 'Sidorov', displayName: 'Admin-1', email: 'admin@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 5, firstName: 'Anna', lastName: 'Smirnova', displayName: 'Ann', email: 'anna@test.com', role: 'creator', balance: 260, rating: 0 },
      { id: 6, firstName: 'Ivan', lastName: 'Ivanov', displayName: 'Ivan', email: 'ivan@test.com', role: 'customer', balance: 0, rating: 0 },
      { id: 7, firstName: 'Alex', lastName: 'Mod', displayName: 'Moder-1', email: 'mod@test.com', role: 'moderator', balance: 0, rating: 0 },
      
      // Группа 2: Админы (8 - 46)
      { id: 8, firstName: 'Admin_1', lastName: 'Test', displayName: 'admin1', email: 'admin1@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 9, firstName: 'Admin_2', lastName: 'Test', displayName: 'admin2', email: 'admin2@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 10, firstName: 'Admin_3', lastName: 'Test', displayName: 'admin3', email: 'admin3@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 11, firstName: 'Admin_4', lastName: 'Test', displayName: 'admin4', email: 'admin4@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 12, firstName: 'Admin_5', lastName: 'Test', displayName: 'admin5', email: 'admin5@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 13, firstName: 'Admin_6', lastName: 'Test', displayName: 'admin6', email: 'admin6@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 14, firstName: 'Admin_7', lastName: 'Test', displayName: 'admin7', email: 'admin7@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 15, firstName: 'Admin_8', lastName: 'Test', displayName: 'admin8', email: 'admin8@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 16, firstName: 'Admin_9', lastName: 'Test', displayName: 'admin9', email: 'admin9@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 17, firstName: 'Admin_10', lastName: 'Test', displayName: 'admin10', email: 'admin10@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 18, firstName: 'Admin_11', lastName: 'Test', displayName: 'admin11', email: 'admin11@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 19, firstName: 'Admin_12', lastName: 'Test', displayName: 'admin12', email: 'admin12@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 20, firstName: 'Admin_13', lastName: 'Test', displayName: 'admin13', email: 'admin13@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 21, firstName: 'Admin_14', lastName: 'Test', displayName: 'admin14', email: 'admin14@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 22, firstName: 'Admin_15', lastName: 'Test', displayName: 'admin15', email: 'admin15@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 23, firstName: 'Admin_16', lastName: 'Test', displayName: 'admin16', email: 'admin16@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 24, firstName: 'Admin_17', lastName: 'Test', displayName: 'admin17', email: 'admin17@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 25, firstName: 'Admin_18', lastName: 'Test', displayName: 'admin18', email: 'admin18@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 26, firstName: 'Admin_19', lastName: 'Test', displayName: 'admin19', email: 'admin19@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 27, firstName: 'Admin_20', lastName: 'Test', displayName: 'admin20', email: 'admin20@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 28, firstName: 'Admin_21', lastName: 'Test', displayName: 'admin21', email: 'admin21@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 29, firstName: 'Admin_22', lastName: 'Test', displayName: 'admin22', email: 'admin22@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 30, firstName: 'Admin_23', lastName: 'Test', displayName: 'admin23', email: 'admin23@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 31, firstName: 'Admin_24', lastName: 'Test', displayName: 'admin24', email: 'admin24@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 32, firstName: 'Admin_25', lastName: 'Test', displayName: 'admin25', email: 'admin25@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 33, firstName: 'Admin_26', lastName: 'Test', displayName: 'admin26', email: 'admin26@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 34, firstName: 'Admin_27', lastName: 'Test', displayName: 'admin27', email: 'admin27@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 35, firstName: 'Admin_28', lastName: 'Test', displayName: 'admin28', email: 'admin28@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 36, firstName: 'Admin_29', lastName: 'Test', displayName: 'admin29', email: 'admin29@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 37, firstName: 'Admin_30', lastName: 'Test', displayName: 'admin30', email: 'admin30@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 38, firstName: 'Admin_31', lastName: 'Test', displayName: 'admin31', email: 'admin31@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 39, firstName: 'Admin_32', lastName: 'Test', displayName: 'admin32', email: 'admin32@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 40, firstName: 'Admin_33', lastName: 'Test', displayName: 'admin33', email: 'admin33@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 41, firstName: 'Admin_34', lastName: 'Test', displayName: 'admin34', email: 'admin34@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 42, firstName: 'Admin_35', lastName: 'Test', displayName: 'admin35', email: 'admin35@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 43, firstName: 'Admin_36', lastName: 'Test', displayName: 'admin36', email: 'admin36@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 44, firstName: 'Admin_37', lastName: 'Test', displayName: 'admin37', email: 'admin37@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 45, firstName: 'Admin_38', lastName: 'Test', displayName: 'admin38', email: 'admin38@test.com', role: 'admin', balance: 0, rating: 0 },
      { id: 46, firstName: 'Admin_39', lastName: 'Test', displayName: 'admin39', email: 'admin39@test.com', role: 'admin', balance: 0, rating: 0 },

      // Группа 3: Покупатели (47 - 76)
      { id: 47, firstName: 'Customer_1', lastName: 'User', displayName: 'cust1', email: 'customer1@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 48, firstName: 'Customer_2', lastName: 'User', displayName: 'cust2', email: 'customer2@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 49, firstName: 'Customer_3', lastName: 'User', displayName: 'cust3', email: 'customer3@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 50, firstName: 'Customer_4', lastName: 'User', displayName: 'cust4', email: 'customer4@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 51, firstName: 'Customer_5', lastName: 'User', displayName: 'cust5', email: 'customer5@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 52, firstName: 'Customer_6', lastName: 'User', displayName: 'cust6', email: 'customer6@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 53, firstName: 'Customer_7', lastName: 'User', displayName: 'cust7', email: 'customer7@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 54, firstName: 'Customer_8', lastName: 'User', displayName: 'cust8', email: 'customer8@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 55, firstName: 'Customer_9', lastName: 'User', displayName: 'cust9', email: 'customer9@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 56, firstName: 'Customer_10', lastName: 'User', displayName: 'cust10', email: 'customer10@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 57, firstName: 'Customer_11', lastName: 'User', displayName: 'cust11', email: 'customer11@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 58, firstName: 'Customer_12', lastName: 'User', displayName: 'cust12', email: 'customer12@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 59, firstName: 'Customer_13', lastName: 'User', displayName: 'cust13', email: 'customer13@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 60, firstName: 'Customer_14', lastName: 'User', displayName: 'cust14', email: 'customer14@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 61, firstName: 'Customer_15', lastName: 'User', displayName: 'cust15', email: 'customer15@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 62, firstName: 'Customer_16', lastName: 'User', displayName: 'cust16', email: 'customer16@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 63, firstName: 'Customer_17', lastName: 'User', displayName: 'cust17', email: 'customer17@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 64, firstName: 'Customer_18', lastName: 'User', displayName: 'cust18', email: 'customer18@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 65, firstName: 'Customer_19', lastName: 'User', displayName: 'cust19', email: 'customer19@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 66, firstName: 'Customer_20', lastName: 'User', displayName: 'cust20', email: 'customer20@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 67, firstName: 'Customer_21', lastName: 'User', displayName: 'cust21', email: 'customer21@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 68, firstName: 'Customer_22', lastName: 'User', displayName: 'cust22', email: 'customer22@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 69, firstName: 'Customer_23', lastName: 'User', displayName: 'cust23', email: 'customer23@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 70, firstName: 'Customer_24', lastName: 'User', displayName: 'cust24', email: 'customer24@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 71, firstName: 'Customer_25', lastName: 'User', displayName: 'cust25', email: 'customer25@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 72, firstName: 'Customer_26', lastName: 'User', displayName: 'cust26', email: 'customer26@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 73, firstName: 'Customer_27', lastName: 'User', displayName: 'cust27', email: 'customer27@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 74, firstName: 'Customer_28', lastName: 'User', displayName: 'cust28', email: 'customer28@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 75, firstName: 'Customer_29', lastName: 'User', displayName: 'cust29', email: 'customer29@test.com', role: 'customer', balance: 500, rating: 0 },
      { id: 76, firstName: 'Customer_30', lastName: 'User', displayName: 'cust30', email: 'customer30@test.com', role: 'customer', balance: 500, rating: 0 },

      // Группа 4: Прочие креаторы (77 - 95)
      { id: 77, firstName: 'Creator_1', lastName: 'Worker', displayName: 'work1', email: 'work1@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 78, firstName: 'Creator_2', lastName: 'Worker', displayName: 'work2', email: 'work2@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 79, firstName: 'Creator_3', lastName: 'Worker', displayName: 'work3', email: 'work3@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 80, firstName: 'Creator_4', lastName: 'Worker', displayName: 'work4', email: 'work4@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 81, firstName: 'Creator_5', lastName: 'Worker', displayName: 'work5', email: 'work5@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 82, firstName: 'Creator_6', lastName: 'Worker', displayName: 'work6', email: 'work6@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 83, firstName: 'Creator_7', lastName: 'Worker', displayName: 'work7', email: 'work7@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 84, firstName: 'Creator_8', lastName: 'Worker', displayName: 'work8', email: 'work8@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 85, firstName: 'Creator_9', lastName: 'Worker', displayName: 'work9', email: 'work9@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 86, firstName: 'Creator_10', lastName: 'Worker', displayName: 'work10', email: 'work10@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 87, firstName: 'Creator_11', lastName: 'Worker', displayName: 'work11', email: 'work11@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 88, firstName: 'Creator_12', lastName: 'Worker', displayName: 'work12', email: 'work12@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 89, firstName: 'Creator_13', lastName: 'Worker', displayName: 'work13', email: 'work13@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 90, firstName: 'Creator_14', lastName: 'Worker', displayName: 'work14', email: 'work14@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 91, firstName: 'Creator_15', lastName: 'Worker', displayName: 'work15', email: 'work15@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 92, firstName: 'Creator_16', lastName: 'Worker', displayName: 'work16', email: 'work16@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 93, firstName: 'Creator_17', lastName: 'Worker', displayName: 'work17', email: 'work17@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 94, firstName: 'Creator_18', lastName: 'Worker', displayName: 'work18', email: 'work18@test.com', role: 'creator', balance: 0, rating: 0 },
      { id: 95, firstName: 'Creator_19', lastName: 'Worker', displayName: 'work19', email: 'work19@test.com', role: 'creator', balance: 0, rating: 0 },

      // Группа 5: Креаторы с рейтингом
      { id: 96, firstName: 'Danylo', lastName: 'Work', displayName: 'DanyaW', email: 'danya_unique@test.com', role: 'creator', balance: 0, rating: 4.7 },
      { id: 97, firstName: 'Olena', lastName: 'Pro', displayName: 'Olenka', email: 'olena_unique@test.com', role: 'creator', balance: 0, rating: 4.6 },
      { id: 98, firstName: 'Ihor', lastName: 'Master', displayName: 'MasterIt', email: 'ihor_unique@test.com', role: 'creator', balance: 0, rating: 4.5 },
      { id: 99, firstName: 'Anna', lastName: 'Artist', displayName: 'Anyuta', email: 'anna_unique@test.com', role: 'creator', balance: 0, rating: 4.4 }
    ];

    // Убираем createdAt и updatedAt, так как их нет в твоей таблице
    const finalUsers = users.map(user => ({ 
      ...user,
      password: hashedPassword,
      avatar: 'anon.png'
    }));

    await queryInterface.bulkInsert('Users', finalUsers);

    // Синхронизация счетчика ID
    await queryInterface.sequelize.query(
      `SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM "Users"))`
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
