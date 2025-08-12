const express=require('express');

const app=express();
const jwt=require('jsonwebtoken');

const authenticatAdmin=(req,res,next)=>{
    const token=req.headers['authorization'].split(' ')[1]; // Assuming the token is sent in the Authorization header
    
    console.log("token:", token);
    if(!token) {
        return res.status(401).json({message: 'PLease login first'});
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decoded);
        req.adminId=decoded.id;
        console.log("authenticated admin id:", req.adminId);  
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({message: 'Invalid token'});
    }
}

exports.authenticateUser=(req,res,next)=>{
    const token=req.headers['authorization'].split(' ')[1]; // Assuming the token is sent in the Authorization header
    
    console.log("token:", token);
    if(!token) {
        return res.status(401).json({message: 'PLease login first'});
    }
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decoded);
        req.userId=decoded.id;
        req.role=decoded.role; // Assuming the role is also stored in the token
        console.log("authenticated user id:", req.userId);  
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({message: 'Invalid token'});
    }
}