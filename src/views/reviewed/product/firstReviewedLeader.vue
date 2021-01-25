<template>
  <el-dialog title="初审审核" :visible="show" @close="close"  width="500px" :close-on-click-modal="false">
    <avue-form
      :option="option"
      v-model="form"
      @submit="submit"
      ref="form"
      @reset-change="resetChange"
    ></avue-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      productName: null,
      adminStatus: null,
      adminRejectReason: null,
      id: null,
      form: {
        status: null,
        rejectReason: null,
      },
      option: {
        labelWidth: "125",
        span: 24,
        column: [
          {
            label: "产品名称",
            prop: "productName",
            detail: true
          },
          {
            label: "管理员审核状态",
            prop: "adminStatus",
            type: 'radio',
            detail: true,
            dicData: [
              {
                label: "通过",
                value: "3",
              },
              {
                label: "驳回",
                value: "2",
              },
            ],
          },
          {
            label: "管理员驳回原因",
            prop: "adminRejectReason",
            detail: true,
            display: false
          },
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            dicData: [
              {
                label: "通过",
                value: "5",
              },
              {
                label: "驳回",
                value: "4",
              },
            ],
            rules: [
              {
                required: true,
                message: "选择审核状态",
              },
            ],
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            type: "textarea",
            display: false,
            rules: [],
          },
        ],
      },
    };
  },
  watch: {
    "form.status": {
      handler(val) {
        const rejectReason = this.findObject(
          this.option.column,
          "rejectReason"
        );
        if (val === '4') {
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else {
          rejectReason.display = false;
          rejectReason.rules = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    open(row) {
      this.show = true;
      const { id, productName, status, rejectReason } = row;
      console.log(row);
      this.id = id;
      this.productName = productName;
      this.adminStatus = status;
      this.adminRejectReason = rejectReason;
      this.form = {
        productName,
        adminStatus: status,
        adminRejectReason: rejectReason,
      };
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    // 表单清空
    resetChange() {
      this.form.productName = this.productName;
      this.form.adminStatus = this.adminStatus;
      this.form.adminRejectReason = this.adminRejectReason;
      this.form.status = null;
    },
    // leader审核提交
    async submit(form, done) {
      const { status, rejectReason } = form;
      const result = await this.$fetchPost(
        "/admin/product/firstReviewed",
        {
          id: this.id,
          status,
          rejectReason,
          type: 'leader'
        },
        {
          allData: true,
        }
      );
      done();
      if (!result.success) return;
      this.$message.success("审核成功");
      this.close();
      this.$emit("ok");
    },
  },
};
</script>

<style>
</style>