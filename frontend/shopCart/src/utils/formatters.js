export const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

export const formatTime = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const getShortOrderId = (orderId) => {
    if (!orderId) {
        return "—";
    }

    return `#${orderId.slice(-8).toUpperCase()}`;
};
