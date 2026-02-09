use('shm-chat');


db.messages.aggregate([
  {
    $match: {
      text: { $regex: /паровоз/i }
    }
  },
  {
    $count: "total_parovoz_messages"
  }
]);