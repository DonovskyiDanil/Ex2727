module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Contests', [
      {
        id: 1,
        contestType: 'name',
        title: 'Holiday Logo',
        industry: 'IT',
        focusOfWork: 'Creating a festive atmosphere',
        targetCustomer: 'All ages',
        status: 'finished',
        prize: 1000,
        priority: 1,
        orderId: 'ORD-001',
        userId: 1,
        createdAt: new Date(), // Это поле есть в модели
      },
      {
        id: 2,
        contestType: 'name',
        title: 'New Year Brand',
        industry: 'Retail',
        focusOfWork: 'Brand identity for 2025',
        targetCustomer: 'Business owners',
        status: 'finished',
        prize: 500,
        priority: 2,
        orderId: 'ORD-002',
        userId: 2,
        createdAt: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Contests', null, {});
  },
};
