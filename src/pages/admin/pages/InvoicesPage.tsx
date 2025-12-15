import { useState } from "react";
import type { Invoice } from "../../../types/types";
import {createInvoice, getInvoice} from "../../../api/invoiceApi";

const InvoicePage = () => {
    const [customerId, setCustomerId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!customerId || !supplierId || !issueDate || !dueDate) return;

        setLoading(true);

        const created = await createInvoice({
            customerId: Number(customerId),
            supplierId: Number(supplierId),
            issueDate,
            dueDate
        });

        const full = await getInvoice(created.id);
        setInvoice(full);

        setLoading(false);
    };

    return (
        <div className="admin-page">
            {/* HEADER */}
            <div className="admin-header">
                <h1>Invoices</h1>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Create invoice</h2>

                <div className="admin-form">
                    <div className="admin-field">
                        <label className="admin-label">Supplier ID</label>
                        <input
                            type="number"
                            className="admin-input"
                            value={supplierId}
                            onChange={e => setSupplierId(e.target.value)}
                            placeholder="e.g. 1"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Customer ID</label>
                        <input
                            type="number"
                            className="admin-input"
                            value={customerId}
                            onChange={e => setCustomerId(e.target.value)}
                            placeholder="e.g. 12"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Issue date</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={issueDate}
                            onChange={e => setIssueDate(e.target.value)}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Due date</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>

                    <button
                        className="admin-btn"
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>

            {/* RESULT */}
            {!invoice ? (
                <div className="admin-empty">
                    No invoice created yet
                </div>
            ) : (
                <div className="admin-list">
                    <div className="admin-card">
                        <div>
                            <h3>Invoice {invoice.invoiceNumber}</h3>
                            <p>
                                Issue: {invoice.issueDate}<br />
                                Due: {invoice.dueDate}
                            </p>
                            <p>
                                Total: <strong>{invoice.totalPrice} €</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicePage;