<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import CircleUpdateForm from "../components/CircleInfo/CircleUpdateForm.vue";
import UserListComponent from "../components/CircleInfo/UserListComponent.vue";
import { fetchy } from "../utils/fetchy";

let circle = ref();
const loaded = ref(false);
const _id = useRoute().params.circle;

const getCircle = async () => {
  circle.value = await fetchy(`/api/circle/${_id}`, "GET");
};

onBeforeMount(async () => {
  await getCircle();
  loaded.value = true;
});
</script>

<template>
  <main>
    <h1 v-if="loaded">{{ circle.name }}</h1>
    <CircleUpdateForm />
    <UserListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
