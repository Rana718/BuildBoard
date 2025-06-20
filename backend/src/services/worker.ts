import { Worker, Job } from 'bullmq';
import redis from '../config/redis.config.js';
import {
    sendEmail,
    sendSellerSelectionEmail,
    sendWelcomeEmail,
    sendBidNotificationEmail,
    sendProjectCompletedNotificationEmail
} from '../lib/email.js';
import { EmailJobTypes, QueueJobData } from '../types/queue.js';

// Create email worker
export const emailWorker = new Worker('email-queue', async (job: Job) => {
    const { name, data } = job;

    console.log(`📧 Processing email job: ${name} (ID: ${job.id})`);

    try {
        switch (name as EmailJobTypes) {
            case 'send-email': {
                const emailData = data as QueueJobData['send-email'];
                await sendEmail(emailData.to, emailData.subject, emailData.html);
                break;
            }

            case 'seller-selection-email': {
                const sellerData = data as QueueJobData['seller-selection-email'];
                await sendSellerSelectionEmail(
                    sellerData.sellerEmail,
                    sellerData.sellerName,
                    sellerData.projectTitle,
                    sellerData.buyerName
                );
                break;
            }

            case 'welcome-email': {
                const welcomeData = data as QueueJobData['welcome-email'];
                await sendWelcomeEmail(
                    welcomeData.userEmail,
                    welcomeData.userName
                );
                break;
            }

            case 'bid-notification-email': {
                const bidData = data as QueueJobData['bid-notification-email'];
                await sendBidNotificationEmail(
                    bidData.buyerEmail,
                    bidData.bidderName,
                    bidData.projectTitle,
                    bidData.bidAmount
                );
                break;
            }

            case 'project-completed-email': {
                const completedData = data as QueueJobData['project-completed-email'];
                await sendProjectCompletedNotificationEmail(
                    completedData.buyerEmail,
                    completedData.sellerEmail,
                    completedData.projectTitle,
                    completedData.buyerName,
                    completedData.sellerName
                );
                break;
            }

            default:
                throw new Error(`Unknown email job type: ${name}`);
        }

        console.log(`✅ Email job completed: ${name} (ID: ${job.id})`);
        return { success: true, jobId: job.id, jobType: name };

    } catch (error) {
        console.error(`❌ Email job failed: ${name} (ID: ${job.id})`, error);
        throw error;
    }
}, {
    connection: redis,
    concurrency: 5, // Process up to 5 email jobs concurrently
});

// Worker event handlers
emailWorker.on('ready', () => {
    console.log('🚀 Email worker is ready and waiting for jobs');
});

emailWorker.on('active', (job) => {
    console.log(`⚡ Processing email job: ${job.name} (ID: ${job.id})`);
});

emailWorker.on('completed', (job, result) => {
    console.log(`✅ Email job completed: ${job.name} (ID: ${job.id})`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Email job failed: ${job?.name} (ID: ${job?.id})`, err.message);
});

emailWorker.on('error', (err) => {
    console.error('🔥 Email worker error:', err);
});

// Graceful shutdown function
export const shutdownWorker = async () => {
    console.log('🛑 Shutting down email worker...');
    try {
        await emailWorker.close();
        await redis.disconnect();
        console.log('✅ Email worker shut down successfully');
    } catch (error) {
        console.error('❌ Error shutting down email worker:', error);
    }
};

// Handle process termination
process.on('SIGINT', shutdownWorker);
process.on('SIGTERM', shutdownWorker);

export default emailWorker;