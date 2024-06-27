import express from 'express';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173/',
  credentials: true,
  // access-control-allow-credentials:true
  optionSuccessStatus: 200
}

export function DownloadMiddleware(server: any, application: any) {
  return [
    cors<cors.CorsRequest>(),
    express.static('public'),
  ]
} 