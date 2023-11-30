<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
let circles = ref<Array<Record<string, string>>>([]);

async function getCircles() {
  let circleResults;
  try {
    circleResults = await fetchy(`/api/circles`, "GET");
  } catch (_) {
    return;
  }
  circles.value = circleResults;
}

onBeforeMount(async () => {
  await getCircles();
  loaded.value = true;
});
</script>

<template>
  <section class="circles" v-if="loaded && circles.length !== 0">
    <article v-for="circle in circles" :key="circle._id">
      <RouterLink :to="{ name: 'Circles Info', params: { circle: circle._id } }">
        <p class="circle">{{ circle.name }}</p>
      </RouterLink>
    </article>
  </section>
  <p v-else-if="loaded">No circles found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.circle {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.circles {
  padding: 1em;
}

.circle {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
