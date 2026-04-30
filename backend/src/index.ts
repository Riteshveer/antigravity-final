import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
}

// Helper: Send email via Resend REST API (compatible with Cloudflare Workers)
async function sendEmail(apiKey: string, payload: {
  from: string
  to: string
  subject: string
  html: string
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend API error (${res.status}): ${err}`)
  }
  return res.json()
}

const app = new Hono<{ Bindings: Bindings }>()

// Allow frontend to communicate with this backend
app.use('/*', cors({
  origin: ['https://swapna-aakar-e-commerce-main.vercel.app', 'http://localhost:5173'], // Allow both production and local development
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => {
  return c.json({ message: 'SwapnaAakar API is running on Cloudflare Workers + D1!' })
})

// --- Products API ---

// Get all products
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Get product by category
app.get('/api/products/:category', async (c) => {
  const category = c.req.param('category')
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM products WHERE category = ?').bind(category).all()
    return c.json(results)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- Orders API ---

// Create an order
app.post('/api/orders', async (c) => {
  try {
    const body = await c.req.json()
    const { user_id, total_amount, items } = body // items = [{product_id, quantity, price}]
    
    // Generate UUIDs
    const orderId = crypto.randomUUID()
    
    // Using batch for transaction-like behaviour
    const statements = []
    
    // 1. Insert order
    statements.push(
      c.env.DB.prepare('INSERT INTO orders (id, user_id, total_amount) VALUES (?, ?, ?)')
        .bind(orderId, user_id, total_amount)
    )
    
    // 2. Insert items
    for (const item of items) {
      statements.push(
        c.env.DB.prepare('INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)')
          .bind(crypto.randomUUID(), orderId, item.product_id, item.quantity, item.price)
      )
    }
    
    await c.env.DB.batch(statements)
    
    return c.json({ success: true, orderId }, 201)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- Checkout & Email API ---

const getCustomerEmailTemplate = (order: any) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #000; margin: 0;">SwapnaAakar</h1>
      <p style="color: #666; margin: 5px 0 0 0;">Handcrafted with Love</p>
    </div>
    <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
    <p>Hi ${order.name},</p>
    <p>Your order has been successfully placed! We'll start preparing it for delivery right away.</p>
    
    <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
      <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
      <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: #2e7d32; font-weight: bold;">${order.paymentStatus}</span></p>
    </div>

    <h3>Delivery Details</h3>
    <div style="color: #555; line-height: 1.5;">
      <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone}</p>
      <p style="margin: 5px 0;"><strong>Address:</strong> ${order.address}</p>
    </div>

    <h3 style="margin-top: 25px;">Order Summary</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid #eee; background: #fafafa;">
          <th style="text-align: left; padding: 12px;">Product</th>
          <th style="text-align: center; padding: 12px;">Qty</th>
          <th style="text-align: right; padding: 12px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item: any) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; display: flex; align-items: center;">
              ${item.image ? `<img src="${item.image}" width="40" height="40" style="object-fit: cover; border-radius: 4px; margin-right: 12px;" />` : ''}
              <span>${item.name}</span>
            </td>
            <td style="padding: 12px; text-align: center; color: #666;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right; font-weight: 500;">₹${item.price.toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total</td>
          <td style="padding: 12px; text-align: right; font-weight: bold; color: #000; font-size: 1.1em;">₹${order.total.toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 0.85em;">
      <p>If you have any questions, feel free to reply to this email or contact us at SwapnaAakar@gmail.com</p>
      <p>&copy; ${new Date().getFullYear()} SwapnaAakar. All rights reserved.</p>
    </div>
  </div>
`;

const getAdminEmailTemplate = (order: any) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <div style="background: #000; color: #fff; padding: 15px; text-align: center; border-radius: 4px 4px 0 0;">
      <h2 style="margin: 0;">New Order Received</h2>
    </div>
    
    <div style="padding: 20px;">
      <p>A new order has been placed on the storefront.</p>
      
      <div style="background: #fff8e1; padding: 15px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
        <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
      </div>

      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px;">Customer Information</h3>
      <table style="width: 100%; font-size: 0.95em;">
        <tr><td style="width: 100px; padding: 5px 0; color: #666;">Name:</td><td style="padding: 5px 0; font-weight: 500;">${order.name}</td></tr>
        <tr><td style="padding: 5px 0; color: #666;">Email:</td><td style="padding: 5px 0; font-weight: 500;">${order.email}</td></tr>
        <tr><td style="padding: 5px 0; color: #666;">Phone:</td><td style="padding: 5px 0; font-weight: 500;">${order.phone}</td></tr>
        <tr><td style="padding: 5px 0; color: #666; vertical-align: top;">Address:</td><td style="padding: 5px 0; font-weight: 500;">${order.address}</td></tr>
      </table>

      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 25px;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="text-align: left; color: #666; font-size: 0.9em; border-bottom: 1px solid #eee;">
            <th style="padding: 10px 5px;">Item</th>
            <th style="padding: 10px 5px; text-align: center;">Qty</th>
            <th style="padding: 10px 5px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: any) => `
            <tr style="border-bottom: 1px solid #f9f9f9;">
              <td style="padding: 10px 5px;">${item.name}</td>
              <td style="padding: 10px 5px; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px 5px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 15px 5px; text-align: right; font-weight: bold;">Grand Total:</td>
            <td style="padding: 15px 5px; text-align: right; font-weight: bold; font-size: 1.1em;">₹${order.total.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 30px; background: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 0.9em;">
        <p style="margin: 0;"><strong>Note:</strong> Please check the admin dashboard for more details and to update shipping status.</p>
      </div>
    </div>
  </div>
`;

app.post('/api/checkout', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, phone, address, items, total, paymentStatus } = body
    
    // Generate Order ID (ORD + timestamp)
    const orderId = `ORD-${Date.now()}`
    
    const orderWithId = { ...body, orderId }

    // Send emails in parallel using fetch-based helper
    const emailResults = await Promise.allSettled([
      // 1. Send to Customer
      sendEmail(c.env.RESEND_API_KEY, {
        from: 'SwapnaAakar <onboarding@resend.dev>',
        to: email,
        subject: `Order Confirmation - ${orderId}`,
        html: getCustomerEmailTemplate(orderWithId),
      }),
      // 2. Send to Admin
      sendEmail(c.env.RESEND_API_KEY, {
        from: 'SwapnaAakar <onboarding@resend.dev>',
        to: 'swapnaaakar@gmail.com',
        subject: `New Order Received - ${orderId}`,
        html: getAdminEmailTemplate(orderWithId),
      })
    ])

    // Log any email failures silently (don't block order response)
    emailResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send ${index === 0 ? 'customer' : 'admin'} email:`, result.reason?.message)
      }
    })

    return c.json({ 
      success: true, 
      orderId,
      message: "Order processed and confirmation email sent"
    }, 201)

  } catch (e: any) {
    console.error("Checkout error:", e)
    return c.json({ error: e.message }, 500)
  }
})

