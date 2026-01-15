type PasswordRequirement = {
    id: string;
    label: string;
    isValid: (password: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
    {
        id: "length",
        label: "At least 8 characters",
        isValid: (p) => p.length >= 8,
    },
    {
        id: "uppercase",
        label: "At least one uppercase letter",
        isValid: (p) => /[A-Z]/.test(p),
    },
    {
        id: "lowercase",
        label: "At least one lowercase letter",
        isValid: (p) => /[a-z]/.test(p),
    },
    {
        id: "number",
        label: "At least one number",
        isValid: (p) => /[0-9]/.test(p),
    },
    {
        id: "special",
        label: "At least one special character",
        isValid: (p) => /[^A-Za-z0-9]/.test(p),
    },
];