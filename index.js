const User = require('./models/User');
const connectDB = require('./db');

const {Server} = require('socket.io');

const PORT = process.env.PORT || 3001;

//connect to mongoDB
connectDB();

const io = new Server(PORT, {
    cors: true
})

const roomAdminMap = {};

io.on('connection', (socket) => {
    console.log('New Connection: ', socket.id);

    socket.on('room:join', async(data) => {
        try {
            console.log(data);
            const {name, age, city, room} = data;
            if(Object.keys(roomAdminMap).length === 0){
                const mapData = Object.freeze(name);
                roomAdminMap[room]=mapData;
            }
            console.log(roomAdminMap);

            const adminName = roomAdminMap[room];

            console.log("the db: ", await User.find({}));

            const admin = await User.findOne({ name: adminName }).exec();
        
            if (!admin) {
                console.log('User not found');
                return false;
            }

            if(adminName === name){
                io.to(room).emit('user:joined', {name, age, city, id: socket.id});
                socket.join(room);
                io.to(socket.id).emit("room:join", data);
            }else{
                const friend = await User.findOne({ name: name }).exec();
                const friendId = friend._id;
                // Check if friendId is present in user's friends array
                const isFriend = admin.friends.includes(friendId);
                if(isFriend){
                    io.to(room).emit('user:joined', {name, age, city, id: socket.id});
                    socket.join(room);//we are joining the user to the room
                    io.to(socket.id).emit("room:join", data);
                }else{
                    window.alert("You are not admin's friend!");
                }

            }

            
        } catch (error) {
            console.log("error: ", error);
        }
    });

    socket.on('welcome-message', ({name, room}) => {
        const adminName = roomAdminMap[room];
        if(name === adminName){
            io.to(room).emit('welcome-message-from-admin');
        }else {
            window.alert("Welcome message can only be sent by admin!");
        }
    })
})
