"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { sendMessageSchema } from '@/schemas/sendMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Page = () => {

  const param = useParams<{ username: string }>()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState([""])

  const form = useForm<z.infer<typeof sendMessageSchema>>({
      resolver: zodResolver(sendMessageSchema),
  })

  const {register, watch, setValue} = form
  const message = watch('content')

  const onSubmit = async (data: z.infer<typeof sendMessageSchema>) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`/api/send-message`, {
          username: param.username,
          content: data.content
      })
      form.reset()
      toast({
          title: "Success",
          description: response.data.message
      })
  } catch (error) {
      console.error("Error in sending message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
          axiosError.response?.data.message;
      toast({
          title: "Failed to send Message",
          description: errorMessage,
          variant: "destructive",
      });
  } finally {
      setIsSubmitting(false)
  }
  }

  const setMessage = (msg: string) => {
    setValue('content', msg)
  }

  const generateMessages = async () => {
    try {
        setIsGenerating(true)
      const response = await axios.post(`/api/suggest-messages`)
      const messages = response.data.messages.split("||")
      console.log("questions ",messages)
      setQuestions(messages)
      toast({
          title: "Success",
          description: response.data.message
      })
  } catch (error) {
      console.error("Error in generating messages", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
          axiosError.response?.data.message;
      toast({
          title: "Failed to generate messages",
          description: errorMessage,
          variant: "destructive",
      });
  } finally {
    setIsGenerating(false)
  }
}

  return (
    <div className='flex flex-col items-center w-full'>
      <h1 className='text-4xl text-center font-bold p-10'>Public Profile Link</h1>
      <div className='w-[60%] items-center space-y-5'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Send anonymous message to @{param.username}</FormLabel>
                            <FormControl>
                                <Input placeholder="message" {...register} {...field} value={message} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isSubmitting} className='ml-[50%]' type="submit">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </Button>
            </form>
        </Form>
        <Separator />

        <Button disabled={isGenerating} onClick={generateMessages} className='mt-5'>Suggest messages {isGenerating ? <Loader2 className='w-4 h-4 ml-2 animate-spin' /> : <></>} </Button>
        <div className='mt-5'>
            {
                questions?.map((msg, index) => (
                    <p className='p-3 rounded-md hover:bg-gray-200 cursor-pointer' onClick={() => setMessage(msg)} key={index}> {msg} </p>
                ))
            }
        </div>
      </div>
    </div>
  )
}

export default Page