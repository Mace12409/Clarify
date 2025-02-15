<template>
  <header class="horizontal-header">
    <div class="header-left">
      <h1 @click="goHome">Clarify</h1>
    </div>
    <div class="header-right">
      <button @click="$emit('toggle-dark-mode')">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isDarkMode: Boolean
});

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.horizontal-header {
  width: 100%;
  height: 60px;
  background: var(--color-header-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--color-text);
}

.header-left h1 {
  font-size: 1.5rem;
  margin: 0;
  cursor: pointer;
}

.header-right button {
  background: var(--color-button-bg);
  color: var(--color-button-text);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.header-right button:hover {
  opacity: 0.8;
}
</style>