<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const circles = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, circles: string) => {
  //Formatting Circles correctly
  const circleNames = circles.split(",");

  try {
    await fetchy(`/api/posts`, "POST", {
      body: {
        content: content,
        circles: circleNames,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
  circles.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content, circles)">
    <label for="content">Post Contents:</label>
    <textarea class="cont" id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <textarea class="circle" id="circles" v-model="circles" placeholder="List all Circles to post to, separated by commas (no extra whitespace plz)" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.cont {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
.circle {
  font-family: inherit;
  font-size: inherit;
  height: 2em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
