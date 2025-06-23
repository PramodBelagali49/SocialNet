import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Textarea } from './ui/textarea';
import { Button } from './ui/Button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function EditProfile() {
    const imageRef=useRef();
    const {user}=useSelector(store=>store.auth);
  return (
    <div className='flex max-w-2xl mx-auto pl-10 my-8'>
        <section className='flex flex-col gap-6 w-full'>
            <h1 className='font-bold text-xl'>Edit profile</h1>
            <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="profile_img"></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-bold text-sm'>{user?.username}</h1>
                        <span className='text-gray-600'>{user?.bio || "bio here..."}</span>
                    </div>
                </div>
                <input ref={imageRef} type="file" className='hidden'/>
                <Button onClick={()=>imageRef.current.click()} className="bg-[#0095f6] h-8 hover:bg-[#84c2eb]">Change photo</Button>
            </div>
            <div>
                <h1 className='font-bold text-xl mb-2'>Bio</h1>
                <Textarea name="bio" className="focus-visible:ring-transparent"/>
            </div>
            <div>
                <h1 className='font-bold text-xl mb-2'>Gender</h1>
                <Select className>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Male" className="text-md">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </section>
    </div>
  )
}

export default EditProfile