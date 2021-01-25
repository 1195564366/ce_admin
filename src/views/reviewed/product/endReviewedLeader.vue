<template>
  <el-dialog title="复审审核" :visible="show" width="500px" @close="close" :close-on-click-modal="false">
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
        labelWidth: '120',
        column: [
          {
            label: "产品名称",
            prop: "productName",
            detail: true,
            span: 24,
          },
          {
            label: "管理员复审状态",
            prop: "adminStatus",
            type: "radio",
            span: 24,
            detail: true,
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
          },
          {
            label: "doc文件",
            prop: "adminDoc",
            type: "upload",
            span: 24,
            detail: true,
            listType: "text",
            multiple: false,
            span: 24,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            display: false
          },
          {
            label: "欧代证书",
            prop: "adminOuDaiCe",
            type: "upload",
            span: 24,
            detail: true,
            listType: "text",
            multiple: false,
            span: 24,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            display: false
          },
          {
            label: "驳回原因",
            prop: "adminRejectReason",
            span: 24,
            detail: true,
            display: false
          },
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            span: 24,
            dicData: [
              {
                label: "通过",
                value: "10",
              },
              {
                label: "驳回",
                value: "9",
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
    "form.adminStatus": {
      handler(val) {
        console.log(val);
        const adminDoc = this.findObject(this.option.column, "adminDoc");
        const adminOuDaiCe = this.findObject(this.option.column, "adminOuDaiCe");
        const adminRejectReason = this.findObject(
          this.option.column,
          "adminRejectReason"
        );
        adminDoc.display = false;
        adminOuDaiCe.display = false;
        adminRejectReason.display = false;
        if (val === "7") {
          // 驳回
          adminRejectReason.display = true;
        } else if (val === "8") {
          adminDoc.display = true;
          adminOuDaiCe.display = true;
        }
      },
      immediate: true,
    },
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
        if (val === "9") {
          // 驳回
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else if (val === "10" && this.storageData.adminStatus === '7') {
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
      console.log(row);
      const { id, productName, doc, ouDaiCe, status, rejectReason } = row;
      this.id = id;
      this.form = this.storageData = {
        productName,
        adminDoc: doc,
        adminOuDaiCe: ouDaiCe,
        adminStatus: status,
        adminRejectReason: rejectReason
      };
      this.show = true;
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    async submit(form, done) {
      const { status, rejectReason, ouDaiCe, doc } = form;
      const params = {
        id: this.id,
        status,
        rejectReason,
      }
      if (status === '9') { // 驳回
        params.ouDaiCe = '';
        params.doc = '';
      } else {
        params.ouDaiCe = ouDaiCe.length ? ouDaiCe[0].value : this.storageData.adminOuDaiCe;
        params.doc = doc.length ? doc[0].value : this.storageData.adminDoc;
      }
      const result = await this.$fetchPost('/admin/product/endReviewed', params, { allData: true });
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