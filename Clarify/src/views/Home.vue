<template>
  <div class="home">
    <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <main class="main-content">
      <section class="hero">
        <h2>Welcome to Clarify</h2>
        <p>Enjoy light and dark mode with a clean and simple design.</p>
        <button @click="startTesting" class="btn">Start Testing</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const router = useRouter();

const applyDarkMode = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', isDarkMode.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  applyDarkMode();
};

const startTesting = () => {
  router.push('/testing');
};

onMounted(() => {
  applyDarkMode();
});
</script>

<style scoped>
.main-content {
  padding: 80px 20px;
  text-align: center;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 140px);
}

.hero {
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn {
  animation: button-bounce 1s infinite;
}
</style>