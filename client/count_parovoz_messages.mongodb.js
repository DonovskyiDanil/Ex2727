use('shm-chat');


db.messages.aggregate([
  {
    $match: {
<<<<<<< HEAD
      body: { $regex: /паровоз/i }
    }
  },
  {
    $count: "count"
=======
      text: { $regex: /паровоз/i }
    }
  },
  {
    $count: "total_parovoz_messages"
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  }
]);