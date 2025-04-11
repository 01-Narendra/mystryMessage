import  {z} from 'zod'


export const sendMessageSchema = z.object({
    content: z.string().min(10, 'Content must be at least 10 characters'),
})