<template>
  <el-dialog title="复审审核" :visible="show" width="500px" @close="close">
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
      id: null,
      storageData: {},
      form: {},
      option: {
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
                value: "8",
              },
              {
                label: "驳回",
                value: "7",
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
            label: "doc文件",
            prop: "doc",
            type: "upload",
            accept: ".doc,.docx",
            listType: "text",
            multiple: false,
            span: 24,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            limit: 1,
            data: {
              name: "doc文件"
            },
            tip: "只能上传doc/docx文件，且不超过5M",
            action: "/common/uploadFile",
            display: false,
            rules: [],
          },
          {
            label: "欧代证书",
            prop: "ouDaiCe",
            type: "upload",
            accept: ".pdf,.png,.jpeg,.jpg",
            listType: "text",
            multiple: false,
            span: 24,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            limit: 1,
            data: {
              name: "欧代证书"
            },
            tip: "只能上传pdf文件或jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            display: false,
            rules: [],
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            type: "textarea",
            span: 24,
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
        const doc = this.findObject(this.option.column, "doc");
        const ouDaiCe = this.findObject(this.option.column, "ouDaiCe");
        const rejectReason = this.findObject(
          this.option.column,
          "rejectReason"
        );
        doc.display = false;
        doc.rules = [];

        ouDaiCe.display = false;
        ouDaiCe.rules = [];

        rejectReason.display = false;
        rejectReason.rules = [];
        if (val === "7") {
          // 驳回
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else if (val === "8") {
          doc.display = true;
          doc.rules = [
            {
              required: true,
              message: "上传doc文件",
            },
          ];

          ouDaiCe.display = true;
          ouDaiCe.rules = [
            {
              required: true,
              message: "上传欧代证书",
            },
          ];
        }
      },
      immediate: true,
    },
  },
  methods: {
    open(row) {
      const { id, productName } = row;
      this.id = id;
      this.form = this.storageData = {
        productName,
      };
      this.show = true;
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    async submit(form, done) {
      const { status, rejectReason, ouDaiCe, doc } = form;
      const result = await this.$fetchPost('/admin/product/endReviewed', {
        id: this.id,
        status,
        rejectReason,
        ouDaiCe: ouDaiCe.length ? ouDaiCe[0].value : null,
        doc: doc.length ? doc[0].value : null
      }, { allData: true });
      done();
      if (!result.success) return
      this.$message.success('审核成功');
      this.close();
      this.$emit('ok');
    },
    resetChange() {
      const { productName } = this.storageData;
      this.form.productName = productName;
    },
  },
};
</script>

<style>
</style>