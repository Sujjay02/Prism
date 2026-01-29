import { SavedTemplate } from '../types';

/**
 * Default templates that come pre-installed with NeoForge
 */
export const DEFAULT_TEMPLATES: SavedTemplate[] = [
  // ============ DASHBOARDS ============
  {
    id: 'default-analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Modern analytics dashboard with stats cards, charts placeholder, and sidebar navigation',
    category: 'dashboard',
    createdAt: 0,
    tags: ['analytics', 'stats', 'charts', 'sidebar'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Analytics Dashboard</title>
</head>
<body class="bg-gray-900 text-white min-h-screen">
  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 min-h-screen bg-gray-800 p-4">
      <div class="text-2xl font-bold mb-8 text-blue-400">Dashboard</div>
      <nav class="space-y-2">
        <a href="#" class="flex items-center space-x-2 p-3 rounded-lg bg-blue-600">
          <span>📊</span><span>Analytics</span>
        </a>
        <a href="#" class="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <span>👥</span><span>Users</span>
        </a>
        <a href="#" class="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <span>📦</span><span>Products</span>
        </a>
        <a href="#" class="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700">
          <span>⚙️</span><span>Settings</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-8">Analytics Overview</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Total Revenue</div>
          <div class="text-3xl font-bold text-green-400">$45,231</div>
          <div class="text-green-400 text-sm">+12.5% from last month</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Active Users</div>
          <div class="text-3xl font-bold text-blue-400">2,345</div>
          <div class="text-blue-400 text-sm">+8.2% from last month</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Conversion Rate</div>
          <div class="text-3xl font-bold text-purple-400">3.2%</div>
          <div class="text-purple-400 text-sm">+0.5% from last month</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="text-gray-400 text-sm">Bounce Rate</div>
          <div class="text-3xl font-bold text-orange-400">42%</div>
          <div class="text-red-400 text-sm">-2.1% from last month</div>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="bg-gray-800 rounded-xl p-6 h-80 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <div class="text-6xl mb-4">📈</div>
          <div>Chart Area - Add your visualization here</div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`,
  },

  {
    id: 'default-admin-panel',
    name: 'Admin Panel',
    description: 'Clean admin panel with data table, search, and action buttons',
    category: 'dashboard',
    createdAt: 0,
    tags: ['admin', 'table', 'crud', 'management'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Admin Panel</title>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="max-w-7xl mx-auto p-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
        <span>+</span><span>Add User</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-4">
      <input type="text" placeholder="Search users..." class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <select class="border rounded-lg px-4 py-2">
        <option>All Roles</option>
        <option>Admin</option>
        <option>User</option>
        <option>Guest</option>
      </select>
      <select class="border rounded-lg px-4 py-2">
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left p-4 font-semibold text-gray-600">User</th>
            <th class="text-left p-4 font-semibold text-gray-600">Email</th>
            <th class="text-left p-4 font-semibold text-gray-600">Role</th>
            <th class="text-left p-4 font-semibold text-gray-600">Status</th>
            <th class="text-left p-4 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-gray-50">
            <td class="p-4 flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">JD</div>
              <span class="font-medium">John Doe</span>
            </td>
            <td class="p-4 text-gray-600">john@example.com</td>
            <td class="p-4"><span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Admin</span></td>
            <td class="p-4"><span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Active</span></td>
            <td class="p-4 space-x-2">
              <button class="text-blue-600 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
          <tr class="border-b hover:bg-gray-50">
            <td class="p-4 flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">JS</div>
              <span class="font-medium">Jane Smith</span>
            </td>
            <td class="p-4 text-gray-600">jane@example.com</td>
            <td class="p-4"><span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">User</span></td>
            <td class="p-4"><span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Active</span></td>
            <td class="p-4 space-x-2">
              <button class="text-blue-600 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
          <tr class="hover:bg-gray-50">
            <td class="p-4 flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">BW</div>
              <span class="font-medium">Bob Wilson</span>
            </td>
            <td class="p-4 text-gray-600">bob@example.com</td>
            <td class="p-4"><span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Guest</span></td>
            <td class="p-4"><span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Inactive</span></td>
            <td class="p-4 space-x-2">
              <button class="text-blue-600 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="p-4 border-t flex justify-between items-center">
        <span class="text-gray-600">Showing 1-3 of 24 users</span>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
          <button class="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button class="px-3 py-1 border rounded hover:bg-gray-100">2</button>
          <button class="px-3 py-1 border rounded hover:bg-gray-100">3</button>
          <button class="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  // ============ LANDING PAGES ============
  {
    id: 'default-saas-landing',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS landing page with hero, features, pricing, and CTA sections',
    category: 'landing',
    createdAt: 0,
    tags: ['saas', 'hero', 'pricing', 'features', 'startup'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>SaaS Landing Page</title>
</head>
<body class="bg-white">
  <!-- Navigation -->
  <nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LaunchPad</div>
      <div class="hidden md:flex space-x-8">
        <a href="#features" class="text-gray-600 hover:text-gray-900">Features</a>
        <a href="#pricing" class="text-gray-600 hover:text-gray-900">Pricing</a>
        <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
      </div>
      <div class="flex space-x-4">
        <button class="text-gray-600 hover:text-gray-900">Log in</button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Started</button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="pt-32 pb-20 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">
        Build faster with
        <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-powered</span>
        tools
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Launch your next project in minutes, not months. Our platform gives you everything you need to go from idea to production.
      </p>
      <div class="flex justify-center space-x-4">
        <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">Start Free Trial</button>
        <button class="border border-gray-300 px-8 py-3 rounded-lg text-lg hover:bg-gray-50">Watch Demo</button>
      </div>
      <p class="text-gray-500 mt-4">No credit card required • 14-day free trial</p>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="py-20 bg-gray-50 px-6">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Everything you need to succeed</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">⚡</div>
          <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p class="text-gray-600">Deploy in seconds with our optimized infrastructure and global CDN.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-4">🔒</div>
          <h3 class="text-xl font-semibold mb-2">Secure by Default</h3>
          <p class="text-gray-600">Enterprise-grade security with automatic SSL and DDoS protection.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-4">📈</div>
          <h3 class="text-xl font-semibold mb-2">Scale Effortlessly</h3>
          <p class="text-gray-600">Auto-scaling infrastructure that grows with your business needs.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="py-20 px-6">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
      <p class="text-gray-600 text-center mb-12">No hidden fees. Cancel anytime.</p>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="border rounded-xl p-8">
          <h3 class="text-xl font-semibold mb-2">Starter</h3>
          <div class="text-4xl font-bold mb-4">$9<span class="text-lg text-gray-500">/mo</span></div>
          <ul class="space-y-3 mb-8 text-gray-600">
            <li>✓ 5 Projects</li>
            <li>✓ 10GB Storage</li>
            <li>✓ Basic Analytics</li>
            <li>✓ Email Support</li>
          </ul>
          <button class="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">Get Started</button>
        </div>
        <div class="border-2 border-blue-600 rounded-xl p-8 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Popular</div>
          <h3 class="text-xl font-semibold mb-2">Pro</h3>
          <div class="text-4xl font-bold mb-4">$29<span class="text-lg text-gray-500">/mo</span></div>
          <ul class="space-y-3 mb-8 text-gray-600">
            <li>✓ Unlimited Projects</li>
            <li>✓ 100GB Storage</li>
            <li>✓ Advanced Analytics</li>
            <li>✓ Priority Support</li>
          </ul>
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Get Started</button>
        </div>
        <div class="border rounded-xl p-8">
          <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
          <div class="text-4xl font-bold mb-4">Custom</div>
          <ul class="space-y-3 mb-8 text-gray-600">
            <li>✓ Everything in Pro</li>
            <li>✓ Unlimited Storage</li>
            <li>✓ Custom Integrations</li>
            <li>✓ Dedicated Support</li>
          </ul>
          <button class="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 px-6">
    <div class="max-w-4xl mx-auto text-center text-white">
      <h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
      <p class="text-xl opacity-90 mb-8">Join thousands of developers building with LaunchPad.</p>
      <button class="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">Start Your Free Trial</button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 bg-gray-900 text-gray-400 px-6">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
      <div class="text-2xl font-bold text-white mb-4 md:mb-0">LaunchPad</div>
      <div class="flex space-x-8">
        <a href="#" class="hover:text-white">Privacy</a>
        <a href="#" class="hover:text-white">Terms</a>
        <a href="#" class="hover:text-white">Contact</a>
      </div>
    </div>
  </footer>
</body>
</html>`,
  },

  {
    id: 'default-portfolio',
    name: 'Portfolio',
    description: 'Personal portfolio with hero, projects grid, and contact section',
    category: 'landing',
    createdAt: 0,
    tags: ['portfolio', 'personal', 'projects', 'developer'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Portfolio</title>
</head>
<body class="bg-gray-950 text-white">
  <!-- Hero -->
  <section class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center">
      <div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-8 flex items-center justify-center text-5xl">👨‍💻</div>
      <h1 class="text-5xl font-bold mb-4">John Developer</h1>
      <p class="text-xl text-gray-400 mb-8">Full Stack Developer & UI Designer</p>
      <div class="flex justify-center space-x-4">
        <a href="#projects" class="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">View Work</a>
        <a href="#contact" class="border border-gray-700 px-6 py-3 rounded-lg hover:border-gray-500">Contact Me</a>
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section id="projects" class="py-20 px-6">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-gray-900 rounded-xl overflow-hidden group">
          <div class="h-48 bg-gradient-to-br from-blue-500 to-cyan-500"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">E-commerce Platform</h3>
            <p class="text-gray-400 mb-4">Full-stack e-commerce solution with React and Node.js</p>
            <div class="flex space-x-2">
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">React</span>
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">Node.js</span>
            </div>
          </div>
        </div>
        <div class="bg-gray-900 rounded-xl overflow-hidden group">
          <div class="h-48 bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">AI Dashboard</h3>
            <p class="text-gray-400 mb-4">Analytics dashboard with machine learning insights</p>
            <div class="flex space-x-2">
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">Python</span>
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">TensorFlow</span>
            </div>
          </div>
        </div>
        <div class="bg-gray-900 rounded-xl overflow-hidden group">
          <div class="h-48 bg-gradient-to-br from-orange-500 to-red-500"></div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">Mobile App</h3>
            <p class="text-gray-400 mb-4">Cross-platform mobile app with React Native</p>
            <div class="flex space-x-2">
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">React Native</span>
              <span class="bg-gray-800 px-3 py-1 rounded-full text-sm">Firebase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 px-6 bg-gray-900">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-8">Let's Work Together</h2>
      <p class="text-gray-400 mb-8">Have a project in mind? I'd love to hear about it.</p>
      <form class="space-y-4">
        <input type="email" placeholder="Your email" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500">
        <textarea placeholder="Your message" rows="4" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"></textarea>
        <button class="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700">Send Message</button>
      </form>
    </div>
  </section>
</body>
</html>`,
  },

  // ============ FORMS ============
  {
    id: 'default-login-form',
    name: 'Login / Signup Form',
    description: 'Authentication form with login and signup toggle',
    category: 'form',
    createdAt: 0,
    tags: ['auth', 'login', 'signup', 'form'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Login</title>
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
    <!-- Tabs -->
    <div class="flex mb-8 bg-gray-100 rounded-lg p-1">
      <button id="loginTab" onclick="showLogin()" class="flex-1 py-2 rounded-lg bg-white shadow text-gray-900 font-semibold">Login</button>
      <button id="signupTab" onclick="showSignup()" class="flex-1 py-2 rounded-lg text-gray-500">Sign Up</button>
    </div>

    <!-- Login Form -->
    <div id="loginForm">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Welcome back</h2>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••">
        </div>
        <div class="flex justify-between items-center">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="rounded">
            <span class="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:underline">Forgot password?</a>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Sign In</button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-gray-500 text-sm">Or continue with</p>
        <div class="flex justify-center space-x-4 mt-4">
          <button class="flex items-center space-x-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
            <span>🔵</span><span>Google</span>
          </button>
          <button class="flex items-center space-x-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
            <span>⚫</span><span>GitHub</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Signup Form -->
    <div id="signupForm" class="hidden">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Create account</h2>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••">
        </div>
        <label class="flex items-start space-x-2">
          <input type="checkbox" class="rounded mt-1">
          <span class="text-sm text-gray-600">I agree to the <a href="#" class="text-blue-600 hover:underline">Terms</a> and <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a></span>
        </label>
        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Create Account</button>
      </form>
    </div>
  </div>

  <script>
    function showLogin() {
      document.getElementById('loginForm').classList.remove('hidden');
      document.getElementById('signupForm').classList.add('hidden');
      document.getElementById('loginTab').classList.add('bg-white', 'shadow', 'text-gray-900');
      document.getElementById('loginTab').classList.remove('text-gray-500');
      document.getElementById('signupTab').classList.remove('bg-white', 'shadow', 'text-gray-900');
      document.getElementById('signupTab').classList.add('text-gray-500');
    }
    function showSignup() {
      document.getElementById('signupForm').classList.remove('hidden');
      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('signupTab').classList.add('bg-white', 'shadow', 'text-gray-900');
      document.getElementById('signupTab').classList.remove('text-gray-500');
      document.getElementById('loginTab').classList.remove('bg-white', 'shadow', 'text-gray-900');
      document.getElementById('loginTab').classList.add('text-gray-500');
    }
  </script>
</body>
</html>`,
  },

  {
    id: 'default-checkout-form',
    name: 'Checkout Form',
    description: 'E-commerce checkout with order summary and payment form',
    category: 'form',
    createdAt: 0,
    tags: ['checkout', 'payment', 'ecommerce', 'cart'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Checkout</title>
</head>
<body class="bg-gray-100 min-h-screen py-8">
  <div class="max-w-6xl mx-auto px-4">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Shipping -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input type="text" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Payment Method</h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:border-blue-500">
              <input type="radio" name="payment" checked class="text-blue-600">
              <span>💳 Credit Card</span>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="text" placeholder="MM/YY" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input type="text" placeholder="123" class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-xl p-6 shadow-sm h-fit">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div class="flex-1">
              <div class="font-medium">Product Name</div>
              <div class="text-gray-500 text-sm">Qty: 1</div>
            </div>
            <div class="font-semibold">$99.00</div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div class="flex-1">
              <div class="font-medium">Another Product</div>
              <div class="text-gray-500 text-sm">Qty: 2</div>
            </div>
            <div class="font-semibold">$49.00</div>
          </div>
        </div>
        <div class="border-t mt-4 pt-4 space-y-2">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>$148.00</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>$10.00</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>$12.00</span>
          </div>
          <div class="flex justify-between text-xl font-bold pt-2 border-t">
            <span>Total</span>
            <span>$170.00</span>
          </div>
        </div>
        <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700">Place Order</button>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  // ============ UI COMPONENTS ============
  {
    id: 'default-card-gallery',
    name: 'Card Gallery',
    description: 'Responsive grid of product/content cards with hover effects',
    category: 'ui',
    createdAt: 0,
    tags: ['cards', 'grid', 'gallery', 'products'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Card Gallery</title>
</head>
<body class="bg-gray-100 min-h-screen p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Featured Products</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-pink-400 to-red-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Electronics</div>
          <h3 class="font-semibold text-lg mb-2">Wireless Headphones</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$129</span>
            <div class="flex items-center text-yellow-500">★★★★★</div>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Accessories</div>
          <h3 class="font-semibold text-lg mb-2">Smart Watch Pro</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$299</span>
            <div class="flex items-center text-yellow-500">★★★★☆</div>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-green-400 to-emerald-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Audio</div>
          <h3 class="font-semibold text-lg mb-2">Portable Speaker</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$79</span>
            <div class="flex items-center text-yellow-500">★★★★★</div>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-purple-400 to-violet-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Gaming</div>
          <h3 class="font-semibold text-lg mb-2">Gaming Mouse</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$59</span>
            <div class="flex items-center text-yellow-500">★★★★☆</div>
          </div>
        </div>
      </div>

      <!-- Card 5 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-orange-400 to-amber-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Office</div>
          <h3 class="font-semibold text-lg mb-2">Mechanical Keyboard</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$149</span>
            <div class="flex items-center text-yellow-500">★★★★★</div>
          </div>
        </div>
      </div>

      <!-- Card 6 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
        <div class="h-48 bg-gradient-to-br from-cyan-400 to-teal-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick View</button>
          </div>
        </div>
        <div class="p-5">
          <div class="text-sm text-gray-500 mb-1">Mobile</div>
          <h3 class="font-semibold text-lg mb-2">Phone Stand</h3>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">$29</span>
            <div class="flex items-center text-yellow-500">★★★★☆</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  {
    id: 'default-pricing-table',
    name: 'Pricing Table',
    description: 'Clean pricing table with feature comparison',
    category: 'ui',
    createdAt: 0,
    tags: ['pricing', 'table', 'comparison', 'saas'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Pricing</title>
</head>
<body class="bg-gray-50 min-h-screen py-16 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
      <p class="text-gray-600 text-lg">Start free, upgrade when you're ready</p>

      <!-- Toggle -->
      <div class="flex items-center justify-center mt-8 space-x-4">
        <span class="text-gray-600">Monthly</span>
        <button class="w-14 h-7 bg-blue-600 rounded-full relative">
          <span class="absolute right-1 top-1 w-5 h-5 bg-white rounded-full"></span>
        </button>
        <span class="text-gray-900 font-semibold">Yearly <span class="text-green-500 text-sm">Save 20%</span></span>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Free -->
      <div class="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-gray-900">Free</h3>
        <p class="text-gray-500 mt-2">For individuals getting started</p>
        <div class="mt-6">
          <span class="text-5xl font-bold">$0</span>
          <span class="text-gray-500">/month</span>
        </div>
        <ul class="mt-8 space-y-4">
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">3 projects</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">1GB storage</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">Community support</span>
          </li>
          <li class="flex items-center space-x-3 text-gray-400">
            <span>✗</span>
            <span>Advanced analytics</span>
          </li>
          <li class="flex items-center space-x-3 text-gray-400">
            <span>✗</span>
            <span>Custom domain</span>
          </li>
        </ul>
        <button class="w-full mt-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Get Started</button>
      </div>

      <!-- Pro -->
      <div class="bg-blue-600 rounded-2xl p-8 shadow-lg transform scale-105 relative">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
        <h3 class="text-xl font-semibold text-white">Pro</h3>
        <p class="text-blue-200 mt-2">For growing teams</p>
        <div class="mt-6">
          <span class="text-5xl font-bold text-white">$29</span>
          <span class="text-blue-200">/month</span>
        </div>
        <ul class="mt-8 space-y-4 text-white">
          <li class="flex items-center space-x-3">
            <span>✓</span>
            <span>Unlimited projects</span>
          </li>
          <li class="flex items-center space-x-3">
            <span>✓</span>
            <span>100GB storage</span>
          </li>
          <li class="flex items-center space-x-3">
            <span>✓</span>
            <span>Priority support</span>
          </li>
          <li class="flex items-center space-x-3">
            <span>✓</span>
            <span>Advanced analytics</span>
          </li>
          <li class="flex items-center space-x-3">
            <span>✓</span>
            <span>Custom domain</span>
          </li>
        </ul>
        <button class="w-full mt-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">Upgrade to Pro</button>
      </div>

      <!-- Enterprise -->
      <div class="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-gray-900">Enterprise</h3>
        <p class="text-gray-500 mt-2">For large organizations</p>
        <div class="mt-6">
          <span class="text-5xl font-bold">$99</span>
          <span class="text-gray-500">/month</span>
        </div>
        <ul class="mt-8 space-y-4">
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">Everything in Pro</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">Unlimited storage</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">24/7 dedicated support</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">SSO & SAML</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span class="text-gray-600">Custom contracts</span>
          </li>
        </ul>
        <button class="w-full mt-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Contact Sales</button>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  // ============ GAMES ============
  {
    id: 'default-tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic two-player tic-tac-toe game',
    category: 'game',
    createdAt: 0,
    tags: ['game', 'tic-tac-toe', 'interactive', 'multiplayer'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Tic Tac Toe</title>
</head>
<body class="bg-gray-900 min-h-screen flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold text-white mb-2">Tic Tac Toe</h1>
    <p id="status" class="text-xl text-gray-400 mb-8">Player X's turn</p>

    <div id="board" class="grid grid-cols-3 gap-3 w-80 mx-auto mb-8">
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="0"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="1"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="2"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="3"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="4"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="5"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="6"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="7"></button>
      <button class="cell w-24 h-24 bg-gray-800 rounded-xl text-5xl font-bold text-white hover:bg-gray-700 transition-colors" data-index="8"></button>
    </div>

    <button id="reset" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Reset Game</button>

    <div class="mt-8 flex justify-center gap-8 text-white">
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-400" id="xScore">0</div>
        <div class="text-gray-500">Player X</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-gray-500" id="draws">0</div>
        <div class="text-gray-500">Draws</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-pink-400" id="oScore">0</div>
        <div class="text-gray-500">Player O</div>
      </div>
    </div>
  </div>

  <script>
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { X: 0, O: 0, draws: 0 };

    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset');

    cells.forEach(cell => {
      cell.addEventListener('click', () => handleClick(cell));
    });

    resetBtn.addEventListener('click', resetGame);

    function handleClick(cell) {
      const index = cell.dataset.index;
      if (board[index] || !gameActive) return;

      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add(currentPlayer === 'X' ? 'text-blue-400' : 'text-pink-400');

      if (checkWin()) {
        status.textContent = \`Player \${currentPlayer} wins!\`;
        status.classList.add('text-green-400');
        scores[currentPlayer]++;
        updateScores();
        gameActive = false;
        return;
      }

      if (board.every(cell => cell)) {
        status.textContent = "It's a draw!";
        scores.draws++;
        updateScores();
        gameActive = false;
        return;
      }

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = \`Player \${currentPlayer}'s turn\`;
    }

    function checkWin() {
      return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
      });
    }

    function updateScores() {
      document.getElementById('xScore').textContent = scores.X;
      document.getElementById('oScore').textContent = scores.O;
      document.getElementById('draws').textContent = scores.draws;
    }

    function resetGame() {
      board = ['', '', '', '', '', '', '', '', ''];
      currentPlayer = 'X';
      gameActive = true;
      status.textContent = "Player X's turn";
      status.classList.remove('text-green-400');
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-blue-400', 'text-pink-400');
      });
    }
  </script>
</body>
</html>`,
  },

  // ============ DATA VISUALIZATION ============
  {
    id: 'default-stats-cards',
    name: 'Stats Cards',
    description: 'Animated statistics cards with progress indicators',
    category: 'data-viz',
    createdAt: 0,
    tags: ['stats', 'metrics', 'kpi', 'dashboard'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Stats Cards</title>
  <style>
    @keyframes countUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-count { animation: countUp 0.5s ease-out forwards; }
  </style>
</head>
<body class="bg-gray-900 min-h-screen p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-white mb-8">Performance Overview</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Revenue -->
      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-400 text-sm">Total Revenue</div>
          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">💰</div>
        </div>
        <div class="text-3xl font-bold text-white animate-count">$124,563</div>
        <div class="flex items-center mt-2">
          <span class="text-green-400 text-sm font-medium">↑ 12.5%</span>
          <span class="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
        <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style="width: 75%"></div>
        </div>
      </div>

      <!-- Users -->
      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-400 text-sm">Active Users</div>
          <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">👥</div>
        </div>
        <div class="text-3xl font-bold text-white animate-count">8,942</div>
        <div class="flex items-center mt-2">
          <span class="text-green-400 text-sm font-medium">↑ 8.2%</span>
          <span class="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
        <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style="width: 62%"></div>
        </div>
      </div>

      <!-- Orders -->
      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-400 text-sm">Total Orders</div>
          <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">📦</div>
        </div>
        <div class="text-3xl font-bold text-white animate-count">2,847</div>
        <div class="flex items-center mt-2">
          <span class="text-red-400 text-sm font-medium">↓ 3.1%</span>
          <span class="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
        <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style="width: 45%"></div>
        </div>
      </div>

      <!-- Conversion -->
      <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-400 text-sm">Conversion Rate</div>
          <div class="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">📈</div>
        </div>
        <div class="text-3xl font-bold text-white animate-count">3.24%</div>
        <div class="flex items-center mt-2">
          <span class="text-green-400 text-sm font-medium">↑ 0.5%</span>
          <span class="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
        <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full" style="width: 32%"></div>
        </div>
      </div>
    </div>

    <!-- Chart Placeholder -->
    <div class="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white">Revenue Trend</h2>
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">7D</button>
          <button class="px-3 py-1 text-gray-400 hover:text-white rounded-lg text-sm">30D</button>
          <button class="px-3 py-1 text-gray-400 hover:text-white rounded-lg text-sm">90D</button>
        </div>
      </div>
      <div class="h-64 flex items-end justify-between gap-2">
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 40%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 65%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 45%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 80%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 55%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 70%"></div>
        <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style="height: 90%"></div>
      </div>
      <div class="flex justify-between mt-4 text-gray-500 text-sm">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  // ============ 3D ============
  {
    id: 'default-3d-cube',
    name: '3D Rotating Cube',
    description: 'Interactive 3D cube with React Three Fiber',
    category: '3d',
    createdAt: 0,
    tags: ['3d', 'three.js', 'r3f', 'webgl', 'interactive'],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "react-dom": "https://esm.sh/react-dom@18.2.0?external=react",
        "three": "https://esm.sh/three@0.160.0",
        "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.15.12?external=react,react-dom,three",
        "@react-three/drei": "https://esm.sh/@react-three/drei@9.96.1?external=react,react-dom,three,@react-three/fiber"
      }
    }
  </script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; overflow: hidden; background-color: #000; }
    #root { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    import React, { useRef, useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { Canvas, useFrame } from '@react-three/fiber';
    import { OrbitControls, MeshWobbleMaterial, Environment } from '@react-three/drei';

    function Box({ position, color }) {
      const meshRef = useRef();
      const [hovered, setHovered] = useState(false);

      useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.3;
      });

      return (
        <mesh
          ref={meshRef}
          position={position}
          scale={hovered ? 1.2 : 1}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[2, 2, 2]} />
          <MeshWobbleMaterial
            color={hovered ? '#ff6b6b' : color}
            factor={0.4}
            speed={2}
          />
        </mesh>
      );
    }

    function App() {
      return (
        <div className="w-full h-full bg-black relative">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4444ff" />

            <Box position={[-3, 0, 0]} color="#4ecdc4" />
            <Box position={[0, 0, 0]} color="#ff6b6b" />
            <Box position={[3, 0, 0]} color="#ffe66d" />

            <OrbitControls enableZoom={true} enablePan={false} />
            <Environment preset="city" />
          </Canvas>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-lg opacity-75">Drag to rotate • Scroll to zoom • Hover cubes</p>
          </div>
        </div>
      );
    }

    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,
  },
];

/**
 * Get all default templates
 */
export function getDefaultTemplates(): SavedTemplate[] {
  return DEFAULT_TEMPLATES;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): SavedTemplate[] {
  if (category === 'all') return DEFAULT_TEMPLATES;
  return DEFAULT_TEMPLATES.filter(t => t.category === category);
}

/**
 * Search templates
 */
export function searchTemplates(query: string): SavedTemplate[] {
  const lowerQuery = query.toLowerCase();
  return DEFAULT_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
