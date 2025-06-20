import { Queue } from 'bullmq';
import redis from '../config/redis.config.js';
import { EmailJobTypes, QueueJobData } from '../types/queue.js';

export const emailQueue = new Queue('email-queue', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: true,
    },
});

export class EmailQueueService {
    static async addEmailJob<T extends EmailJobTypes>(
        jobType: T,
        data: QueueJobData[T],
        options?: {
            delay?: number;
            priority?: number;
            attempts?: number;
        }
    ) {
        try {
            const job = await emailQueue.add(jobType, data, {
                delay: options?.delay || 0,
                priority: options?.priority || 0,
                attempts: options?.attempts || 3,
            });

            console.log(`📧 Email job added to queue: ${jobType} (ID: ${job.id})`);
            return job;
        } catch (error) {
            console.error(`❌ Failed to add email job ${jobType}:`, error);
            throw error;
        }
    }

    static async sendEmail(data: QueueJobData['send-email']) {
        return this.addEmailJob('send-email', data);
    }

    static async sendSellerSelectionEmail(data: QueueJobData['seller-selection-email']) {
        return this.addEmailJob('seller-selection-email', data, { priority: 10 });
    }

    static async sendWelcomeEmail(data: QueueJobData['welcome-email']) {
        return this.addEmailJob('welcome-email', data, { delay: 1000 });
    }

    static async sendProjectCompletedEmail(data: QueueJobData['project-completed-email']) {
        return this.addEmailJob('project-completed-email', data, { priority: 8 });
    }

    static async sendBidNotificationEmail(data: QueueJobData['bid-notification-email']) {
        return this.addEmailJob('bid-notification-email', data, { priority: 5 });
    }

    static async getQueueStats() {
        const waiting = await emailQueue.getWaiting();
        const active = await emailQueue.getActive();
        const completed = await emailQueue.getCompleted();
        const failed = await emailQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }

    static async cleanQueue() {
        await emailQueue.clean(24 * 60 * 60 * 1000, 100, 'completed');
        await emailQueue.clean(24 * 60 * 60 * 1000, 50, 'failed');
        console.log('🧹 Email queue cleaned');
    }
}

export default EmailQueueService;
