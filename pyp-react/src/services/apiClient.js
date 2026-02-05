const baseUrl = import.meta.env.VITE_API_URL ?? ''

// this is better than Axios interceptors because fetch doesn't have interceptors

const request = async (path, options = {}) => {
    const { body, headers, ...rest } = options;

    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(headers ?? {}),
        },
        ...rest,
    };

    if (body !== undefined) {
        fetchOptions.body =
            typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${path}`, fetchOptions);

    if (!response.ok) {
        let errorBody = null;
        try {
            errorBody = await response.json();
        } catch (_) { }
        const message =
            errorBody?.detail || errorBody?.message || response.statusText || 'Request failed';
        throw new Error(message);
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
};


const authRequest = (path, token, options = {}) => {
    return request(path, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};


const requestForm = async (path, formBody, options = {}) => {
    const body = new URLSearchParams(formBody)
    const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...(options.headers ?? {}),
        },
        body,
        ...options,
    })

    if (!response.ok) {
        let errorBody = null
        try {
            errorBody = await response.json()
        } catch (error) {
            errorBody = null
        }
        const message =
            errorBody?.detail || errorBody?.message || response.statusText || 'Request failed'
        throw new Error(message)
    }

    try {
        return await response.json()
    } catch (error) {
        return null
    }
}

export { request, authRequest, requestForm }
