import { useState } from "react";
import styles from "./InvoiceItemsPage.module.css";
import { getInvoiceItem, createInvoiceItem } from "../../../api/invoiceItemApi.ts";

const InvoiceItemPage = () => {
    // ----- GET EXISTUJÚCEHO ITEMU -----
    const [searchId, setSearchId] = useState("");
    const [item, setItem] = useState<any | null>(null);
    const [loadingGet, setLoadingGet] = useState(false);

    // ----- CREATE NEW ITEM -----
    const [form, setForm] = useState({
        name: "",
        unit: "",
        unitPrice: "",
        quantity: "",
        attendeeId: ""
    });

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [createResult, setCreateResult] = useState<any | null>(null);

    const handleSearch = async () => {
        setLoadingGet(true);
        setItem(null);

        try {
            const result = await getInvoiceItem(Number(searchId));
            setItem(result);
        } catch (err) {
            setItem(null);
            alert("InvoiceItem not found.");
        } finally {
            setLoadingGet(false);
        }
    };

    const handleCreate = async () => {
        if (!form.name || !form.unit || !form.unitPrice || !form.quantity || !form.attendeeId) {
            alert("Please fill all fields.");
            return;
        }

        setLoadingCreate(true);
        setCreateResult(null);

        try {
            const payload = {
                name: form.name,
                unit: form.unit,
                unitPrice: Number(form.unitPrice),
                quantity: Number(form.quantity),
                attendeeId: Number(form.attendeeId)
            };

            const created = await createInvoiceItem(payload);
            setCreateResult(created);
        } catch (err) {
            alert("Failed to create invoice item.");
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <div className={styles.wrapper}>

            <h1>Invoice Items</h1>

            {/* ---------------- GET EXISTUJÚCE ITEMY ---------------- */}
            <section className={styles.card}>
                <h2>Find Invoice Item by ID</h2>

                <div className={styles.row}>
                    <input
                        type="number"
                        placeholder="InvoiceItem ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button onClick={handleSearch} disabled={loadingGet}>
                        {loadingGet ? "Loading..." : "Search"}
                    </button>
                </div>

                {item && (
                    <div className={styles.resultBox}>
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Unit:</strong> {item.unit}</p>
                        <p><strong>Unit Price:</strong> {item.unitPrice}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Total Price:</strong> {item.price}</p>
                    </div>
                )}
            </section>

            {/* ---------------- CREATE NEW ITEM ---------------- */}
            <section className={styles.card}>
                <h2>Create Invoice Item</h2>

                <div className={styles.col}>
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        placeholder="Unit"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Unit Price"
                        value={form.unitPrice}
                        onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Attendee ID"
                        value={form.attendeeId}
                        onChange={(e) => setForm({ ...form, attendeeId: e.target.value })}
                    />

                    <button onClick={handleCreate} disabled={loadingCreate}>
                        {loadingCreate ? "Creating..." : "Create Invoice Item"}
                    </button>
                </div>

                {createResult && (
                    <div className={styles.resultBox}>
                        <h3>Created Successfully</h3>
                        <p><strong>ID:</strong> {createResult.id}</p>
                        <p><strong>Name:</strong> {createResult.name}</p>
                        <p><strong>Price:</strong> {createResult.price}</p>
                    </div>
                )}
            </section>

        </div>
    );
};

export default InvoiceItemPage;