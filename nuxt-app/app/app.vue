<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Navigation -->
    <nav class="backdrop-blur-md bg-white/10 border-b border-white/10 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg"></div>
            <span class="text-white font-bold text-xl">YourApp</span>
          </div>
          <div class="hidden md:flex space-x-8">
            <a href="#features" class="text-gray-300 hover:text-white transition">Features</a>
            <a href="#about" class="text-gray-300 hover:text-white transition">About</a>
            <a href="#contact" class="text-gray-300 hover:text-white transition">Contact</a>
          </div>
          <button class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition">
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-32">
      <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="inline-block mb-4">
            <span class="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-500/30">
              ✨ Welcome to Your Nuxt App
            </span>
          </div>
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Amazing
            <span class="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              Experiences
            </span>
          </h1>
          <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Create stunning, performant web applications with modern tools and beautiful design.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105">
              Start Building
            </button>
            <button class="backdrop-blur-md bg-white/10 text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition">
              Learn More
            </button>
          </div>
        </div>

        <!-- Floating Cards -->
        <div class="mt-20 grid md:grid-cols-3 gap-6">
          <div v-for="(card, i) in features" :key="i" 
               class="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group cursor-pointer">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span class="text-2xl">{{ card.icon }}</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ card.title }}</h3>
            <p class="text-gray-400">{{ card.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-black/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-white mb-4">Why Choose Us</h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Everything you need to build modern web applications
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(item, i) in benefits" :key="i"
               class="text-center group">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span class="text-3xl">{{ item.icon }}</span>
            </div>
            <h4 class="text-white font-semibold mb-2">{{ item.title }}</h4>
            <p class="text-gray-400 text-sm">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-12 bg-black/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-400">
          <p>&copy; 2025 YourApp. Built with Nuxt.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized performance for the best user experience'
  },
  {
    icon: '🎨',
    title: 'Beautiful Design',
    description: 'Modern and clean interface that users love'
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Built with security best practices in mind'
  }
];

const benefits = [
  {
    icon: '🚀',
    title: 'Fast Setup',
    description: 'Get started in minutes'
  },
  {
    icon: '📱',
    title: 'Responsive',
    description: 'Works on all devices'
  },
  {
    icon: '🔧',
    title: 'Customizable',
    description: 'Adapt to your needs'
  },
  {
    icon: '💎',
    title: 'Premium',
    description: 'High-quality components'
  }
];
</script>

<style scoped>
.bg-grid-white\/\[0\.05\] {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
</style>