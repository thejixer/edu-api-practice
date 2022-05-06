import express from 'express'
import cors from 'cors'
import path from 'path'
import decodeToken from '../lib/decode-token'

export default app => {

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }));

  app.use(async (req, res, next) => {
    try {

      const token = req.headers.auth || req.cookies.auth;

      if (token != null) {
        const user = await decodeToken(token);
        req.user = user;
      } else {
        req.user = null;
      }
      return next(); 
    } catch (error) {
      req.user = null;
      return next(); 
    }
  })

  app.use(express.static(path.join(process.cwd(), `/src/public/`)));

}