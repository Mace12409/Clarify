<template>
  <div>
    <Header :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <main class="main-content">
      <h2>Saved Data</h2>
      <p>Name: {{ userData.name }}</p>
      <p>Age: {{ userData.age }}</p>
      <p>Test Result: You were {{ userData.testResult }} seconds off from 30 seconds.</p>
      <p>Time Stopped: {{ userData.stopTime }} seconds</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
const userData = ref({ name: '', age: '', testResult: null, stopTime: null });

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

const loadData = () => {
  const savedData = localStorage.getItem('userData');
  if (savedData) {
    userData.value = JSON.parse(savedData);
  }
};

onMounted(() => {
  applyDarkMode();
  loadData();
});
</script>

<style scoped>
.main-content {
  padding: 80px 20px;
  text-align: center;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 140px);
}

p {
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>