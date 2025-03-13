declare global {
    interface RequestInit {
        next?: {
            revalidate?: false | 0 | number;
            tags?: string[];
        };
    }
}

export {};
