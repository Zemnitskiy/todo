<template>
  <q-page class="flex flex-center">
    <q-card class="my-card q-mt-md q-mb-md">
      <q-card-section>
        <div class="text-h4" style="width: 600px">Add new task</div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 q-pb-md">
            <q-input
              v-model="todoTask"
              label="Input Task"
              @keyup.enter="addItem()"
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
        <div
          class="row justify-around q-card q-mb-md"
          v-for="item in todoList"
          :key="item.id"
        >
          <div class="col-8 q-py-md flex">
            <span class="self-center"> {{ item.value }} </span>
          </div>
          <div class="col-auto q-py-md">
            <q-btn
              color="green"
              dense
              round
              flat
              icon="done"
              @click="removeItem(item)"
            >
              <q-tooltip
                class="bg-green"
                anchor="top middle"
                self="bottom middle"
              >
                Done
              </q-tooltip>
            </q-btn>
            <q-btn
              color="blue"
              dense
              round
              flat
              icon="edit"
              @click="prompt(item)"
            >
              <q-tooltip
                class="bg-blue"
                anchor="top middle"
                self="bottom middle"
                >Edit</q-tooltip
              >
            </q-btn>
            <q-btn color="red" dense round flat icon="delete">
              <q-tooltip class="bg-red" anchor="top middle" self="bottom middle"
                >Delete</q-tooltip
              >
            </q-btn>
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
  updateDoc,
} from "firebase/firestore";

export default defineComponent({
  setup() {
    const $q = useQuasar();

    return {
      //Notify methods
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
      //Dialog methods
      prompt(item) {
        $q.dialog({
          title: "Edit task",
          // message: "Type to edit",
          prompt: {
            model: item.value,
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            console.log(">>>> OK, received", data);

            const todoRef = doc(db, "todoList", item.id);
            updateDoc(todoRef, {
              value: data,
            });
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
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
      let newTodo = {
        value: this.todoTask,
      };

      if (this.todoTask !== "") {
        addDoc(collection(db, "todoList"), newTodo); // Add a new document with a generated id.

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
          this.todoList.unshift(todoChange);
        }
        if (change.type === "modified") {
          console.log("Modified todo: ", todoChange);
          let index = this.todoList.findIndex(
            (todo) => todo.id === todoChange.id
          );
          this.todoList.splice(index, 1, todoChange);
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

<style scoped>
.lh {
  vertical-align: middle;
}
</style>
