<template>
  <main class="page-root">
    <section class="panel form-panel">
      <h2 class="panel__title">操作</h2>

      <div class="form-row">
        <label class="label">名字</label>
        <ETextField v-model:value="form.name" placeholder="輸入名字" />
      </div>

      <div class="form-row">
        <label class="label">年齡</label>
        <ETextField v-model:value="form.age" placeholder="輸入年齡" type="number" />
      </div>

      <div class="form-actions">
        <EBtn color="success" @click="onModify">修改</EBtn>
        <EBtn color="warn" :disabled="!!form.id" @click="onAdd">新增</EBtn>
      </div>
    </section>

    <section class="panel list-panel">
      <table class="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>名字</th>
            <th>年齡</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, idx) in store.users" :key="u.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.age }}</td>
            <td class="actions">
              <EBtn color="success" @click="openModifyDialog(u)">修改</EBtn>
              <EBtn color="error" @click="openDeleteDialog(u)">刪除</EBtn>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- Confirm dialogs -->
    <dialog ref="confirmDialog" class="confirm-dialog">
      <form method="dialog" class="dialog-form">
        <p class="dialog-message">{{ confirmMessage }}</p>
        <menu class="dialog-actions">
          <button class="dialog-btn dialog-btn--cancel" value="cancel">取消</button>
          <button class="dialog-btn dialog-btn--confirm" id="confirmBtn" value="ok">
            確認
          </button>
        </menu>
      </form>
    </dialog>

    <!-- Validation error dialog -->
    <dialog ref="errorDialog" class="error-dialog">
      <form method="dialog" class="dialog-form">
        <h3 class="error-title">驗證錯誤</h3>
        <ul class="error-list">
          <li v-for="(e, i) in validationErrors" :key="i">{{ e }}</li>
        </ul>
        <menu class="dialog-actions">
          <button class="dialog-btn dialog-btn--cancel" value="cancel">關閉</button>
        </menu>
      </form>
    </dialog>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import EBtn from "~/components/EBtn.vue";
import ETextField from "~/components/ETextField.vue";
import { useAppStore } from "~/store/app";
import type { User } from "~/store/app";

const store = useAppStore();

const { data: _users } = useAsyncData("users", () => store.fetchUsers(), {
  server: true,
});


const form = reactive<{ id?: number; name: string; age: string | number }>({
  name: "",
  age: "",
});

const confirmDialog = ref<HTMLDialogElement | null>(null);
const confirmMessage = ref("");
const dialogDisabled = ref(false);
const errorDialog = ref<HTMLDialogElement | null>(null);
const validationErrors = ref<string[]>([]);
let confirmCallback: (() => void) | null = null;

const openDialog = (
  message: string,
  cb: () => void,
  opts?: { disableConfirm?: boolean }
) => {
  confirmMessage.value = message;
  confirmCallback = cb;
  dialogDisabled.value = !!opts?.disableConfirm;
  if (confirmDialog.value) confirmDialog.value.showModal();
}

const showValidationErrors = (errors: string[]) => {
  validationErrors.value = errors;
  if (errorDialog.value) errorDialog.value.showModal();
}

const closeDialog = () => {
  if (confirmDialog.value) confirmDialog.value.close();
}

// dialog event handling
if (typeof window !== "undefined") {
  // listen to close event
  setTimeout(() => {
    if (!confirmDialog.value) return;
    confirmDialog.value.addEventListener("close", (e: any) => {
      const returnValue = (e.target as HTMLDialogElement).returnValue;
      // only run callback when confirm was clicked and confirm is enabled
      if (returnValue === "ok" && confirmCallback && !dialogDisabled.value)
        confirmCallback();
      confirmCallback = null;
      // reset disabled state after close
      dialogDisabled.value = false;
    });
  }, 0);
}

const validateForm = (): { ok: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!form.name || String(form.name).trim().length === 0) errors.push("名字不得為空");
  const ageNum = Number(form.age);
  if (!Number.isFinite(ageNum) || ageNum <= 0 || ageNum > 150)
    errors.push("請輸入有效年齡");
  return { ok: errors.length === 0, errors };
}

const onAdd = () => {
  const v = validateForm();
  if (!v.ok) {
    showValidationErrors(v.errors);
    return;
  }
  openDialog("確認新增使用者？", async () => {
    try {
      await store.createUserAsync({ name: String(form.name), age: Number(form.age) });
      await store.fetchUsers();
      form.name = "";
      form.age = "";
      closeDialog();
    } catch (err: any) {
      console.error("createUser error", err);
      const msg = err?.response?.data?.message || err?.message || String(err);
      alert("新增失敗：" + msg);
    }
  });
}

const onModify = () => {
  if (!form.id) {
    openDialog("請先選擇要修改的使用者", () => {});
    return;
  }
  const v = validateForm();
  if (!v.ok) {
    showValidationErrors(v.errors);
    return;
  }
  openDialog("確認修改資料？", async () => {
    try {
      await store.updateUserAsync(form.id as number, {
        name: String(form.name),
        age: Number(form.age),
      });
      await store.fetchUsers();
      form.id = undefined;
      form.name = "";
      form.age = "";
      closeDialog();
    } catch (err: any) {
      console.error("updateUser error", err);
      const msg = err?.response?.data?.message || err?.message || String(err);
      alert("修改失敗：" + msg);
    }
  });
}

const openModifyDialog = (u: User) => {
  form.id = u.id;
  form.name = u.name;
  form.age = u.age;
}

const openDeleteDialog = (u: User) => {
  openDialog(`確認要刪除 ${u.name} 嗎？`, async () => {
    try {
      await store.deleteUserAsync(u.id);
      await store.fetchUsers();
      closeDialog();
    } catch (err: any) {
      console.error("deleteUser error", err);
      const msg = err?.response?.data?.message || err?.message || String(err);
      alert("刪除失敗：" + msg);
    }
  });
}
</script>

<style lang="scss">
:root {
  --bg: #222327;
  --panel: #2b2b2d;
  --muted: rgba(255, 255, 255, 0.7);
}
.page-root {
  min-height: 100vh;
  padding: 24px;
  background: var(--bg);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}
.panel {
  width: 100%;
  max-width: 920px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px;
  border-radius: 14px;
}
.form-panel {
  padding: 22px;
}
.panel__title {
  font-size: 1.2rem;
  margin-bottom: 12px;
  text-align: center;
}
.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.label {
  width: 80px;
  color: var(--muted);
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.list-panel {
  padding: 10px 18px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.user-table thead th {
  color: var(--muted);
  font-size: 0.95rem;
}
.actions {
  display: flex;
  gap: 8px;
}

/* responsive */
@media (max-width: 480px) {
  .label {
    width: 56px;
    font-size: 0.9rem;
  }
  .panel {
    padding: 14px;
  }
  .user-table th,
  .user-table td {
    padding: 8px;
  }
}

dialog {
  border-radius: 8px;
  padding: 18px;
}
.dialog-form p {
  white-space: pre-wrap;
}

/* Confirm dialog styles */
.confirm-dialog,
.error-dialog {
  border: none;
  padding: 0;
}

.confirm-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.confirm-dialog .dialog-form,
.error-dialog .dialog-form {
  background: var(--panel);
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  min-width: 320px;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.dialog-message {
  margin: 0 0 16px 0;
  white-space: pre-wrap;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.dialog-btn--cancel {
  background: #6c757d;
  color: white;
}

.dialog-btn--confirm {
  background: #198754;
  color: white;
}

.dialog-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .confirm-dialog .dialog-form,
  .error-dialog .dialog-form {
    width: 90vw;
    max-width: 90vw;
  }
}
</style>
