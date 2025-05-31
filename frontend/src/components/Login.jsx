import React from "react";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


const Login=()=>{
    const navigate=useNavigate();

    const [input,setInput]=useState({
        username:"",
        password:""
    });
    const [loading,setLoading]=useState(false);

    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const loginHandler=async(e)=>{
        e.preventDefault();
        // console.log("Input : ",input);
        try {
            setLoading(true);
            const res=await axios.post("http://localhost:3600/api/user/login",
                input,
                {
                    headers:{
                        "Content-Type":"application/json"
                    },
                    withCredentials:true
                }
            );
            if(res.data.success){
                navigate("/");
                toast.success(res.data.message)
                setInput({
                    username:"",
                    password:""
                })
            }
        } catch (error) {
            console.log("Error in login handler",error);
            toast.error(error?.response?.data?.message);
        } finally{
            setLoading(false);
        }
    } 

    return(
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={loginHandler} className="shadow-lg flex flex-col gap-8 p-12">
                <div className="mt-4">
                    <h1 className="text-3xl text-center mb-1">Logo</h1>
                    <p className="text-sm text-center">Login to use your account</p>
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
                        <Loader2 className="mx-auto my-auto animate-spin"/>
                    ) : (
                        <Button type="submit" className="bg-black text-white">Login</Button>
                    )
                }
                <span className="text-center text-sm">Not registered yet ? <Link to="/signup" className="text-blue-600 underline">Signup</Link> </span>
            </form>
        </div>
    )
}
export default Login;