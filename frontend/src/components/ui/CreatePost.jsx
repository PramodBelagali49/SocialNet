import React, { useRef } from 'react'
import { Dialog, DialogHeader } from './dialog'
import { DialogContent } from './dialog'
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './Button';

function CreatePost({createIconClicked,setCreateIconClicked}) {
    const createPostHandler=async(e)=>{
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
    const imageRef=useRef();
    return (
    <Dialog open={createIconClicked}>
        <DialogContent onInteractOutside={()=>setCreateIconClicked(false)}>
            <DialogHeader className="text-center font-semibold mx-auto">Create new post</DialogHeader>
            <div className='flex items-center gap-3'>
                <Avatar>
                    <AvatarImage src="" alt="avatar_img"></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-xs'>Username</h1>
                    <span className='text-gray-600 text-xs'>Bio here...</span>
                </div>
            </div>
            <textarea placeholder='Add a caption...' className='focus-visible:ring-transparent border-0' rows='5'></textarea>
            <input ref={imageRef} type="file" className='hidden'/>
            <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095f6] hover:bg-[#66c1f6]'>Select from the device</Button>

        </DialogContent>
    </Dialog>
  )
}

export default CreatePost