// --- Users API ---
app.post('/api/users', async (c) => {
  try {
    const body = await c.req.json()
    const { id, email } = body // ID comes from Firebase/Google
    
    await c.env.DB.prepare('INSERT OR IGNORE INTO users (id, email) VALUES (?, ?)')
      .bind(id, email)
      .run()
      
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// --- Admin API ---

// Admin: Get all products
app.get('/admin/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
    // Transform to match AdminProduct type where images is an array and fields are mapped
    const products = results.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      mrp: row.mrp,
      images: [row.image_url],
      description: row.description,
      stock: row.stock,
      rating: 0,
      reviews: 0,
      createdAt: row.created_at
    }))
    return c.json(products)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Admin: Create product
app.post('/admin/products', async (c) => {
  try {
    const body = await c.req.json()
    const id = `p-${Date.now()}`
    
    await c.env.DB.prepare(
      'INSERT INTO products (id, name, description, price, mrp, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(
        id, 
        body.name, 
        body.description || '', 
        body.price, 
        body.mrp || body.price * 1.2, 
        body.category, 
        body.images?.[0] || '', 
        body.stock || 0
      )
      .run()
      
    return c.json({ ...body, id, rating: 0, reviews: 0, createdAt: new Date().toISOString() }, 201)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Admin: Update product
app.patch('/admin/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    const sets = []
    const values = []
    
    if (body.name !== undefined) { sets.push('name = ?'); values.push(body.name) }
    if (body.price !== undefined) { sets.push('price = ?'); values.push(body.price) }
    if (body.mrp !== undefined) { sets.push('mrp = ?'); values.push(body.mrp) }
    if (body.stock !== undefined) { sets.push('stock = ?'); values.push(body.stock) }
    if (body.images && body.images.length > 0) { sets.push('image_url = ?'); values.push(body.images[0]) }
    if (body.category !== undefined) { sets.push('category = ?'); values.push(body.category) }
    
    if (sets.length > 0) {
      values.push(id)
      await c.env.DB.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run()
    }
    
    return c.json({ success: true, id })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Admin: Delete product
app.delete('/admin/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Admin: Analytics Mock
app.get('/admin/analytics', (c) => {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });
  return c.json({
    totals: { users: 15, orders: 42, revenue: 15200, avgOrderValue: 360 },
    signupsByDay: days.map((date, i) => ({ date, count: i + 1 })),
    revenueByDay: days.map((date, i) => ({ date, amount: 1000 + i * 100 })),
    topProducts: [],
    cartAbandonment: { rate: 0.2, abandoned: 10, recovered: 2 },
    productViews: []
  })
})

// Admin: Activity Mock
app.get('/admin/activity', (c) => {
  return c.json([
    { id: "1", at: new Date().toISOString(), type: "order", message: "New order placed" }
  ])
})

export default app
