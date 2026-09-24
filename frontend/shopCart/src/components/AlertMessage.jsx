import React, { useEffect } from "react";
import "../styles/alert.css";

function AlertMessage({ type = "error", message, onClose, duration = 4500 }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;

    return (
        <div className={`alert-message alert-${type}`} role="alert">
            <div className="alert-icon">
                {type === "success" ? "✓" : type === "warning" ? "!" : "×"}
            </div>

            <div className="alert-content">
                <strong>
                    {type === "success"
                        ? "Success"
                        : type === "warning"
                        ? "Check this"
                        : "Something went wrong"}
                </strong>
                <p>{message}</p>
            </div>

            <button
                type="button"
                className="alert-close"
                onClick={onClose}
                aria-label="Close message"
            >
                ×
            </button>
        </div>
    );
}

export default AlertMessage;
