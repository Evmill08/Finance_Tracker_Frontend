export function validateEmail(email: string): boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim());
}

interface passwordError {
    id: number;
    error: string;
}

export function validatePassword(password: string): number[] {
    const passwordErrors: number[] = [];

    if (password.length < 8) {passwordErrors.push(1)};
    if (!/[A-Z]/.test(password)) {passwordErrors.push(2)};
    if (!/[a-z]/.test(password)) {passwordErrors.push(3)};
    if (!/[0-9]/.test(password)) {passwordErrors.push(4)};
    if (!/[^A-Za-z0-9]/.test(password)) {passwordErrors.push(5)};

    return passwordErrors;
}

export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password == confirmPassword;
}