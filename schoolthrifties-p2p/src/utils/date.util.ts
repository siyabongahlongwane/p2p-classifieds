export const formatDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        return new Intl.DateTimeFormat('en-ZA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};