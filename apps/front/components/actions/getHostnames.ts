'use server';

export async function getHostnames(): Promise<string[]> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/servers/hostnames`,
        {credentials: 'include', next: {tags: ['/servers']}},
    );

    return response.json();
}
