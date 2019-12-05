<template>
<div class="a">
  <List></List>
</div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import List from "@/components/List.vue";

@Component({
  components: {
    List
  }
})
export default class Main extends Vue {
  created() {
  }
}
</script>
