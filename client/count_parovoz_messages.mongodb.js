use('shm-chat');


db.messages.aggregate([
  {
    $match: {
      body: { $regex: /паровоз/i }
    }
  },
  {
    $count: "count"
  }
]);