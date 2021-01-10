<template>
  <el-dialog title="产品审核" :visible="show" @close="close" width="500px">
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
      id: null,
      form: {
        productName: null,
        status: null,
        amazonSendGoodLink: null,
        rejectReason: null,
      },
      option: {
        labelWidth: "125",
        column: [
          {
            label: "产品名称",
            prop: "productName",
            detail: true,
            span: 24,
          },
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            span: 24,
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
            span: 24,
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
        if (val === "2") {

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
      const { id, productName } = row;
      this.id = id;
      this.productName = productName;
      this.form = {
        productName,
      };
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    // 表单清空
    resetChange() {
      this.form.productName = this.productName;
      this.form.status = null;
    },
    // admin审核提交
    async submit(form, done) {
      const { status, rejectReason } = form;
      const result = await this.$fetchPost(
        "/admin/product/firstReviewed",
        {
          id: this.id,
          status,
          rejectReason,
          type: 'admin'
        },
        {
          allData: true
        }
      );
      done();
      if (!result.success) return;
      this.$message.success('审核成功');
      this.close();
      this.$emit('ok')
    },
  },
};
</script>

<style>
</style>