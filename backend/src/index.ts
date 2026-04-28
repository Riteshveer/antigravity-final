import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Allow frontend to communicate with this backend
app.use('/*', cors({
  origin: '*', // In production, replace with your actual frontend URL
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
