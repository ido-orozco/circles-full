<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import CircleUpdateForm from "../components/CircleInfo/CircleUpdateForm.vue";
import UserListComponent from "../components/CircleInfo/UserListComponent.vue";
import { fetchy } from "../utils/fetchy";

let circle = ref();
const circleId = useRoute().params.circle;

const getCircle = async () => {
  circle.value = await fetchy(`/api/circle/${circleId}`, "GET");
};

onBeforeMount(async () => {
  await getCircle();
});
</script>

<template>
  <main class="column">
    <h1>{{ circle.name }}</h1>
    <CircleUpdateForm :circle="circle" @refreshCircle="getCircle" />
    <UserListComponent :circle="circle" />
  </main>
</template>
