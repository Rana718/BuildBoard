interface Project {
    id: string;
    title: string;
    description: string;
    budgetRange: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    imageUrl?: string;
    createdAt: string;
    buyer: {
        id: string;
        name: string;
        email: string;
        profileImageUrl?: string;
    };
    seller?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl?: string;
    };
    _count: {
        bids: number;
        deliverables?: number;
    };
}

interface ProjectFullData {
    id: string
    title: string
    description: string
    budgetRange: string
    deadline: string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    imageUrl?: string
    createdAt: string
    buyer: {
        id: string
        name: string
        email: string
        profileImageUrl?: string
    }
    seller?: {
        id: string
        name: string
        email: string
        profileImageUrl?: string
    }
    bids: Array<{
        id: string
        bidAmount: number
        estimatedCompletionTime: string
        message: string
        createdAt: string
        seller: {
            id: string
            name: string
            email: string
            profileImageUrl?: string
        }
    }>
    deliverables: Array<{
        id: string
        fileUrl: string
        uploadedAt: string
    }>
    reviews: Array<{
        id: string
        rating: number
        comment?: string
        createdAt: string
        buyer: {
            id: string
            name: string
            profileImageUrl?: string
        }
    }>
}

interface ProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'BUYER' | 'SELLER';
        profileImageUrl?: string;
        bio?: string;
        skills: string[];
        averageRating: number;
        totalReviews: number;
        createdAt: string;
        _count: {
            projectsAsBuyer: number;
            projectsAsSeller: number;
            reviewsReceived: number;
        };
    };
    projectStats: any;
    reviews: any[];
    ratingStats: Record<string, number>;
}


export type { Project, ProfileData, ProjectFullData };