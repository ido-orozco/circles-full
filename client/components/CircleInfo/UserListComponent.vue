<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CircleUserEditForm from "./CircleUserEditForm.vue";

const props = defineProps(["circle"]);

const loaded = ref(false);
let users = ref<Array<string>>([]);

const getUsers = async () => {
  users.value = await fetchy(`/api/circles/${props.circle._id}/users`, "GET");
};

onBeforeMount(async () => {
  await getUsers();
  loaded.value = true;
});
</script>

<template>
  <h2><ins>In this Circle</ins></h2>
  <section class="users" v-if="loaded && users.length !== 0">
    <article v-for="user in users" :key="user">
      <p class="user">{{ user }}</p>
    </article>
  </section>
  <p v-else-if="loaded">No users in circle</p>
  <p v-else>Loading...</p>
  <CircleUserEditForm :circle="circle" @refreshUsers="getUsers()" />
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.user {
  margin: 0 auto;
  max-width: 60em;
  text-align: center;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.user {
  padding: 1em;
}

.user {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
