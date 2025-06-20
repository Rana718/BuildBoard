// Email job types and interfaces

export interface EmailJobData {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export interface SellerSelectionEmailData {
    sellerEmail: string;
    sellerName: string;
    projectTitle: string;
    buyerName: string;
}

export type EmailJobTypes =
    | 'send-email'
    | 'seller-selection-email'
    | 'welcome-email'
    | 'project-completed-email'
    | 'bid-notification-email';

export interface QueueJobData {
    'send-email': EmailJobData;
    'seller-selection-email': SellerSelectionEmailData;
    'welcome-email': { userEmail: string; userName: string };
    'project-completed-email': {
        buyerEmail: string;
        sellerEmail: string;
        projectTitle: string;
        buyerName: string;
        sellerName: string;
    };
    'bid-notification-email': {
        buyerEmail: string;
        bidderName: string;
        projectTitle: string;
        bidAmount: number;
    };
}
