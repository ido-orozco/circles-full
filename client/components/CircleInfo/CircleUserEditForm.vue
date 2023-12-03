<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const addName = ref("");
const delName = ref("");
const emit = defineEmits(["refreshUsers"]);
const props = defineProps(["circle"]);

const emptyAddForm = () => {
  addName.value = "";
};
const emptyDelForm = () => {
  delName.value = "";
};

const addUser = async (username: string) => {
  try {
    await fetchy(`/api/circles/${props.circle._id}/${username}`, "POST");
  } catch (_) {
    return;
  }
  emit("refreshUsers");
  emptyAddForm();
};

const deleteUser = async (username: string) => {
  try {
    await fetchy(`/api/circles/${props.circle._id}/${username}`, "DELETE");
  } catch (_) {
    return;
  }
  emit("refreshUsers");
  emptyDelForm();
};
</script>

<template>
  <form @submit.prevent="addUser(addName)" class="pure-form">
    <fieldset>
      <legend>Add User</legend>
      <input type="text" placeholder="username" v-model="addName" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
  <form @submit.prevent="deleteUser(delName)" class="pure-form">
    <fieldset>
      <legend>Remove User</legend>
      <input type="text" placeholder="username" v-model="delName" required />
      <button type="submit" class="pure-button pure-button-primary">Submit</button>
    </fieldset>
  </form>
</template>
