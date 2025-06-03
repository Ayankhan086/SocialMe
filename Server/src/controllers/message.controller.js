import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import Message from "../models/message.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Follow } from "../models/follow.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { getRecieverSocketId } from "../app.js"



async function getUsersForSidebar(req, res) {

    try {

        const myId = req.user._id

        const follows = await Follow.find({
            $or: [
                { follower: myId },
                { following: myId }
            ]
        });

        console.log(follows);

        const userIds = new Set();
        follows.forEach(follow => {
            if (follow.follower.toString() !== myId.toString()) {
                userIds.add(follow.follower.toString());
            }
            if (follow.following.toString() !== myId.toString()) {
                userIds.add(follow.following.toString());
            }
        });


        const users = await User.find({ _id: { $in: Array.from(userIds) } })
            .select("-password");

        res.status(200).json(
            new ApiResponse(200, users, "Users Fetched Successfully")
        )

    } catch (error) {
        throw new ApiError(501, "Internal Server Error " + error)
    }

}

const getMessages = async (req, res) => {
    try {

        const myId = req.user._id
        const { id: userToChatId } = req.params

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(
            new ApiResponse(200, messages, "Messages fetched Successfully.")
        )


    } catch (error) {
        throw new ApiError(501, "Internal Server Error " + error)
    }
}

const sendMessage = async (req, res) => {

    try {

        const io = req.app.get("io");


        if (req.file) {
            const myId = req.user._id
            const { id: userToChatId } = req.params
            const { text } = req.body
            const imageLocalPath = req.file?.path;
            const uploadedImage = await uploadOnCloudinary(imageLocalPath)

            const message = await Message.create({
                senderId: myId,
                receiverId: userToChatId,
                text,
                image: uploadedImage.url
            })



            await message.save();

            const receiverSocketIds = getRecieverSocketId(userToChatId);
            if (receiverSocketIds && receiverSocketIds.size > 0) {
                for (const socketId of receiverSocketIds) {
                    io.to(socketId).emit("newMessage", message);
                }
            }


            res.status(200).json(
                new ApiResponse(200, message, "Message sent Successfully.")
            )
        }

        else {
            const myId = req.user._id
            const { id: userToChatId } = req.params
            const { text } = req.body

            const message = await Message.create({
                senderId: myId,
                receiverId: userToChatId,
                text
            })

            await message.save();

            const receiverSocketIds = getRecieverSocketId(userToChatId);
            if (receiverSocketIds && receiverSocketIds.size > 0) {
                for (const socketId of receiverSocketIds) {
                    io.to(socketId).emit("newMessage", message);
                }
            }


            res.status(200).json(
                new ApiResponse(200, message, "Message sent Successfully.")
            )
        }


    } catch (error) {
        throw new ApiError(501, "Internal Server Error " + error)
    }
}


export {
    getUsersForSidebar,
    getMessages,
    sendMessage
}