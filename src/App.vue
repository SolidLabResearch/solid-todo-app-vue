<script setup lang="ts">
import Account from './components/Account.vue'
import TaskList from './components/TaskList.vue'
</script>

<template>
  <header>
    <img src="/solid.svg" class="logo" />
    <h1>Solid Tasks</h1>
    <Suspense>
      <Account />
    </Suspense>
  </header>
  <main>
    <Suspense>
      <TaskList />
    </Suspense>
  </main>
  <footer>
    <p>Yay!</p>
  </footer>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 0 0.2rem grey;
  padding: 1rem 2rem;
  background-color: white;
}

header h1 {
  font-size: 1.0rem;
  margin: 0 auto 0 0.8rem;
  padding: 0;
}

main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 1rem 2rem 6rem 2rem;
}

footer {
  display: flex;
  flex-direction: row;
  margin-top: auto;
  background-color: var(--color-primary);
  padding: 3rem;
}

footer p {
  margin: auto;
  color: whitesmoke;
  font-size: 0.8rem;
}

.logo {
  height: 1.8em;
  width: auto;
}
</style>
