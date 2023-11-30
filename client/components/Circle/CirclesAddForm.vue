<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const emit = defineEmits(["refreshCircles"]);

const emptyForm = () => {
  name.value = "";
};

const createCircle = async (name: string) => {
  try {
    await fetchy(`/api/circles`, "POST", {
      body: { name },
    });
  } catch (_) {
    return;
  }
  emit("refreshCircles");
  emptyForm();
};
</script>

<template>
  <form @submit.prevent="createCircle(name)" class="pure-form">
    <fieldset>
      <legend>Create Circle</legend>
      <input type="text" placeholder="Circle Name" v-model="name" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
</template>
