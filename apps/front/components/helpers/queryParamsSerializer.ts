const serializeQueryParams = (data: Record<string, unknown>): string => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        const value = data[key];

        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach((item) => {
                params.append(`${key}[]`, item.toString());
            });
        } else {
            params.append(key, value.toString());
        }
    });
    return params.toString();
};

export {serializeQueryParams};
