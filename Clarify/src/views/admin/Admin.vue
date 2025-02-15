<template>
  <div class="admin">
    <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <main class="main-content">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

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
</style>