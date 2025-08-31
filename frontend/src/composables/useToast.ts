import { useToast as useVueToastification } from 'vue-toastification';
import { h } from 'vue';
import ToastRetry from '@/components/toast/ToastRetry.vue';

export function useToast() {
    const toast = useVueToastification();

    const showSuccess = (message: string) => {
        toast.success(message);
    };

    const showError = (message: string, options?: {
        timeout?: number;
        onClose?: () => void;
    }) => {
        const errorOptions = {
            timeout: options?.timeout || 8000,
            onClose: options?.onClose
        };

        toast.error(message, errorOptions);
    };

    const showWarning = (message: string) => {
        toast.warning(message);
    };

    const showInfo = (message: string) => {
        toast.info(message);
    };

    const showNetworkError = (message: string, retryAction?: () => void | Promise<void>) => {
        const errorMessage = message.includes('Network error')
            ? message
            : `Network error: ${message}`;

        if (retryAction) {
            const toastId = toast.error({
                component: h(ToastRetry, {
                    message: errorMessage,
                    onRetry: retryAction,
                    closeToast: () => toast.dismiss(toastId)
                })
            }, {
                timeout: 15000,
                closeOnClick: false,
                hideProgressBar: true,
            });
        } else {
            showError(errorMessage, {
                timeout: 10000
            });
        }
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showNetworkError
    };
}