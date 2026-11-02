import { initializeStorage } from "./storage/index.js";

async function seed() {
  const db = await initializeStorage();

  const custColl = db.collection("customers");
  const custCount = await custColl.count();

  if (custCount === 0) {
    console.log("Seeding sample business data...");

    const c1 = await custColl.insert({
      code: "CUST-001",
      name: "Apex Innovations Ltd",
      contactPerson: "David Miller",
      phone: "+1 (555) 234-5678",
      email: "david@apexinno.com",
      address: "742 Evergreen Terrace, Springfield, OR",
      status: "active",
      notes: "Key enterprise account with annual support agreement"
    });

    const c2 = await custColl.insert({
      code: "CUST-002",
      name: "Starlight Media Group",
      contactPerson: "Sarah Jenkins",
      phone: "+1 (555) 876-5432",
      email: "sarah.j@starlightmedia.io",
      address: "100 Sunset Blvd, Suite 400, Los Angeles, CA",
      status: "active",
      notes: "Net 30 payment terms"
    });

    const c3 = await custColl.insert({
      code: "CUST-003",
      name: "Vanguard Logistics",
      contactPerson: "Michael Chang",
      phone: "+1 (555) 345-6789",
      email: "m.chang@vanguardlog.com",
      address: "12 Harbor Way, Terminal 4, Seattle, WA",
      status: "inactive",
      notes: "Account temporarily on hold"
    });

    const itemColl = db.collection("items");
    const i1 = await itemColl.insert({
      code: "SKU-MBP16",
      name: "MacBook Pro 16 M3 Max",
      sku: "SKU-MBP16",
      category: "Hardware",
      unit: "pcs",
      price: 3499.00,
      cost: 2800.00,
      stock: 14,
      status: "active",
      description: "16-inch Liquid Retina XDR display, 36GB RAM, 1TB SSD"
    });

    const i2 = await itemColl.insert({
      code: "SKU-4KMON",
      name: "Dell UltraSharp 32 4K USB-C Monitor",
      sku: "SKU-4KMON",
      category: "Hardware",
      unit: "pcs",
      price: 899.00,
      cost: 650.00,
      stock: 28,
      status: "active",
      description: "IPS Black panel, 90W power delivery, 98% DCI-P3"
    });

    const i3 = await itemColl.insert({
      code: "SKU-MECHKB",
      name: "Keychron Q1 Pro Mechanical Keyboard",
      sku: "SKU-MECHKB",
      category: "Accessories",
      unit: "pcs",
      price: 199.00,
      cost: 120.00,
      stock: 45,
      status: "active",
      description: "75% layout, CNC aluminum body, hot-swappable"
    });

    const ordColl = db.collection("orders");
    await ordColl.insert({
      orderNumber: "ORD-0001",
      customerId: c1._id,
      customerName: c1.name,
      customerEmail: c1.email,
      date: new Date().toISOString().slice(0, 10),
      status: "confirmed",
      items: [
        { itemId: i1._id, itemName: i1.name, sku: i1.sku, unitPrice: 3499, quantity: 2, lineTotal: 6998 },
        { itemId: i3._id, itemName: i3.name, sku: i3.sku, unitPrice: 199, quantity: 2, lineTotal: 398 }
      ],
      subtotal: 7396,
      taxRate: 5,
      taxAmount: 369.80,
      total: 7765.80,
      notes: "Expedited shipping requested"
    });

    await ordColl.insert({
      orderNumber: "ORD-0002",
      customerId: c2._id,
      customerName: c2.name,
      customerEmail: c2.email,
      date: new Date().toISOString().slice(0, 10),
      status: "shipped",
      items: [
        { itemId: i2._id, itemName: i2.name, sku: i2.sku, unitPrice: 899, quantity: 3, lineTotal: 2697 }
      ],
      subtotal: 2697,
      taxRate: 5,
      taxAmount: 134.85,
      total: 2831.85,
      notes: "Standard courier delivery"
    });

    const invColl = db.collection("invoices");
    await invColl.insert({
      invoiceNumber: "INV-0001",
      customerId: c1._id,
      customerName: c1.name,
      customerEmail: c1.email,
      customerAddress: c1.address,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: "paid",
      items: [
        { description: i1.name, quantity: 2, unitPrice: 3499, amount: 6998 },
        { description: i3.name, quantity: 2, unitPrice: 199, amount: 398 }
      ],
      subtotal: 7396,
      taxRate: 5,
      taxAmount: 369.80,
      discount: 0,
      total: 7765.80,
      notes: "Paid in full via Wire Transfer."
    });

    await invColl.insert({
      invoiceNumber: "INV-0002",
      customerId: c2._id,
      customerName: c2.name,
      customerEmail: c2.email,
      customerAddress: c2.address,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      status: "sent",
      items: [
        { description: i2.name, quantity: 3, unitPrice: 899, amount: 2697 }
      ],
      subtotal: 2697,
      taxRate: 5,
      taxAmount: 134.85,
      discount: 50,
      total: 2781.85,
      notes: "Payment due within 30 days"
    });

    console.log("Seeding complete!");
  } else {
    console.log("Database already has records (" + custCount + " customers).");
  }
}

seed().catch(console.error);
