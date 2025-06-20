#!/usr/bin/env node
import dotenv from 'dotenv';
import './worker.js';

dotenv.config();

console.log('🚀 Starting BuildBoard Email Worker...');
console.log(`📧 Redis Host: ${process.env.REDIS_HOST || 'localhost'}`);
console.log(`📧 Redis Port: ${process.env.REDIS_PORT || '6379'}`);
console.log('✅ Email worker is running and ready to process jobs');


process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
