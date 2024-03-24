export const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
    email: (v: string) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(v) || 'Please enter a valid email address'
    },
    required: (v: any) => !!v || 'This field is required',
    customMinWidth: (v: string) => {
        return v.length >= 8 || 'This field must be at least 8 characters long'
    },
    customUppercaseLowercase: (v: string) => {
        const pattern = /(?=.*[a-z])(?=.*[A-Z])/
        return pattern.test(v) || 'This field must contain both uppercase and lowercase letters'
    },
}
