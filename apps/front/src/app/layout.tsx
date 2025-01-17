import {type ReactNode} from 'react';

type RootLayoutProps = {
    children: ReactNode;
};

async function RootLayout({children}: RootLayoutProps) {
    return (
        <html className="dark">
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
