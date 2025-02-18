interface ParsedCookie {
    name: string;
    value: string;
    path?: string;
    expires?: Date;
    domain?: string;
    sameSite?: string;
    httpOnly?: boolean;
    secure?: boolean;
}

export default function parseCookieString(cookieStr: string): ParsedCookie {
    const parts = cookieStr.split(';').map((part) => part.trim());

    const [name, ...valueParts] = parts[0].split('=');
    const value = valueParts.join('=');

    const cookie: ParsedCookie = {
        name,
        value,
    };

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes('=')) {
            const [attrName, ...attrValueParts] = part.split('=');
            const attrValue = attrValueParts.join('=').trim();
            switch (attrName.toLowerCase()) {
                case 'path':
                    cookie.path = attrValue;
                    break;
                case 'expires':
                    cookie.expires = new Date(attrValue);
                    break;
                case 'domain':
                    cookie.domain = attrValue;
                    break;
                case 'samesite':
                    cookie.sameSite = attrValue;
                    break;
            }
        } else {
            const flag = part.toLowerCase();
            if (flag === 'httponly') {
                cookie.httpOnly = true;
            } else if (flag === 'secure') {
                cookie.secure = true;
            }
        }
    }

    return cookie;
}
