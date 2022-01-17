<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h4" style="width: 600px">To-Do list</div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 q-pb-md">
            <q-input v-model="todoTask" label="Input Task">
              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="addItem" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="todoList.length > 0">
        <div
          class="row justify-center"
          v-for="(item, index) in todoList"
          :key="index"
        >
          <div class="col-8 q-py-md">
            {{ item.value }}
          </div>
          <div class="col-auto q-py-md">
            <q-btn round dense flat icon="done" @click="removeItem(index)" />
          </div>
        </div>
      </q-card-section>

      <q-card-section v-else>
        <div class="row justify-center">
          <div class="col-12">
            <div class="text-h6">No items in the list</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      todoTask: "",
      todoList: [
        {
          value: "Create an app",
        },
        {
          value: "Build an app",
        },
      ],
    };
  },
  methods: {
    addItem() {
      this.todoList.push({ value: this.todoTask });
    },
    removeItem(index) {
      this.todoList.splice(index, 1);
    },
  },
});
</script>
