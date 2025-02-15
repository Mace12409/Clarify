<!-- `Clarify/src/views/NotFound.vue` -->
<template>
  <div :class="['not-found', { 'dark-mode': isDarkMode }]">
    <div class="text-content">
      <h1>404</h1>
      <p>Whoops! That page doesn’t exist.</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
    <img src="@/assets/500.svg" alt="Error Image" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

onMounted(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
});
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: var(--color-background);
  color: var(--color-text);
}

.not-found.dark-mode {
  background-color: var(--color-background-dark);
  color: var(--color-text-dark);
}

.text-content {
  margin-right: 20px;
}

.not-found h1 {
  font-size: 6rem;
  margin: 0;
}

.not-found p {
  font-size: 1.5rem;
  margin: 20px 0;
}

.not-found img {
  max-width: 50%;
  height: auto;
}

.not-found a {
  font-size: 1.2rem;
  color: var(--color-button-bg);
  text-decoration: none;
  transition: color 0.3s;
}

.not-found a:hover {
  color: #003d82;
}
</style>