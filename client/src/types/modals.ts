export type ErrorModalPropsType = {
    errorTitle: string;
    errorMessage?: string | "";
    needErrorButtonLeft?: boolean;
    errorButtonLeftText?: string | "";
    needErrorButtonRight?: boolean;
    errorButtonRightText?: string | "";
};

export type SuccessModalPropsType = {
    successTitle: string;
    successMessage: string;
    needSuccessButtonRight: boolean;
    successButtonRightText: string;
};

export type LoadingModalPropsType = {
    loadingTitle: string;
    loadingMessage?: string | null;
};
