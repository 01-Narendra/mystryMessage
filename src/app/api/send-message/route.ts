import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request: Request) {
    dbConnect()

    const {username, content} = await request.json()
    try {
        
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        // is User accepting the message
        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting message"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error in sending Messages", error);
        return Response.json(
            {
                success: false,
                message: "Error in sending Messages"
            },
            {
                status: 500
            }
        )
    }
}
