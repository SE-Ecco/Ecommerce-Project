🧠 Frontend Logic — How It Works

Think of it like a restaurant 🍽️

store = Kitchen fridge 🧊

Holds the data while app is running
Everyone can read from it
Only specific functions can change it

authStore → holds: user, token
cartStore → holds: items, totalPrice
shopStore → holds: shops, currentShop

service = Delivery driver 🚗

Goes to backend → brings back data
Never stores anything
Just fetches and returns

authService.login()  → POST /auth/login → returns { user, token }
shopService.getShops() → GET /shops → returns shops[]
productService.getProducts() → GET /products → returns products[]

hook = Manager 👔

Connects fridge (store) + driver (service)
Page calls hook → hook calls service → saves to store
Pages never touch store or service directly!

useAuth.login() →
  1. calls authService.login()
  2. gets { user, token } back
  3. saves to authStore
  4. returns data to page

useShop.fetchShops() →
  1. calls shopService.getShops()
  2. gets shops[] back
  3. saves to shopStore
  4. returns data to page

page = Waiter 🧑‍🍳

Shows UI to user
Calls hooks to get data
Never calls service directly!
Never touches store directly!

HomePage →
  1. calls useShop().fetchShops()
  2. gets shops[]
  3. renders shops on screen

component = Plate 🍽️

Just displays what page gives it
No logic inside
Gets data via props

ProductCard → receives product → shows image, name, price
OrderCard → receives order → shows status, total, items
🔗 Full Flow Example
User opens HomePage
    ↓
HomePage calls useShop().fetchShops()
    ↓
useShop calls shopService.getShops()
    ↓
shopService calls api.get('/shops')
    ↓
api.ts sends GET http://localhost:5000/api/shops
    ↓
Backend returns [{ id:1, name:'Zaytoon', ... }]
    ↓
shopService returns shops[] to useShop
    ↓
useShop saves to shopStore + returns to HomePage
    ↓
HomePage renders <ShopCard /> for each shop
    ↓
User sees shops on screen ✅
📐 Simple Rule
Page → calls hook
Hook → calls service + updates store
Service → calls api.ts
api.ts → calls backend

Never skip steps! ❌
Page → service directly ❌
Page → store directly ❌
Component → service directly ❌
🆕 New Things in Frontend
1️⃣ JSX/TSX — HTML inside TypeScript
tsx
// Backend → pure TypeScript
const user = { name: 'Jiwar' }
console.log(user.name)

// Frontend → JSX (HTML + TypeScript mixed)
const UserCard = () => {
  const user = { name: 'Jiwar' }
  return (
    <div>
      <h1>{user.name}</h1>  {/* {} = JavaScript inside HTML */}
    </div>
  )
}

Rule: anything inside {} is JavaScript/TypeScript ✅

2️⃣ Props — passing data to components
tsx
// like function parameters but for components
interface Props {
  name: string
  price: number
}

const ProductCard = ({ name, price }: Props) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{price} IQD</p>
    </div>
  )
}

// using it
<ProductCard name="Olive Oil" price={5000} />
3️⃣ useState — local state
tsx
// Backend → no state, just functions
// Frontend → component remembers values

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState('') // '' = initial value
  const [loading, setLoading] = useState(false)

  // read → errorMsg
  // change → setErrorMsg('something went wrong')

  return <div>{errorMsg}</div>
}

Think of it like:

useState = variable that refreshes the screen when it changes
regular variable = doesn't refresh screen
4️⃣ useEffect — run code when something changes
tsx
// runs code after component appears on screen
useEffect(() => {
  fetchShops() // load shops when page opens
}, []) // [] = run only once on mount

// runs when dependency changes
useEffect(() => {
  fetchProducts(shopId) // reload when shopId changes
}, [shopId]) // runs every time shopId changes

Think of it like:

useEffect = "do this when something happens"
[] empty = do once when page opens
[value] = do every time value changes
5️⃣ Formik — form management
tsx
// Without Formik → lots of manual work
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [emailError, setEmailError] = useState('')
// ... very messy!

// With Formik → clean
const formik = useFormik({
  initialValues: { email: '', password: '' },
  validationSchema: loginSchema, // Yup handles validation
  onSubmit: async (values) => {
    await login(values.email, values.password)
  }
})
6️⃣ Yup — validation rules
tsx
// Same as express-validator in backend but for frontend
// Backend:
body('email').isEmail().withMessage('Email must be valid')

// Frontend Yup:
email: Yup.string()
  .email('Email must be valid')
  .required('Email is required')

Same concept, different syntax ✅

7️⃣ React Router — navigation
tsx
// Backend → Express routes
app.get('/api/products', controller)

// Frontend → React Router
<Route path="/products" element={<ProductsPage />} />

// Navigate programmatically
const navigate = useNavigate()
navigate('/login') // go to login page

// Link (like <a> tag but no page refresh)
<Link to="/login">Go to Login</Link>

// Read URL params
const { id } = useParams() // from /products/:id
8️⃣ Zustand — global state
tsx
// Backend → no global state
// Frontend → share data between pages

// Store
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

// Any component can read it
const { user } = useAuthStore() // Page A
const { user } = useAuthStore() // Page B — same data!

Think of it like:

Zustand = global variable everyone can read/write
useState = local variable only this component can use
9️⃣ async/await in components
tsx
// Same as backend! ✅
const handleSubmit = async () => {
  try {
    setLoading(true)
    const data = await authService.login(email, password)
    setAuth(data.user, data.token)
  } catch (error) {
    setErrorMsg('Login failed')
  } finally {
    setLoading(false) // always runs
  }
}
📊 Backend vs Frontend Comparison
Backend                    Frontend
─────────────────────────────────────────
Express routes      →      React Router
Controller          →      Page component
Service             →      Hook + Service
Sequelize model     →      TypeScript type
Middleware          →      ProtectedRoute
req.body            →      Formik values
res.json()          →      useState + render
error.middleware    →      try/catch + errorMsg
JWT token           →      authStore (Zustand)
🎯 Key Differences
1. Backend runs ONCE per request
   Frontend runs CONTINUOUSLY (always in browser)

2. Backend has no UI
   Frontend IS the UI

3. Backend = Node.js
   Frontend = Browser (React)

4. Backend state dies after response
   Frontend state lives until page refresh
   (Zustand persist → survives refresh too!)
   

For 
Anyone Need To Understand The Service 