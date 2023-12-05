<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <div v-else>
        <h1>Please login!</h1>
        <p>Get started by creating some Circles of people to post to!</p>
      </div>
    </section>
    <div v-if="isLoggedIn">
      <PostListComponent />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

p {
  text-align: center;
}
</style>
