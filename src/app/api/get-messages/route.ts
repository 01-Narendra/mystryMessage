import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const users: User = session?.user as User
    
    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(users._id)
    
    try {
        // aggregation pipelines
        const user = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: '$messages' },
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push: '$messages'}} }
        ])

        if(!user) {
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

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error in getting Messages", error);
        return Response.json(
            {
                success: false,
                message: "Error in getting Messages"
            },
            {
                status: 500
            }
        )
    }

}