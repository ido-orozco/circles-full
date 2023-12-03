<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Change Name, Delete Circle

const name = ref("");

const emit = defineEmits(["refreshCircle"]);
const props = defineProps(["circle"]);

const emptyForm = () => {
  name.value = "";
};

const changeName = async (name: string) => {
  try {
    await fetchy(`/api/circles/${props.circle._id}`, "PATCH", {
      body: { update: { name: name } },
    });
  } catch (_) {
    return;
  }
  emit("refreshCircle");
  emptyForm();
};

const deleteCircle = async () => {
  try {
    await fetchy(`/api/circles/${props.circle._id}`, "DELETE");
  } catch (_) {
    return;
  }
  await router.push({ name: "Circles" });
};
</script>

<template>
  <button class="button-error btn-small pure-button" @click="deleteCircle">Delete Circle</button>
  <form @submit.prevent="changeName(name)" class="pure-form">
    <fieldset>
      <legend>Change Name</legend>
      <input type="text" placeholder="new name" v-model="name" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
</template>
