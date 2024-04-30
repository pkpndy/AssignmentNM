db.users.aggregate([
    { $match: { _id: ObjectId("userId") } }, // Replace "userId" with the actual user ID
    { $unwind: "$friends" },
    { $lookup: {
        from: "users",
        localField: "friends",
        foreignField: "_id",
        as: "friendInfo"
    }},
    { $unwind: "$friendInfo" },
    { $project: {
        _id: 0,
        friendName: "$friendInfo.name",
        friendAge: "$friendInfo.age"
    }},
    { $sort: { friendAge: -1 }},
    { $group: {
        _id: null,
        myFriends: { $push: { friendName: "$friendName", friendAge: "$friendAge" }}
    }},
    { $project: { _id: 0 }}
])
