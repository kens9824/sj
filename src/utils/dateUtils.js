/**
 * Format a date string or object to dd/mm/yy
 * @param {string|Date} dateVal 
 * @returns {string} Formatted date
 */
export const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    try {
        const date = new Date(dateVal);
        if (isNaN(date.getTime())) return 'N/A';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return 'N/A';
    }
};

/**
 * Format a date string or object to dd/mm/yy hh:mm AM/PM
 * @param {string|Date} dateVal 
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateVal) => {
    if (!dateVal) return 'N/A';
    try {
        const date = new Date(dateVal);
        if (isNaN(date.getTime())) return 'N/A';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = String(hours).padStart(2, '0');
        
        return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
    } catch (e) {
        return 'N/A';
    }
};

/**
 * Get start and end date strings (YYYY-MM-DD) for presets
 * @param {string} type - today, yesterday, 7days, 15days, month
 * @returns {object} { start, end }
 */
export const getDateRangePreset = (type) => {
    const end = new Date();
    const start = new Date();
    
    // Helper to format to YYYY-MM-DD for date inputs
    const formatYMD = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    switch (type) {
        case 'today':
            // start and end are same
            break;
        case 'yesterday':
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1);
            break;
        case '7days':
            start.setDate(start.getDate() - 6);
            break;
        case '15days':
            start.setDate(start.getDate() - 14);
            break;
        case 'month':
            start.setMonth(start.getMonth() - 1);
            break;
        default:
            return { start: '', end: '' };
    }

    return {
        start: formatYMD(start),
        end: formatYMD(end)
    };
};
