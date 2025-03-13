'use server';

export async function getHostnames(): Promise<string[]> {
    try {
        return (
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servers/hostnames`, {
                next: {tags: ['/servers'], revalidate: 600},
            })
        ).json();
    } catch (_error) {
        return [];
    }
}
