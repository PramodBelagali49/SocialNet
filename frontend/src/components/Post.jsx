import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/Button'

function Post() {
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src='https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk=' alt='profile_pic'></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1>Username</h1>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center bg-white">
                    <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                    <Button variant="ghost" className="cursor-pointer w-fit  font-bold">Add to favourites</Button>
                    <Button variant="ghost" className="cursor-pointer w-fit  font-bold">Delete</Button>
                </DialogContent>
            </Dialog>
        </div>
        <img 
                className='rounded-sm my-2 w-full aspect-sqaure object-cover'
                src="https://media.istockphoto.com/id/1498459479/photo/shiva-on-mountain-peak.webp?a=1&b=1&s=612x612&w=0&k=20&c=tsXTbzOeTQnh_fFAexhdOi2x-enultdzbd6uBN_RRKk=" alt="" />
    </div>
  )
} 

export default Post