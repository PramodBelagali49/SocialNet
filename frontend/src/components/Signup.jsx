import React, { useEffect } from "react";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { useState } from "react";
import axios from "axios";
// import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Signup=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [input,setInput]=useState({
        username:"",
        email:"",
        password:""
    });
    const [loading,setLoading]=useState(false);

    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const signupHandler=async(e)=>{
        e.preventDefault();
        // console.log("Input : ",input);
        try {
            setLoading(true);
            const res=await axios.post("http://localhost:3600/api/user/signup",input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                dispatch(setAuthUser(res.data.user))
                setInput({
                    username:"",
                    email:"",
                    password:""
                })
                navigate("/");
            }

        } catch (error) {
            console.log("Error in SignUp handler",error);
            // toast.error(error.response);
            toast.error(error?.response?.data?.message);
            
        } finally{
            setLoading(false);
        }
    }

    const {user}=useSelector(store=>store.auth);
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return(
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="mt-4">
                    <h1 className="text-3xl text-center mb-1">Logo</h1>
                    <p className="text-sm text-center">Signup to see all the photos and videos</p>
                </div>

                <div>
                    <Label className="mb-2 font-medium">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                        
                    />
                </div>

                <div>
                    <Label className="mb-2 font-medium">Email</Label>
                    <Input
                        type="email"
                        className="focus-visible:ring-transparent"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>

                <div>
                    <Label className="mb-2 font-medium">Password</Label>
                    <Input
                        type="password"
                        className="focus-visible:ring-transparent"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>

                {
                    loading ? (
                        <Loader2 className="mx-auto animate-spin"/>
                    ) : (
                        <Button type="submit" className="bg-black text-white">Signup</Button>       
                    )
                }
                <span className="text-center text-sm">Already have an account ? <Link to="/login" className="text-blue-600 underline">login</Link> </span>
            </form>
        </div>
    )
}
export default Signup;