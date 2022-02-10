<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h4" style="width: 600px">To-Do list</div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 q-pb-md">
            <q-input
              v-model="todoTask"
              label="Input Task"
              @keyup.enter="addItem"
            >
              <template v-slot:after>
                <q-btn round dense flat icon="send" @click="addItem()" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="todoList.length > 0">
        <div class="row justify-center" v-for="item in todoList" :key="item.id">
          <div class="col-8 q-py-md">
            {{ item.value }}
          </div>
          <div class="col-auto q-py-md">
            <q-btn round dense flat icon="done" @click="removeItem(item)" />
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
import { useQuasar } from "quasar";
import db from "src/boot/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default defineComponent({
  setup() {
    const $q = useQuasar();

    return {
      emptyNotif(position) {
        $q.notify({
          message: "Task input is empty",
          color: "blue",
          type: "negative",
          position,
        });
      },
      completedNotif(position) {
        $q.notify({
          message: "Task completed",
          color: "green",
          type: "positive",
          position,
        });
      },
      addedNotif(position) {
        $q.notify({
          message: "Task added",
          color: "green",
          type: "info",
          position,
        });
      },
    };
  },

  name: "PageIndex",
  data() {
    return {
      todoTask: "",
      todoList: [],
    };
  },
  methods: {
    addItem() {
      if (this.todoTask !== "") {
        let newTodo = {
          value: this.todoTask,
        };

        // Add a new document with a generated id.
        addDoc(collection(db, "todoList"), newTodo);

        this.todoTask = "";
        this.addedNotif("bottom-right");
      } else {
        this.emptyNotif("bottom-right");
      }
    },
    removeItem(item) {
      deleteDoc(doc(db, "todoList", item.id));
      this.completedNotif("bottom-right");
    },
  },
  mounted() {
    const q = query(collection(db, "todoList"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let todoChange = change.doc.data();
        todoChange.id = change.doc.id;

        if (change.type === "added") {
          console.log("New todo: ", todoChange);
          this.todoList.push(todoChange);
        }
        if (change.type === "modified") {
          console.log("Modified todo: ", todoChange);
        }
        if (change.type === "removed") {
          console.log("Removed todo: ", todoChange);
          let index = this.todoList.findIndex(
            (todo) => todo.id === todoChange.id
          );
          this.todoList.splice(index, 1);
        }
      });
    });
  },
});
</script>
